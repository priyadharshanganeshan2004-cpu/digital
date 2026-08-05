const EmailLog = require('../models/EmailLog');
const EmailTemplate = require('../models/EmailTemplate');
const NewsletterSubscriber = require('../models/NewsletterSubscriber');
const { generateOtp, verifyOtp } = require('../services/otpService');
const { subscribeNewsletter, sendNewsletterCampaign, getNewsletterStats } = require('../services/newsletterService');
const {
    ensureDefaultTemplates,
    getEmailStats,
    sendContactEmails,
    sendBookingEmails,
    sendOtpEmail,
    sendResetPasswordEmail,
    sendCustomEmail,
    resendLoggedEmail,
    sendNewsletterCampaignEmail,
} = require('../services/emailService');
const User = require('../models/User');
const asyncHandler = require('../middleware/asyncHandler');

const sendContact = asyncHandler(async (req, res) => {
    const lead = {
        name: req.body.name?.trim(),
        email: req.body.email?.trim().toLowerCase(),
        company: req.body.company?.trim(),
        phone: req.body.phone?.trim(),
        service: req.body.service?.trim(),
        budget: req.body.budget?.trim(),
        message: req.body.message?.trim(),
    };

    const result = await sendContactEmails({ lead });
    res.status(200).json({ success: true, data: result, message: 'Contact emails sent successfully' });
});

const sendBooking = asyncHandler(async (req, res) => {
    const booking = {
        name: req.body.name?.trim(),
        email: req.body.email?.trim().toLowerCase(),
        phone: req.body.phone?.trim(),
        service: req.body.service?.trim(),
        date: req.body.date?.trim(),
        time: req.body.time?.trim(),
        message: req.body.message?.trim(),
    };

    const result = await sendBookingEmails({ booking });
    res.status(200).json({ success: true, data: result, message: 'Booking emails sent successfully' });
});

const sendNewsletter = asyncHandler(async (req, res) => {
    const subscriber = await subscribeNewsletter({
        email: req.body.email,
        name: req.body.name || '',
        source: req.body.source || 'website',
    });

    res.status(201).json({ success: true, data: subscriber, message: 'Newsletter subscription confirmed' });
});

const requestOtp = asyncHandler(async (req, res) => {
    const email = req.body.email.trim().toLowerCase();
    const otp = await generateOtp({ email, purpose: 'password-reset' });
    await sendOtpEmail({ email, otp, purpose: 'password reset' });

    res.json({
        success: true,
        message: 'OTP sent successfully',
        ...(process.env.NODE_ENV === 'development' && { otp }),
    });
});

const resetPasswordWithOtp = asyncHandler(async (req, res) => {
    const email = req.body.email.trim().toLowerCase();
    const otp = req.body.otp || req.params.token;
    const password = req.body.password;

    const isValid = await verifyOtp({ email, otp, purpose: 'password-reset' });
    if (!isValid) {
        res.status(400);
        throw new Error('Invalid or expired OTP');
    }

    const user = await User.findOne({ email });
    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    user.password = password;
    await user.save();

    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/login`;
    await sendResetPasswordEmail({ email, resetUrl });

    res.json({ success: true, message: 'Password has been reset successfully' });
});

const sendCustom = asyncHandler(async (req, res) => {
    const result = await sendCustomEmail({
        recipient: req.body.recipient.trim().toLowerCase(),
        subject: req.body.subject.trim(),
        message: req.body.message.trim(),
        html: req.body.html,
        text: req.body.text,
        replyTo: req.body.replyTo,
    });

    res.status(201).json({ success: true, data: result, message: 'Email sent successfully' });
});

const getLogs = asyncHandler(async (req, res) => {
    const { status, category, recipient } = req.query;
    const query = {};

    if (status) query.status = status;
    if (category) query.category = category;
    if (recipient) query.recipient = { $regex: recipient, $options: 'i' };

    const logs = await EmailLog.find(query).sort({ createdAt: -1 }).limit(100);
    res.json({ success: true, count: logs.length, data: logs });
});

const getStats = asyncHandler(async (req, res) => {
    await ensureDefaultTemplates();
    const emailStats = await getEmailStats();
    const newsletterStats = await getNewsletterStats();
    const templates = await EmailTemplate.find().sort({ updatedAt: -1 }).lean();
    const recentLogs = await EmailLog.find().sort({ createdAt: -1 }).limit(10).lean();

    res.json({
        success: true,
        data: {
            ...emailStats,
            newsletter: newsletterStats,
            templates,
            recentLogs,
        },
    });
});

const getSubscribers = asyncHandler(async (req, res) => {
    const subscribers = await NewsletterSubscriber.find().sort({ createdAt: -1 }).limit(200).lean();
    res.json({ success: true, count: subscribers.length, data: subscribers });
});

const getTemplates = asyncHandler(async (req, res) => {
    await ensureDefaultTemplates();
    const templates = await EmailTemplate.find().sort({ createdAt: -1 }).lean();
    res.json({ success: true, count: templates.length, data: templates });
});

const resendEmail = asyncHandler(async (req, res) => {
    const emailLog = await EmailLog.findById(req.params.id);
    if (!emailLog) {
        res.status(404);
        throw new Error('Email log not found');
    }

    const result = await resendLoggedEmail(emailLog);
    res.json({ success: true, data: result, message: 'Email resent successfully' });
});

const sendCampaign = asyncHandler(async (req, res) => {
    const subject = req.body.subject.trim();
    const message = req.body.message.trim();
    const ctaText = req.body.ctaText;
    const ctaUrl = req.body.ctaUrl;

    // Count recipients to return an immediate queued response
    const recipientCount = await NewsletterSubscriber.countDocuments({ status: 'subscribed' });

    // Kick off campaign send in background — do not block the HTTP response
    sendNewsletterCampaign({ subject, message, ctaText, ctaUrl })
        .then((results) => console.log(`Campaign send completed: ${results.length} processed`))
        .catch((err) => console.error('Campaign send failed:', err));

    res.json({ success: true, count: recipientCount, message: 'Newsletter campaign queued' });
});

module.exports = {
    sendContact,
    sendBooking,
    sendNewsletter,
    requestOtp,
    resetPasswordWithOtp,
    sendCustom,
    getLogs,
    getStats,
    getSubscribers,
    getTemplates,
    resendEmail,
    sendCampaign,
};