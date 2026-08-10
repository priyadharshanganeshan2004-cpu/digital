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

const ensureSiteSettings = async () => {
  let settings = await SiteSettings.findOne();
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
    const isEmpty = stored === undefined || stored === null || stored === '' ||
      (Array.isArray(stored) && stored.length === 0);
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
  const settings = await ensureSiteSettings();
  res.json({ success: true, data: settings });
});

const getSiteSettingsPublic = asyncHandler(async (req, res) => {
  // CRITICAL: must never be cached by CDN or browser — settings are
  // admin-controlled and must always be fresh.
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Surrogate-Control', 'no-store');

  const settings = await ensureSiteSettings();
  console.log('[CMS] getSiteSettingsPublic — heroTitleLine1:', settings.heroTitleLine1, '| heroHighlight:', settings.heroHighlight);
  res.json({ success: true, data: settings });
});

// Fields that Mongoose will NOT auto-detect when assigned by reference.
// Must call .markModified(field) before .save() for these.
const ARRAY_FIELDS = ['heroTrustedBrands'];

const updateSiteSettings = asyncHandler(async (req, res) => {
  const bodyKeys = Object.keys(req.body || {});
  console.log('[updateSiteSettings] request received — keys:', bodyKeys.join(', '));
  console.log('[updateSiteSettings] user:', req.user?._id, '| role:', req.user?.role);

  let settings = await ensureSiteSettings();

  // Apply all incoming values to the Mongoose document
  bodyKeys.forEach((key) => {
    if (req.body[key] !== undefined) {
      settings[key] = req.body[key];
      // BUG FIX: Mongoose does not track direct array/subdocument reference
      // assignment — explicitly mark these paths as modified so save() persists them.
      if (ARRAY_FIELDS.includes(key)) {
        settings.markModified(key);
        console.log(`[updateSiteSettings] markModified called for array field: ${key}`);
      }
    }
  });

  settings.updatedBy = req.user?._id || settings.updatedBy;

  const saved = await settings.save();
  console.log('[updateSiteSettings] save complete — _id:', saved._id);
  console.log('[updateSiteSettings] heroTitleLine1:', saved.heroTitleLine1);
  console.log('[updateSiteSettings] heroHighlight:', saved.heroHighlight);
  console.log('[updateSiteSettings] heroTrustedBrands count:', saved.heroTrustedBrands?.length);

  res.json({ success: true, data: saved, message: 'Website settings updated successfully' });
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

