const mongoose = require('mongoose');

const siteSettingsSchema = new mongoose.Schema(
  {
    siteName: { type: String, default: 'NexusDigital' },
    tagline: { type: String, default: 'Transform Your Digital Presence' },
    description: {
      type: String,
      default:
        'We are a premier digital marketing agency delivering innovative solutions that drive growth, engagement, and measurable results for ambitious brands.',
    },
    logoUrl: { type: String, default: '' },
    faviconUrl: { type: String, default: '' },
    primaryColor: { type: String, default: '#6366f1' },
    accentColor: { type: String, default: '#a855f7' },
    contactEmail: { type: String, default: 'hello@nexusdigital.com' },
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
    heroBadge: { type: String, default: '#1 Digital Marketing Agency — Trusted by 150+ Brands' },
    heroTitle: { type: String, default: 'Transform Your Digital Presence' },
    heroDescription: {
      type: String,
      default:
        'We craft data-driven strategies and stunning digital experiences that turn ambitious brands into market leaders. Let\'s build something extraordinary.',
    },
    heroPrimaryCta: { type: String, default: 'Start Your Project' },
    heroSecondaryCta: { type: String, default: 'View Our Work' },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('SiteSettings', siteSettingsSchema);
