const crypto = require('crypto');
const EmailLog = require('../models/EmailLog');
const EmailTemplate = require('../models/EmailTemplate');
const SiteSettings = require('../models/SiteSettings');
const { sendMail } = require('../config/email');
const { buildWelcomeEmail } = require('../templates/welcomeEmail');
const { buildContactEmail } = require('../templates/contactEmail');
const { buildBookingEmail } = require('../templates/bookingEmail');
const { buildOtpEmail } = require('../templates/otpEmail');
const { buildInvoiceEmail } = require('../templates/invoiceEmail');
const { buildNewsletterEmail } = require('../templates/newsletterEmail');
const { buildProjectUpdateEmail } = require('../templates/projectUpdateEmail');

const defaultBrand = {
    siteName: 'NexusDigital',
    logoUrl: '',
    primaryColor: '#6366f1',
    accentColor: '#a855f7',
    contactEmail: 'priyadharshanganeshan2004@gmail.com',
    phone: '+91 9080399984',
    address: '123 Business Avenue, New York, NY',
    facebook: '',
    instagram: '',
    linkedin: '',
    youtube: '',
};

const safeJson = (value) => {
    try {
        return JSON.parse(JSON.stringify(value || {}));
    } catch {
        return {};
    }
};

const getBrandContext = async () => {
    const settings = await SiteSettings.findOne().lean();
    return { ...defaultBrand, ...(settings || {}) };
};

const logEmail = async ({ recipient, subject, templateKey, category, provider, status, html = '', text = '', payload = {}, error = '' }) => {
    return EmailLog.create({
        recipient,
        subject,
        templateKey,
        category,
        provider,
        status,
        html,
        text,
        payload: safeJson(payload),
        error,
        sentAt: new Date(),
    });
};

const sendAndLog = async ({ to, subject, html, text, templateKey = 'custom', category = 'general', payload = {}, replyTo, from }) => {
    const recipients = Array.isArray(to) ? to : [to];
    const provider = process.env.RESEND_API_KEY ? 'resend' : (process.env.SMTP_HOST ? 'smtp' : 'mock');

    try {
        const result = await sendMail({ to: recipients, subject, html, text, replyTo, from });
        await logEmail({
            recipient: recipients.join(', '),
            subject,
            templateKey,
            category,
            provider,
            status: 'sent',
            html,
            text,
            payload,
        });
        return result;
    } catch (error) {
        await logEmail({
            recipient: recipients.join(', '),
            subject,
            templateKey,
            category,
            provider,
            status: 'failed',
            html,
            text,
            payload,
            error: error.message,
        });
        throw error;
    }
};

const ensureDefaultTemplates = async () => {
    const defaults = [
        { key: 'welcome', name: 'Welcome Email', subject: 'Welcome to NexusDigital', description: 'Welcome email for new users', variables: ['user.name', 'user.email'] },
        { key: 'contact', name: 'Contact Confirmation', subject: 'We received your message', description: 'Confirmation for contact form submissions', variables: ['lead.name', 'lead.email', 'lead.message'] },
        { key: 'booking', name: 'Booking Confirmation', subject: 'Your consultation is confirmed', description: 'Confirmation for consultation bookings', variables: ['booking.date', 'booking.time', 'booking.service'] },
        { key: 'otp', name: 'OTP Email', subject: 'Your verification code', description: 'Password reset and verification code email', variables: ['email', 'otp'] },
        { key: 'invoice', name: 'Invoice Email', subject: 'Invoice available', description: 'Invoice email for clients', variables: ['invoice.invoiceNumber', 'invoice.total'] },
        { key: 'newsletter', name: 'Newsletter Email', subject: 'Newsletter update', description: 'Newsletter confirmation and campaigns', variables: ['subscriber.email', 'message'] },
        { key: 'project-update', name: 'Project Update', subject: 'Project status update', description: 'Project milestone or status notification', variables: ['project.title', 'project.status'] },
    ];

    const existing = await EmailTemplate.find().select('key').lean();
    const existingKeys = new Set(existing.map((item) => item.key));

    const templatesToCreate = defaults.filter((item) => !existingKeys.has(item.key));
    if (templatesToCreate.length) {
        await EmailTemplate.insertMany(templatesToCreate);
    }
};

