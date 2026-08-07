require('dotenv').config();
// Prefer IPv4 for outbound DNS resolution to avoid ENETUNREACH on hosts without IPv6 egress
try {
    const dns = require('node:dns');
    if (typeof dns.setDefaultResultOrder === 'function') {
        dns.setDefaultResultOrder('ipv4first');
    }
} catch (err) {
    // ignore if DNS API not available
}
console.log('Loaded MONGO_URI:', process.env.MONGO_URI ? process.env.MONGO_URI.replace(/:([^@]+)@/, ':****@') : 'undefined');
const app = require('./app');
const connectDB = require('./config/db');
const SiteSettings = require('./models/SiteSettings');
const Service = require('./models/Service');
const PricingPlan = require('./models/PricingPlan');

const seedDefaultCMSData = async () => {
    const settingsCount = await SiteSettings.countDocuments();
    if (settingsCount === 0) {
        await SiteSettings.create({
            siteName: 'NexusDigital',
            tagline: 'Growth-driven digital strategy',
            description: 'We help ambitious brands grow with strategy, design, web experiences, and measurable digital performance.',
            contactEmail: 'priyadharshanganeshan2004@gmail.com',
            phone: '+1 (555) 123-4567',
            address: '123 Business Avenue, New York, NY',
            seoTitle: 'NexusDigital | Digital Marketing Agency',
            seoDescription: 'NexusDigital is a premier digital marketing agency delivering innovative solutions in web development, SEO, social media marketing, and more.',
            heroBadge: 'Digital growth partner for ambitious brands',
            heroTitle: 'Growth-driven digital strategy',
            heroDescription: 'We blend strategy, creative execution, and measurable performance to help brands grow with clarity and confidence.',
            heroPrimaryCta: 'Start your project',
            heroSecondaryCta: 'See our work',
        });
    }

    const servicesCount = await Service.countDocuments();
    if (servicesCount === 0) {
        await Service.insertMany([
            { title: 'Website Development', slug: 'website-development', shortDesc: 'Custom, high-performance websites built with cutting-edge technology.', description: 'Custom websites crafted with scalable architecture and conversion-first design.', icon: 'HiCode', color: '#6366f1', featured: true, sortOrder: 1 },
            { title: 'SEO', slug: 'seo', shortDesc: 'Technical SEO and content strategies that elevate search visibility.', description: 'Drive higher rankings and more qualified traffic with proven SEO frameworks.', icon: 'HiTrendingUp', color: '#8b5cf6', featured: true, sortOrder: 2 },
            { title: 'Social Media Marketing', slug: 'social-media-marketing', shortDesc: 'Strategy-led campaigns that build brand awareness and engagement.', description: 'Turn social channels into a measurable acquisition engine.', icon: 'HiSpeakerphone', color: '#a855f7', featured: true, sortOrder: 3 },
            { title: 'Google Ads', slug: 'google-ads', shortDesc: 'High-ROI ad campaigns that drive qualified traffic quickly.', description: 'Fast-track growth with search, display, and remarketing campaigns.', icon: 'HiCursorClick', color: '#6366f1', featured: false, sortOrder: 4 },
        ]);
    }

    const pricingCount = await PricingPlan.countDocuments();
    if (pricingCount === 0) {
        await PricingPlan.insertMany([
            { name: 'Starter', price: '$999', period: '/month', description: 'Perfect for small businesses getting started with digital marketing.', features: ['Basic Website Analytics', 'Social Media Management (2 platforms)', 'Monthly Content (4 posts)', 'Basic Analytics Report', 'Email Support'], ctaText: 'Get Started', isPopular: false, sortOrder: 1 },
            { name: 'Professional', price: '$2,499', period: '/month', description: 'Ideal for growing businesses looking to scale their online presence.', features: ['Advanced SEO Strategy', 'Social Media Management (4 platforms)', 'Weekly Content (8 posts)', 'Google Ads Management', 'Detailed Analytics Dashboard'], ctaText: 'Start Growing', isPopular: true, sortOrder: 2 },
            { name: 'Enterprise', price: '$4,999', period: '/month', description: 'Comprehensive solution for established brands demanding excellence.', features: ['Full-spectrum SEO', 'PPC Campaign Management', 'Influencer Marketing', 'Video Content Production', 'Dedicated Account Manager'], ctaText: 'Contact Sales', isPopular: false, sortOrder: 3 },
        ]);
    }
};

// Connect to MongoDB
connectDB().then(() => {
    seedDefaultCMSData();
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);
    // Close server & exit process
    server.close(() => process.exit(1));
});