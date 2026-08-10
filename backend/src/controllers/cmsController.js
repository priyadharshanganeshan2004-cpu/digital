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

const ensureSiteSettings = async () => {
  let settings = await SiteSettings.findOne();
  if (!settings) {
    settings = await SiteSettings.create(defaultSiteSettings);
  }
  return settings;
};

const getSiteSettings = asyncHandler(async (req, res) => {
  const settings = await ensureSiteSettings();
  res.json({ success: true, data: settings });
});

const getSiteSettingsPublic = asyncHandler(async (req, res) => {
  const settings = await ensureSiteSettings();
  res.json({ success: true, data: settings });
});

const updateSiteSettings = asyncHandler(async (req, res) => {
  console.log('[updateSiteSettings] Incoming request body keys:', Object.keys(req.body || {}));
  console.log('[updateSiteSettings] Updated by user:', req.user?._id);

  let settings = await ensureSiteSettings();

  Object.keys(req.body || {}).forEach((key) => {
    if (req.body[key] !== undefined) {
      settings[key] = req.body[key];
    }
  });

  settings.updatedBy = req.user?._id || settings.updatedBy;

  const saved = await settings.save();
  console.log('[updateSiteSettings] MongoDB save result — _id:', saved._id, '| updatedAt:', saved.updatedAt);

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

