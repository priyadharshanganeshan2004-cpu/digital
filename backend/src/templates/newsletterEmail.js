const { buildEmailLayout } = require('./_shared');

const buildNewsletterEmail = ({ brand, subscriber, subject, message, ctaText, ctaUrl, mode = 'confirmation' }) => {
    const content = buildEmailLayout({
        brand,
        preheader: mode === 'campaign' ? 'Newsletter update' : 'Subscription confirmed',
        title: mode === 'campaign' ? 'Newsletter Campaign' : 'Newsletter Confirmation',
        headline: mode === 'campaign' ? subject : `Welcome to the newsletter, ${subscriber?.name || 'friend'}!`,
        intro: mode === 'campaign'
            ? message
            : 'Your subscription has been confirmed. Expect actionable insights, product updates, and exclusive offers in your inbox.',
        details: subscriber ? [
            { label: 'Email', value: subscriber.email },
            { label: 'Status', value: subscriber.status || 'subscribed' },
        ] : [],
        ctaText: ctaText || (mode === 'campaign' ? 'Read the update' : 'Explore our services'),
        ctaUrl: ctaUrl || `${process.env.FRONTEND_URL || 'http://localhost:5173'}/services`,
        footerNote: mode === 'campaign'
            ? 'You are receiving this email because you subscribed to our newsletter.'
            : 'If this was not you, you can ignore this message.',
    });

    return {
        subject: subject || `You're subscribed to ${brand.siteName || 'Scalax Labs'} updates`,
        ...content,
    };
};

module.exports = { buildNewsletterEmail };
