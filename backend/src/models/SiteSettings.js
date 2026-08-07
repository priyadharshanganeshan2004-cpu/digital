const mongoose = require('mongoose');

const siteSettingsSchema = new mongoose.Schema(
  {
    siteName: { type: String, default: 'NexusDigital' },
    tagline: { type: String, default: 'Growth-driven digital strategy' },
    description: {
      type: String,
      default:
        'We help ambitious brands grow with strategy, design, web experiences, and measurable digital performance.',
    },
    logoUrl: { type: String, default: '' },
    faviconUrl: { type: String, default: '' },
    primaryColor: { type: String, default: '#6366f1' },
    accentColor: { type: String, default: '#a855f7' },
    contactEmail: { type: String, default: 'priyadharshanganeshan2004@gmail.com' },
    phone: { type: String, default: '+1 (555) 123-4567' },
    address: { type: String, default: '123 Business Avenue, New York, NY' },
    whatsapp: { type: String, default: '' },
    facebook: { type: String, default: '' },
    instagram: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    youtube: { type: String, default: '' },
    seoTitle: { type: String, default: 'NexusDigital | Digital Marketing Agency' },
    seoDescription: {
      type: String,
      default:
        'NexusDigital is a premier digital marketing agency delivering innovative solutions in web development, SEO, social media marketing, and more.',
    },
    heroBadge: { type: String, default: 'Digital growth partner for ambitious brands' },
    heroTitle: { type: String, default: 'Growth-driven digital strategy' },
    heroDescription: {
      type: String,
      default:
        'We blend strategy, creative execution, and measurable performance to help brands grow with clarity and confidence.',
    },
    heroPrimaryCta: { type: String, default: 'Start your project' },
    heroSecondaryCta: { type: String, default: 'See our work' },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('SiteSettings', siteSettingsSchema);
