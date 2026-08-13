const mongoose = require('mongoose');

const siteSettingsSchema = new mongoose.Schema(
  {
    siteName: { type: String, default: 'Scalax Labs' },
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
    phone: { type: String, default: '+91 9080399984' },
    address: { type: String, default: '123 Business Avenue, New York, NY' },
    whatsapp: { type: String, default: '' },
    facebook: { type: String, default: '' },
    instagram: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    youtube: { type: String, default: '' },
    seoTitle: { type: String, default: 'Scalax Labs | Digital Marketing Agency' },
    seoDescription: {
      type: String,
      default:
        'Scalax Labs is a premier digital marketing agency delivering innovative solutions in web development, SEO, social media marketing, and more.',
    },
    heroBadge: { type: String, default: 'Digital growth partner for ambitious brands' },
    heroTitle: { type: String, default: 'Growth-driven digital strategy' },
    // Structured title fields (used by HeroSection for styled rendering)
    heroTitleLine1: { type: String, default: 'Growth-driven' },
    heroTitleLine2: { type: String, default: 'digital' },
    heroHighlight: { type: String, default: 'strategy' },
    heroDescription: {
      type: String,
      default:
        'We blend strategy, creative execution, and measurable performance to help brands grow with clarity and confidence.',
    },
    heroPrimaryCta: { type: String, default: 'Start your project' },
    heroPrimaryCtaLink: { type: String, default: '/book-consultation' },
    heroSecondaryCta: { type: String, default: 'See our work' },
    heroSecondaryCtaLink: { type: String, default: '/portfolio' },
    heroTrustedLabel: { type: String, default: 'Trusted by Industry Leaders' },
    heroTrustedBrands: {
      type: [
        {
          name: { type: String, required: true },
          logo: { type: String, default: '' },
        },
      ],
      default: [
        { name: 'TechFlow', logo: '' },
        { name: 'CloudBase', logo: '' },
        { name: 'DataSync', logo: '' },
        { name: 'PixelEdge', logo: '' },
        { name: 'VivaNova', logo: '' },
        { name: 'BlueShift', logo: '' },
      ],
    },
    logo: {
      text: { type: String, default: 'N', maxlength: 3, trim: true },
      siteName: { type: String, default: 'NexusDigital', trim: true },
      colorFrom: { type: String, default: '#9333ea' },
      colorTo: { type: String, default: '#4f46e5' },
    },
    aboutHeading: { type: String, default: 'We Build Digital Experiences That Matter' },
    aboutDescription: {
      type: String,
      default: 'Founded in 2012, Scalax Labs has grown from a small team of passionate digital enthusiasts to a full-service agency serving 150+ clients worldwide.',
    },
    aboutStoryTitle: { type: String, default: 'Our Story' },
    aboutStoryText1: {
      type: String,
      default: "What started as a passion project in a small garage has evolved into one of the most trusted digital marketing agencies in the industry. Our journey has been fueled by curiosity, innovation, and an unwavering commitment to our clients' success.",
    },
    aboutStoryText2: {
      type: String,
      default: "Over the past 12 years, we've delivered 500+ successful projects across various industries — from ambitious startups to Fortune 500 companies. We've built websites, designed brands, launched campaigns, and most importantly, created lasting partnerships.",
    },
    aboutStoryText3: {
      type: String,
      default: "Today, our team of 50+ experts continues to push boundaries, embracing new technologies and strategies to help businesses thrive in an ever-evolving digital landscape.",
    },
    aboutStatYears: { type: String, default: '12+' },
    aboutStatProjects: { type: String, default: '500+' },
    aboutStatClients: { type: String, default: '150+' },
    aboutStatTeam: { type: String, default: '50+' },
    theme: {
      primaryColor: {
        type: String,
        default: '#9333ea',
        validate: {
          validator: function (v) {
            return /^#([0-9A-Fa-f]{3}){1,2}$/.test(v);
          },
          message: props => `${props.value} is not a valid hex color!`
        }
      },
      secondaryColor: {
        type: String,
        default: '#4f46e5',
        validate: {
          validator: function (v) {
            return /^#([0-9A-Fa-f]{3}){1,2}$/.test(v);
          },
          message: props => `${props.value} is not a valid hex color!`
        }
      },
      accentTextColor: {
        type: String,
        default: '#9333ea',
        validate: {
          validator: function (v) {
            return /^#([0-9A-Fa-f]{3}){1,2}$/.test(v);
          },
          message: props => `${props.value} is not a valid hex color!`
        }
      },
    },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('SiteSettings', siteSettingsSchema);

