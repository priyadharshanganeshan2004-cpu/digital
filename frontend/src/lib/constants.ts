import type { NavLink } from '@/types';

export const APP_NAME = 'NexusDigital';
export const APP_TAGLINE = 'Growth-driven digital strategy';
export const APP_DESCRIPTION = 'We help ambitious brands grow through strategy, design, and measurable digital performance.';

export const NAV_LINKS: NavLink[] = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    {
        label: 'Services',
        href: '/services',
        children: [
            { label: 'Website Development', href: '/services/website-development' },
            { label: 'E-commerce Development', href: '/services/ecommerce-development' },
            { label: 'UI/UX Design', href: '/services/ui-ux-design' },
            { label: 'SEO', href: '/services/seo' },
            { label: 'Social Media Marketing', href: '/services/social-media-marketing' },
            { label: 'Google Ads', href: '/services/google-ads' },
            { label: 'Content Marketing', href: '/services/content-marketing' },
            { label: 'Branding', href: '/services/branding' },
        ],
    },
    { label: 'Portfolio', href: '/portfolio' },
    { label: 'Blog', href: '/blog' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Contact', href: '/contact' },
];

export const SERVICES_DATA = [
    {
        id: 'website-development',
        title: 'Website Development',
        shortDesc: 'Custom, high-performance websites built with cutting-edge technology.',
        icon: 'HiCode',
        color: '#6366f1',
    },
    {
        id: 'ecommerce-development',
        title: 'E-commerce Development',
        shortDesc: 'Scalable online stores that convert visitors into loyal customers.',
        icon: 'HiShoppingCart',
        color: '#8b5cf6',
    },
    {
        id: 'social-media-marketing',
        title: 'Social Media Marketing',
        shortDesc: 'Strategic campaigns that build brand awareness and engagement.',
        icon: 'HiSpeakerphone',
        color: '#a855f7',
    },
    {
        id: 'social-media-management',
        title: 'Social Media Management',
        shortDesc: 'End-to-end social media management for consistent growth.',
        icon: 'HiUserGroup',
        color: '#6366f1',
    },
    {
        id: 'google-ads',
        title: 'Google Ads',
        shortDesc: 'High-ROI paid search campaigns that drive qualified traffic.',
        icon: 'HiCursorClick',
        color: '#8b5cf6',
    },
    {
        id: 'facebook-ads',
        title: 'Facebook Ads',
        shortDesc: 'Targeted Facebook campaigns that reach your ideal audience.',
        icon: 'HiThumbUp',
        color: '#a855f7',
    },
    {
        id: 'instagram-ads',
        title: 'Instagram Ads',
        shortDesc: 'Visually stunning Instagram campaigns that drive engagement.',
        icon: 'HiCamera',
        color: '#6366f1',
    },
    {
        id: 'email-marketing',
        title: 'Email Marketing',
        shortDesc: 'Personalized email campaigns that nurture and convert leads.',
        icon: 'HiMail',
        color: '#8b5cf6',
    },
    {
        id: 'content-marketing',
        title: 'Content Marketing',
        shortDesc: 'Compelling content strategies that establish thought leadership.',
        icon: 'HiPencilAlt',
        color: '#a855f7',
    },
    {
        id: 'influencer-marketing',
        title: 'Influencer Marketing',
        shortDesc: 'Strategic influencer partnerships that amplify your brand.',
        icon: 'HiStar',
        color: '#6366f1',
    },
    {
        id: 'video-editing',
        title: 'Video Editing',
        shortDesc: 'Professional video production that tells your brand story.',
        icon: 'HiFilm',
        color: '#8b5cf6',
    },
    {
        id: 'poster-design',
        title: 'Poster Design',
        shortDesc: 'Eye-catching poster designs that grab attention instantly.',
        icon: 'HiPhotograph',
        color: '#a855f7',
    },
    {
        id: 'logo-design',
        title: 'Logo Design',
        shortDesc: 'Iconic logos that define and elevate your brand identity.',
        icon: 'HiSparkles',
        color: '#6366f1',
    },
    {
        id: 'branding',
        title: 'Branding',
        shortDesc: 'Complete brand identity systems that make you unforgettable.',
        icon: 'HiLightningBolt',
        color: '#8b5cf6',
    },
    {
        id: 'mobile-app-development',
        title: 'Mobile App Development',
        shortDesc: 'Native and cross-platform apps that users love.',
        icon: 'HiDeviceMobile',
        color: '#a855f7',
    },
    {
        id: 'website-maintenance',
        title: 'Website Maintenance',
        shortDesc: 'Reliable maintenance and support to keep your site running perfectly.',
        icon: 'HiCog',
        color: '#6366f1',
    },
];

