const SiteSettings = require('../models/SiteSettings');
const Service = require('../models/Service');
const PricingPlan = require('../models/PricingPlan');
const asyncHandler = require('../middleware/asyncHandler');

const defaultSiteSettings = {
  siteName: 'Scalax Labs',
  tagline: 'Growth-driven digital strategy',
  description:
    'We help ambitious brands grow with strategy, design, web experiences, and measurable digital performance.',
  logoUrl: '',
  faviconUrl: '',
  primaryColor: '#6366f1',
  accentColor: '#a855f7',
  contactEmail: 'priyadharshanganeshan2004@gmail.com',
  phone: '+91 9080399984',
  address: '123 Business Avenue, New York, NY',
  whatsapp: '',
  facebook: '',
  instagram: '',
  linkedin: '',
  youtube: '',
  seoTitle: 'Scalax Labs | Digital Marketing Agency',
  seoDescription:
    'Scalax Labs is a premier digital marketing agency delivering innovative solutions in web development, SEO, social media marketing, and more.',
  heroBadge: 'Digital growth partner for ambitious brands',
  heroTitle: 'Growth-driven digital strategy',
  heroTitleLine1: 'Growth-driven',
  heroTitleLine2: 'digital',
  heroHighlight: 'strategy',
  heroDescription:
    'We blend strategy, creative execution, and measurable performance to help brands grow with clarity and confidence.',
  heroPrimaryCta: 'Start your project',
  heroPrimaryCtaLink: '/book-consultation',
  heroSecondaryCta: 'See our work',
  heroSecondaryCtaLink: '/portfolio',
  heroTrustedLabel: 'Trusted by Industry Leaders',
  heroTrustedBrands: [
    { name: 'TechFlow', logo: '' },
    { name: 'CloudBase', logo: '' },
    { name: 'DataSync', logo: '' },
    { name: 'PixelEdge', logo: '' },
    { name: 'VivaNova', logo: '' },
    { name: 'BlueShift', logo: '' },
  ],
};

// Fields added after the initial schema deployment.
// If the existing MongoDB document is missing any of these,
// we write the defaults in-place so the public API always returns them.
const MIGRATABLE_FIELDS = [
  'heroTitleLine1',
  'heroTitleLine2',
  'heroHighlight',
  'heroPrimaryCtaLink',
  'heroSecondaryCtaLink',
  'heroTrustedLabel',
  'heroTrustedBrands',
];

const cleanupDuplicateSettings = async () => {
  const docs = await SiteSettings.find({}).sort({ updatedAt: -1 });
  if (docs.length > 1) {
    console.warn(`[CMS] ⚠ WARNING: Found ${docs.length} SiteSettings documents. Cleaning up duplicates, keeping the most recently updated one.`);
    const keepId = docs[0]._id;
    await SiteSettings.deleteMany({ _id: { $ne: keepId } });
    return docs[0];
  }
  return docs[0] || null;
};

const ensureSiteSettings = async () => {
  let settings = await cleanupDuplicateSettings();
  if (!settings) {
    console.log('[CMS] No SiteSettings document found — seeding defaults.');
    settings = await SiteSettings.create(defaultSiteSettings);
    return settings;
  }

  // One-time migration: populate fields that were added after the document
  // was first created (e.g. heroTitleLine1 added in a later schema version).
  let needsSave = false;
  for (const field of MIGRATABLE_FIELDS) {
    const stored = settings[field];
    // CRITICAL: Only count as empty/missing if it's undefined or null.
    // Empty strings "" or empty arrays [] are valid user selections and must not be overwritten.
    const isEmpty = stored === undefined || stored === null;
    if (isEmpty && defaultSiteSettings[field] !== undefined) {
      settings[field] = defaultSiteSettings[field];
      if (Array.isArray(defaultSiteSettings[field])) {
        settings.markModified(field);
      }
      needsSave = true;
      console.log(`[CMS] Migrating missing field "${field}" to default value.`);
    }
  }
  if (needsSave) {
    await settings.save();
    console.log('[CMS] Migration save completed.');
  }

  return settings;
};

const getSiteSettings = asyncHandler(async (req, res) => {
  const docCount = await SiteSettings.countDocuments();
  const settings = await ensureSiteSettings();
  console.log('[CMS] getSiteSettings (admin) — _id:', settings._id, '| docCount:', docCount);
  res.json({ success: true, data: settings });
});

