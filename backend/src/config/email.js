const dns = require('node:dns');
const nodemailer = require('nodemailer');
const sgMail = require('@sendgrid/mail');

if (typeof dns.setDefaultResultOrder === 'function') {
    dns.setDefaultResultOrder('ipv4first');
}

// Production: hrteam@scalaxlab.in (on verified domain scalaxlab.in)
// Override via EMAIL_FROM env var in Render if needed.
const EMAIL_FROM = process.env.EMAIL_FROM || 'Scalax Labs <hrteam@scalaxlab.in>';
const RESEND_API_KEY = process.env.RESEND_API_KEY || '';
const SMTP_HOST = process.env.SMTP_HOST || '';
const SMTP_PORT = Number(process.env.SMTP_PORT || 587);
const SMTP_USER = process.env.SMTP_USER || '';
const SMTP_PASS = process.env.SMTP_PASS || '';

const smtpConfigured = Boolean(SMTP_HOST && SMTP_USER && SMTP_PASS);

const smtpTransport = smtpConfigured
    ? nodemailer.createTransport({
        host: SMTP_HOST,
        port: SMTP_PORT,
        secure: SMTP_PORT === 465,
        auth: {
            user: SMTP_USER,
            pass: SMTP_PASS,
        },
        // Force IPv4 family to avoid ENETUNREACH when host environment lacks IPv6 egress
        family: 4,
        // Reuse connections for multiple messages to reduce overhead
        pool: true,
        maxConnections: Number(process.env.EMAIL_MAX_CONNECTIONS || 5),
        maxMessages: Number(process.env.EMAIL_MAX_MESSAGES || 100),
        // Timeouts (ms) to fail fast and avoid long blocking waits
        connectionTimeout: Number(process.env.EMAIL_CONNECTION_TIMEOUT || 10000),
        greetingTimeout: Number(process.env.EMAIL_GREETING_TIMEOUT || 10000),
        socketTimeout: Number(process.env.EMAIL_SOCKET_TIMEOUT || 15000),
    })
    : null;

const normalizeRecipients = (to) => (Array.isArray(to) ? to : [to]).filter(Boolean);

const sendViaSendGrid = async ({ to, subject, html, text, replyTo, from = EMAIL_FROM }) => {
    const sender = from;
    const emailMatch = sender.match(/<([^>]+)>/);
    const emailAddress = emailMatch ? emailMatch[1].trim() : sender.trim();
    if (emailAddress !== 'priyadharshanganeshan2004@gmail.com') {
        throw new Error(`From address ${sender} does not match verified SendGrid Single Sender (priyadharshanganeshan2004@gmail.com)`);
    }

    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
        to,
        from: sender,
        subject,
        html,
        text,
    };
    if (replyTo) msg.replyTo = replyTo;
    const [response] = await sgMail.send(msg);
    return { provider: 'sendgrid', messageId: response.headers['x-message-id'] || null };
};

const sendViaResend = async ({ to, subject, html, text, replyTo, from = EMAIL_FROM }) => {
    const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${RESEND_API_KEY}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            from,
            to: normalizeRecipients(to),
            subject,
            html,
            text,
            reply_to: replyTo,
        }),
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
        // Log detailed error server-side only — never expose to the frontend
        console.error('[email/resend] delivery failed:', response.status, data?.message || data);
        throw new Error('Email delivery failed. Please try again later.');
    }

    return data;
};

const sendViaSmtp = async ({ to, subject, html, text, replyTo, from = EMAIL_FROM }) => {
    if (!smtpTransport) {
        throw new Error('SMTP transport is not configured');
    }

    return smtpTransport.sendMail({
        from,
        to,
        subject,
        html,
        text,
        replyTo,
    });
};

const sendMail = async (options) => {
    if (process.env.SENDGRID_API_KEY) {
        return sendViaSendGrid(options);
    }

    if (RESEND_API_KEY) {
        return sendViaResend(options);
    }

    if (smtpTransport) {
        return sendViaSmtp(options);
    }

    if (process.env.NODE_ENV === 'development') {
        return {
            id: 'dev-mock-email',
            provider: 'mock',
            accepted: normalizeRecipients(options.to),
        };
    }

    throw new Error('No email provider configured. Set SENDGRID_API_KEY, RESEND_API_KEY or SMTP credentials.');
};

module.exports = {
    EMAIL_FROM,
    sendMail,
};