const sendWelcomeEmail = async ({ user }) => {
    const brand = await getBrandContext();
    const loginUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/login`;
    const template = buildWelcomeEmail({ brand, user, loginUrl });

    return sendAndLog({
        to: user.email,
        subject: template.subject,
        html: template.html,
        text: template.text,
        templateKey: 'welcome',
        category: 'welcome',
        payload: { user },
    });
};

const sendLoginNotificationEmail = async ({ user }) => {
    const brand = await getBrandContext();
    const template = buildNewsletterEmail({
        brand,
        subscriber: { name: user.name, email: user.email, status: 'subscribed' },
        subject: `Login activity detected for ${user.name}`,
        message: 'We noticed a new sign-in to your account. If this was not you, change your password immediately.',
        ctaText: 'Review account',
        ctaUrl: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/dashboard/settings`,
        mode: 'campaign',
    });

    return sendAndLog({
        to: user.email,
        subject: template.subject,
        html: template.html,
        text: template.text,
        templateKey: 'login-notification',
        category: 'security',
        payload: { user },
    });
};

const sendClientCredentialsEmail = async ({ user, tempPassword }) => {
    const brand = await getBrandContext();
    const loginUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/login`;
    const html = `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;">
            <h1>Welcome to ${brand.siteName || 'our agency'}</h1>
            <p>Hi ${user.name || user.email},</p>
            <p>Your account has been created. Use the one-time temporary password below to log in:</p>
            <p style="font-size: 1.1rem; font-weight: 600;">${tempPassword}</p>
            <p>Please visit the login page and change your password after signing in.</p>
            <p><a href="${loginUrl}" style="color: #4f46e5; text-decoration: none;">Log in to your account</a></p>
            <p>Thanks,<br/>The ${brand.siteName || 'team'}</p>
        </div>
    `;

    const text = `Welcome to ${brand.siteName || 'our agency'}\n\nHi ${user.name || user.email},\n\nYour temporary password is: ${tempPassword}\n\nLog in here: ${loginUrl}\n\nPlease change your password after signing in.`;

    return sendAndLog({
        to: user.email,
        subject: `Your temporary login credentials for ${brand.siteName || 'our agency'}`,
        html,
        text,
        templateKey: 'client-credentials',
        category: 'security',
        payload: { user, tempPassword },
    });
};

const sendContactEmails = async ({ lead }) => {
    const brand = await getBrandContext();
    const customerTemplate = buildContactEmail({ brand, lead, mode: 'customer' });
    const adminTemplate = buildContactEmail({ brand, lead, mode: 'admin' });
    const adminRecipient = brand.contactEmail || process.env.EMAIL_FROM || 'priyadharshanganeshan2004@gmail.com';

    const results = [];
    if (lead.email) {
        results.push(await sendAndLog({
            to: lead.email,
            subject: customerTemplate.subject,
            html: customerTemplate.html,
            text: customerTemplate.text,
            templateKey: 'contact',
            category: 'contact',
            payload: { lead },
        }));
    }

    results.push(await sendAndLog({
        to: adminRecipient,
        subject: adminTemplate.subject,
        html: adminTemplate.html,
        text: adminTemplate.text,
        templateKey: 'contact-admin',
        category: 'lead-notification',
        payload: { lead },
    }));

    return results;
};

const sendBookingEmails = async ({ booking }) => {
    const brand = await getBrandContext();
    const customerTemplate = buildBookingEmail({ brand, booking, mode: 'customer' });
    const adminTemplate = buildBookingEmail({ brand, booking, mode: 'admin' });
    const adminRecipient = brand.contactEmail || process.env.EMAIL_FROM || 'priyadharshanganeshan2004@gmail.com';

    const results = [];
    if (booking.email) {
        results.push(await sendAndLog({
            to: booking.email,
            subject: customerTemplate.subject,
            html: customerTemplate.html,
            text: customerTemplate.text,
            templateKey: 'booking',
            category: 'booking',
            payload: { booking },
        }));
    }

    results.push(await sendAndLog({
        to: adminRecipient,
        subject: adminTemplate.subject,
        html: adminTemplate.html,
        text: adminTemplate.text,
        templateKey: 'booking-admin',
        category: 'booking-notification',
        payload: { booking },
    }));

    return results;
};

const sendOtpEmail = async ({ email, otp, purpose = 'password reset' }) => {
    const brand = await getBrandContext();
    const template = buildOtpEmail({ brand, email, otp, purpose });

    return sendAndLog({
        to: email,
        subject: template.subject,
        html: template.html,
        text: template.text,
        templateKey: 'otp',
        category: 'security',
        payload: { email, otp, purpose },
    });
};

const sendResetPasswordEmail = async ({ email, resetUrl }) => {
    const brand = await getBrandContext();
    const template = buildNewsletterEmail({
        brand,
        subscriber: { name: email.split('@')[0], email, status: 'subscribed' },
        subject: 'Password reset completed',
        message: 'Your password has been updated successfully. If you did not authorize this change, contact our support team immediately.',
        ctaText: 'Return to login',
        ctaUrl: resetUrl || `${process.env.FRONTEND_URL || 'http://localhost:5173'}/login`,
        mode: 'campaign',
    });

    return sendAndLog({
        to: email,
        subject: template.subject,
        html: template.html,
        text: template.text,
        templateKey: 'reset-password',
        category: 'security',
        payload: { email, resetUrl },
    });
};

const sendNewsletterConfirmationEmail = async ({ subscriber }) => {
    const brand = await getBrandContext();
    const template = buildNewsletterEmail({ brand, subscriber, mode: 'confirmation' });

    return sendAndLog({
        to: subscriber.email,
        subject: template.subject,
        html: template.html,
        text: template.text,
        templateKey: 'newsletter',
        category: 'newsletter',
        payload: { subscriber },
    });
};

const sendNewsletterCampaignEmail = async ({ subscriber, subject, message, ctaText, ctaUrl }) => {
    const brand = await getBrandContext();
    const template = buildNewsletterEmail({ brand, subscriber, subject, message, ctaText, ctaUrl, mode: 'campaign' });

    return sendAndLog({
        to: subscriber.email,
        subject: template.subject,
        html: template.html,
        text: template.text,
        templateKey: 'newsletter-campaign',
        category: 'campaign',
        payload: { subscriber, subject, message, ctaText, ctaUrl },
    });
};

const sendInvoiceEmail = async ({ invoice, client, mode = 'new' }) => {
    const brand = await getBrandContext();
    const template = buildInvoiceEmail({ brand, invoice, client, mode });

    return sendAndLog({
        to: client?.email || invoice.client?.email,
        subject: template.subject,
        html: template.html,
        text: template.text,
        templateKey: 'invoice',
        category: 'invoice',
        payload: { invoice, client, mode },
    });
};

const sendProjectUpdateEmail = async ({ project, client, updateType, message }) => {
    const brand = await getBrandContext();
    const template = buildProjectUpdateEmail({ brand, project, client, updateType, message });

    return sendAndLog({
        to: client?.email || project.client?.email,
        subject: template.subject,
        html: template.html,
        text: template.text,
        templateKey: 'project-update',
        category: 'project',
        payload: { project, client, updateType, message },
    });
};

const sendCustomEmail = async ({ recipient, subject, message, html, text, replyTo }) => {
    const brand = await getBrandContext();
    const resolvedHtml = html || buildNewsletterEmail({
        brand,
        subscriber: { name: recipient.split('@')[0], email: recipient, status: 'subscribed' },
        subject,
        message,
        ctaText: 'Open website',
        ctaUrl: `${process.env.FRONTEND_URL || 'http://localhost:5173'}`,
        mode: 'campaign',
    }).html;

    const resolvedText = text || message || subject;

    return sendAndLog({
        to: recipient,
        subject,
        html: resolvedHtml,
        text: resolvedText,
        templateKey: 'custom',
        category: 'custom',
        payload: { recipient, subject, message, html, text },
        replyTo,
    });
};

const resendLoggedEmail = async (emailLog) => {
    return sendAndLog({
        to: emailLog.recipient,
        subject: emailLog.subject,
        html: emailLog.html,
        text: emailLog.text,
        templateKey: emailLog.templateKey || 'custom',
        category: emailLog.category || 'general',
        payload: emailLog.payload || {},
    });
};

const getEmailStats = async () => {
    const [sent, failed, subscribers, templates, recent] = await Promise.all([
        EmailLog.countDocuments({ status: 'sent' }),
        EmailLog.countDocuments({ status: 'failed' }),
        require('../models/NewsletterSubscriber').countDocuments({ status: 'subscribed' }),
        EmailTemplate.countDocuments({ isActive: true }),
        EmailLog.find().sort({ createdAt: -1 }).limit(5).lean(),
    ]);

    return {
        sent,
        failed,
        subscribers,
        templates,
        recent,
        deliveryRate: sent + failed === 0 ? 100 : Math.round((sent / (sent + failed)) * 100),
    };
};

module.exports = {
    ensureDefaultTemplates,
    getBrandContext,
    logEmail,
    sendAndLog,
    sendWelcomeEmail,
    sendLoginNotificationEmail,
    sendContactEmails,
    sendBookingEmails,
    sendOtpEmail,
    sendResetPasswordEmail,
    sendNewsletterConfirmationEmail,
    sendNewsletterCampaignEmail,
    sendInvoiceEmail,
    sendProjectUpdateEmail,
    sendCustomEmail,
    resendLoggedEmail,
    getEmailStats,
};