const getSiteSettingsPublic = asyncHandler(async (req, res) => {
  // CRITICAL: must never be cached by CDN or browser — settings are
  // admin-controlled and must always be fresh.
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Surrogate-Control', 'no-store');

  const docCount = await SiteSettings.countDocuments();
  const settings = await ensureSiteSettings();
  console.log('[CMS] getSiteSettingsPublic — _id:', settings._id, '| docCount:', docCount);
  console.log('[CMS] heroTitleLine1:', settings.heroTitleLine1);
  console.log('[CMS] heroHighlight:', settings.heroHighlight);
  res.json({ success: true, data: settings });
});

// ── Keys that must NEVER be included in the $set payload ─────────────
// The admin frontend sends the full form object (which includes _id, __v,
// timestamps received from the GET response). If these leak into $set they
// corrupt Mongoose's internal version tracking and cause silent update failures.
const INTERNAL_KEYS = new Set(['_id', '__v', 'createdAt', 'updatedAt']);

const updateSiteSettings = asyncHandler(async (req, res) => {
  const bodyKeys = Object.keys(req.body || {});
  console.log('[updateSiteSettings] request received — keys:', bodyKeys.join(', '));
  console.log('[updateSiteSettings] user:', req.user?._id, '| role:', req.user?.role);

  // Clean up any duplicate settings records in MongoDB before applying updates
  await cleanupDuplicateSettings();

  // Build a clean $set payload — exclude internal Mongoose/MongoDB fields
  const setPayload = {};
  for (const key of bodyKeys) {
    if (!INTERNAL_KEYS.has(key) && req.body[key] !== undefined) {
      setPayload[key] = req.body[key];
    }
  }
  setPayload.updatedBy = req.user?._id;

  // Diagnostic: log what we're about to write
  console.log('[updateSiteSettings] heroTitleLine1 IN:', setPayload.heroTitleLine1);
  console.log('[updateSiteSettings] heroTitleLine2 IN:', setPayload.heroTitleLine2);
  console.log('[updateSiteSettings] heroHighlight IN:', setPayload.heroHighlight);

  const docCount = await SiteSettings.countDocuments();
  console.log('[updateSiteSettings] SiteSettings document count:', docCount);
  if (docCount > 1) {
    console.warn('[updateSiteSettings] ⚠ WARNING: Multiple SiteSettings documents exist! This causes inconsistency.');
  }

  // ── ATOMIC UPDATE ──────────────────────────────────────────────────
  // Uses findOneAndUpdate($set) instead of the old findOne()+modify+save()
  // pattern. The old pattern silently lost updates because:
  //   1. ensureSiteSettings() migration called save() → bumped __v
  //   2. The stale in-memory document still had the old __v
  //   3. The second save() matched 0 documents → update silently dropped
  //
  // findOneAndUpdate is a single atomic MongoDB operation that bypasses
  // Mongoose's __v version checking entirely.
  console.log('[CMS SAVE] Incoming payload:', req.body);
  const existingDoc = await SiteSettings.findOne({});
  console.log('[CMS SAVE] Document before update:', existingDoc);
  const updated = await SiteSettings.findOneAndUpdate(
    {},
    { $set: setPayload },
    { new: true, runValidators: true }
  );
  console.log('[CMS SAVE] Document after update:', updated);

  if (!updated) {
    // No document exists yet — create one with the admin payload
    console.log('[updateSiteSettings] No document found — creating new SiteSettings.');
    const created = await SiteSettings.create({ ...defaultSiteSettings, ...setPayload });
    return res.json({ success: true, data: created, message: 'Website settings created successfully' });
  }

  console.log('[updateSiteSettings] SAVED — _id:', updated._id);
  console.log('[updateSiteSettings] heroTitleLine1 OUT:', updated.heroTitleLine1);
  console.log('[updateSiteSettings] heroTitleLine2 OUT:', updated.heroTitleLine2);
  console.log('[updateSiteSettings] heroHighlight OUT:', updated.heroHighlight);
  console.log('[updateSiteSettings] heroTrustedBrands count:', updated.heroTrustedBrands?.length);

  // ── VERIFICATION RE-READ ──────────────────────────────────────────
  // Read directly from MongoDB (lean, no Mongoose hydration) to prove
  // the values were actually persisted. This line appears in Render logs.
  const verify = await SiteSettings.findById(updated._id).lean();
  console.log('[updateSiteSettings] VERIFY — heroTitleLine1:', verify?.heroTitleLine1);
  console.log('[updateSiteSettings] VERIFY — heroHighlight:', verify?.heroHighlight);

  if (verify?.heroTitleLine1 !== setPayload.heroTitleLine1) {
    console.error('[updateSiteSettings] ❌ PERSISTENCE MISMATCH — DB has:', verify?.heroTitleLine1, '| expected:', setPayload.heroTitleLine1);
  }

  res.json({ success: true, data: updated, message: 'Website settings updated successfully' });
});

