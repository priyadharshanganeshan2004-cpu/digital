const { buildEmailLayout } = require('./_shared');

const buildWelcomeEmail = ({ brand, user, loginUrl }) => {
    const content = buildEmailLayout({
        brand,
        preheader: 'Welcome to the team',
        title: 'Welcome Email',
        headline: `Welcome aboard, ${user.name}!`,
        intro: `Your account is ready. You can now sign in, track progress, and collaborate with the team inside your dashboard.`,
        details: [
            { label: 'Email', value: user.email },
            { label: 'Role', value: user.role },
        ],
        ctaText: 'Sign in to dashboard',
        ctaUrl: loginUrl,
        footerNote: 'If you did not create this account, you can safely ignore this email.',
    });

    return {
        subject: `Welcome to ${brand.siteName || 'Scalax Labs'}`,
        ...content,
    };
};

module.exports = { buildWelcomeEmail };