export const STATS = [
    { value: 500, suffix: '+', label: 'Projects Completed' },
    { value: 150, suffix: '+', label: 'Happy Clients' },
    { value: 98, suffix: '%', label: 'Client Satisfaction' },
    { value: 12, suffix: '+', label: 'Years Experience' },
];

export const PROCESS_STEPS = [
    {
        step: 1,
        title: 'Discovery',
        description: 'We dive deep into your business goals, target audience, and competitive landscape to build a solid foundation.',
    },
    {
        step: 2,
        title: 'Strategy',
        description: 'Our team crafts a data-driven strategy tailored to your unique needs and market opportunities.',
    },
    {
        step: 3,
        title: 'Execution',
        description: 'We bring the strategy to life with precision, creativity, and cutting-edge technology.',
    },
    {
        step: 4,
        title: 'Optimization',
        description: 'Continuous monitoring, testing, and refinement to maximize performance and ROI.',
    },
];

export const BUDGET_OPTIONS = [
    '$1,000 - $5,000',
    '$5,000 - $10,000',
    '$10,000 - $25,000',
    '$25,000 - $50,000',
    '$50,000+',
];

export const PRICING_PLANS = [
    {
        name: 'Starter',
        price: '$999',
        period: '/month',
        description: 'Perfect for small businesses getting started with digital marketing.',
        features: [
            'Basic Website Analytics',
            'Social Media Management (2 platforms)',
            'Monthly Content (4 posts)',
            'Basic Analytics Report',
            'Email Support',
            'Monthly Strategy Call',
        ],
        isPopular: false,
        ctaText: 'Get Started',
    },
    {
        name: 'Professional',
        price: '$2,499',
        period: '/month',
        description: 'Ideal for growing businesses looking to scale their online presence.',
        features: [
            'Advanced SEO Strategy',
            'Social Media Management (4 platforms)',
            'Weekly Content (8 posts)',
            'Google Ads Management',
            'Email Marketing Campaigns',
            'Detailed Analytics Dashboard',
            'Bi-weekly Strategy Calls',
            'Priority Support',
        ],
        isPopular: true,
        ctaText: 'Start Growing',
    },
    {
        name: 'Enterprise',
        price: '$4,999',
        period: '/month',
        description: 'Comprehensive solution for established brands demanding excellence.',
        features: [
            'Full-spectrum SEO',
            'Social Media Management (All platforms)',
            'Daily Content Creation',
            'PPC Campaign Management',
            'Influencer Marketing',
            'Video Content Production',
            'Real-time Analytics',
            'Dedicated Account Manager',
            'Weekly Strategy Sessions',
            '24/7 Priority Support',
        ],
        isPopular: false,
        ctaText: 'Contact Sales',
    },
];

export const CLIENT_LOGOS = [
    { name: 'TechFlow', initials: 'TF' },
    { name: 'CloudBase', initials: 'CB' },
    { name: 'DataSync', initials: 'DS' },
    { name: 'PixelEdge', initials: 'PE' },
    { name: 'VivaNova', initials: 'VN' },
    { name: 'BlueShift', initials: 'BS' },
    { name: 'IronClad', initials: 'IC' },
    { name: 'SkyReach', initials: 'SR' },
];
