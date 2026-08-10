const { buildEmailLayout } = require('./_shared');

const buildContactEmail = ({ brand, lead, mode = 'customer', meta = {} }) => {
    const isAdmin = mode === 'admin';

    // ── Format submission metadata for admin email ──────────────────────
    const { submittedAt, clientIp, userAgent } = meta;
    const formattedTime = submittedAt
        ? new Date(submittedAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', hour12: true })
        : new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', hour12: true });

    // Admin-only metadata rows
    const adminMetaRows = isAdmin
        ? [
            { label: 'Submitted at', value: `${formattedTime} (IST)` },
            ...(clientIp && clientIp !== 'unknown' ? [{ label: 'Client IP', value: clientIp }] : []),
        ]
        : [];

    const content = buildEmailLayout({
        brand,
        preheader: isAdmin ? `New contact form submission from ${lead.name}` : 'We received your inquiry',
        title: isAdmin ? 'New Contact Form Submission' : 'Contact Confirmation',
        headline: isAdmin
            ? `New inquiry from ${lead.name}`
            : `Thanks for reaching out, ${lead.name}!`,
        intro: isAdmin
            ? `${lead.name} submitted a new inquiry through the Scalax Labs contact form. Details are below.`
            : 'We have received your message and will review the details shortly. A team member will be in touch within 24 hours.',
        details: [
            { label: 'Name', value: lead.name },
            { label: 'Email', value: lead.email },
            { label: 'Company', value: lead.company || '—' },
            { label: 'Phone', value: lead.phone || '—' },
            { label: 'Service', value: lead.service },
            { label: 'Budget', value: lead.budget || '—' },
            ...adminMetaRows,
        ],
        bodyHtml: lead.message
            ? `<div style="margin-top:16px;padding:18px;border-radius:12px;background:#f8fafc;border:1px solid #e2e8f0;">
                 <p style="margin:0 0 8px;font-size:13px;font-weight:600;color:#64748b;text-transform:uppercase;letter-spacing:0.05em;">Message</p>
                 ${lead.message
                .split('\n')
                .map((line) => `<p style="margin:0 0 12px;line-height:1.7;color:#334155;">${line}</p>`)
                .join('')}
               </div>`
            : '',
        ctaText: isAdmin ? 'View leads in dashboard' : 'View our services',
        ctaUrl: isAdmin
            ? `${process.env.FRONTEND_URL || 'http://localhost:5173'}/admin/leads`
            : `${process.env.FRONTEND_URL || 'http://localhost:5173'}/services`,
        footerNote: isAdmin
            ? 'Respond promptly to maintain high customer satisfaction.'
            : 'If you have any urgent questions, feel free to call us directly.',
    });

    return {
        subject: isAdmin
            ? `New Contact Form Submission - Scalax Labs (from ${lead.name})`
            : `We received your message, ${lead.name} — Scalax Labs`,
        ...content,
    };
};

module.exports = { buildContactEmail };