const getServices = asyncHandler(async (req, res) => {
  const services = await Service.find().sort({ sortOrder: 1, createdAt: -1 });
  res.json({ success: true, count: services.length, data: services });
});

const getServicesPublic = asyncHandler(async (req, res) => {
  const services = await Service.find({ isActive: true }).sort({ sortOrder: 1, createdAt: -1 });
  res.json({ success: true, count: services.length, data: services });
});

const getServiceById = asyncHandler(async (req, res) => {
  const service = await Service.findById(req.params.id);
  if (!service) {
    res.status(404);
    throw new Error('Service not found');
  }
  res.json({ success: true, data: service });
});

const createService = asyncHandler(async (req, res) => {
  const { title, shortDesc, description, icon, color, featured, slug, sortOrder, isActive } = req.body;

  if (!title || !shortDesc) {
    res.status(400);
    throw new Error('Title and short description are required');
  }

  const finalSlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

  const service = await Service.create({
    title,
    slug: finalSlug,
    shortDesc,
    description: description || '',
    icon: icon || 'HiCode',
    color: color || '#6366f1',
    featured: Boolean(featured),
    isActive: isActive !== false,
    sortOrder: sortOrder || 0,
  });

  res.status(201).json({ success: true, data: service });
});

const updateService = asyncHandler(async (req, res) => {
  const service = await Service.findById(req.params.id);
  if (!service) {
    res.status(404);
    throw new Error('Service not found');
  }

  Object.keys(req.body || {}).forEach((key) => {
    if (req.body[key] !== undefined) {
      service[key] = req.body[key];
    }
  });

  if (req.body.slug) service.slug = req.body.slug;
  if (req.body.title && !req.body.slug) {
    service.slug = req.body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }

  const updated = await service.save();
  res.json({ success: true, data: updated, message: 'Service updated successfully' });
});

const deleteService = asyncHandler(async (req, res) => {
  const service = await Service.findById(req.params.id);
  if (!service) {
    res.status(404);
    throw new Error('Service not found');
  }

  await service.deleteOne();
  res.json({ success: true, message: 'Service deleted successfully' });
});

const getPricingPlans = asyncHandler(async (req, res) => {
  const plans = await PricingPlan.find().sort({ sortOrder: 1, createdAt: -1 });
  res.json({ success: true, count: plans.length, data: plans });
});

const getPricingPlansPublic = asyncHandler(async (req, res) => {
  const plans = await PricingPlan.find({ isActive: true }).sort({ sortOrder: 1, createdAt: -1 });
  res.json({ success: true, count: plans.length, data: plans });
});

const getPricingPlanById = asyncHandler(async (req, res) => {
  const plan = await PricingPlan.findById(req.params.id);
  if (!plan) {
    res.status(404);
    throw new Error('Pricing plan not found');
  }
  res.json({ success: true, data: plan });
});

const createPricingPlan = asyncHandler(async (req, res) => {
  const { name, price, period, description, features, ctaText, isPopular, sortOrder, isActive } = req.body;

  if (!name || !price) {
    res.status(400);
    throw new Error('Name and price are required');
  }

  const plan = await PricingPlan.create({
    name,
    price,
    period: period || '/month',
    description: description || '',
    features: features || [],
    ctaText: ctaText || 'Get Started',
    isPopular: Boolean(isPopular),
    isActive: isActive !== false,
    sortOrder: sortOrder || 0,
  });

  res.status(201).json({ success: true, data: plan });
});

const updatePricingPlan = asyncHandler(async (req, res) => {
  const plan = await PricingPlan.findById(req.params.id);
  if (!plan) {
    res.status(404);
    throw new Error('Pricing plan not found');
  }

  Object.keys(req.body || {}).forEach((key) => {
    if (req.body[key] !== undefined) {
      plan[key] = req.body[key];
    }
  });

  const updated = await plan.save();
  res.json({ success: true, data: updated, message: 'Pricing plan updated successfully' });
});

const deletePricingPlan = asyncHandler(async (req, res) => {
  const plan = await PricingPlan.findById(req.params.id);
  if (!plan) {
    res.status(404);
    throw new Error('Pricing plan not found');
  }

  await plan.deleteOne();
  res.json({ success: true, message: 'Pricing plan deleted successfully' });
});

module.exports = {
  getSiteSettings,
  getSiteSettingsPublic,
  updateSiteSettings,
  getServices,
  getServicesPublic,
  getServiceById,
  createService,
  updateService,
  deleteService,
  getPricingPlans,
  getPricingPlansPublic,
  getPricingPlanById,
  createPricingPlan,
  updatePricingPlan,
  deletePricingPlan,
  ensureSiteSettings,
};

