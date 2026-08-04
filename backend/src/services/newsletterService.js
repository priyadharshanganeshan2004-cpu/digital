const NewsletterSubscriber = require('../models/NewsletterSubscriber');
const { sendNewsletterConfirmationEmail, sendNewsletterCampaignEmail } = require('./emailService');

const subscribeNewsletter = async ({ email, name = '', source = 'website' }) => {
    const normalizedEmail = email.trim().toLowerCase();
    const existing = await NewsletterSubscriber.findOne({ email: normalizedEmail });

    let subscriber;
    if (existing) {
        existing.status = 'subscribed';
        existing.name = name || existing.name;
        existing.source = source || existing.source;
        existing.confirmedAt = new Date();
        subscriber = await existing.save();
    } else {
        subscriber = await NewsletterSubscriber.create({
            email: normalizedEmail,
            name,
            source,
            status: 'subscribed',
            confirmedAt: new Date(),
        });
    }

    try {
        await sendNewsletterConfirmationEmail({ subscriber });
    } catch (error) {
        console.error('Newsletter confirmation email failed:', error.message);
    }

    return subscriber;
};

const unsubscribeNewsletter = async ({ email }) => {
    const subscriber = await NewsletterSubscriber.findOne({ email: email.trim().toLowerCase() });
    if (!subscriber) {
        return null;
    }

    subscriber.status = 'unsubscribed';
    subscriber.unsubscribedAt = new Date();
    return subscriber.save();
};

const sendNewsletterCampaign = async ({ subject, message, ctaText, ctaUrl }) => {
    const subscribers = await NewsletterSubscriber.find({ status: 'subscribed' }).sort({ createdAt: -1 });
    const results = [];

    for (const subscriber of subscribers) {
        try {
            const result = await sendNewsletterCampaignEmail({ subscriber, subject, message, ctaText, ctaUrl });
            results.push({ email: subscriber.email, status: 'sent', result });
        } catch (error) {
            results.push({ email: subscriber.email, status: 'failed', error: error.message });
        }
    }

    return results;
};

const getNewsletterStats = async () => {
    const [subscribed, unsubscribed, recent] = await Promise.all([
        NewsletterSubscriber.countDocuments({ status: 'subscribed' }),
        NewsletterSubscriber.countDocuments({ status: 'unsubscribed' }),
        NewsletterSubscriber.find().sort({ createdAt: -1 }).limit(10).lean(),
    ]);

    return { subscribed, unsubscribed, total: subscribed + unsubscribed, recent };
};

module.exports = {
    subscribeNewsletter,
    unsubscribeNewsletter,
    sendNewsletterCampaign,
    getNewsletterStats,
};