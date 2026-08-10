const { buildEmailLayout } = require('./_shared');

const buildContactEmail = ({ brand, lead, mode = 'customer' }) => {
    const isAdmin = mode === 'admin';
    const content = buildEmailLayout({
        brand,
        preheader: isAdmin ? 'New lead captured' : 'We received your inquiry',
        title: isAdmin ? 'New Lead' : 'Contact Confirmation',
        headline: isAdmin ? `New lead from ${lead.name}` : `Thanks for reaching out, ${lead.name}!`,
        intro: isAdmin
            ? `${lead.name} submitted a new inquiry through the website contact form.`
            : 'We have received your message and will review the details shortly.',
        details: [
            { label: 'Name', value: lead.name },
            { label: 'Email', value: lead.email },
            { label: 'Service', value: lead.service },
            { label: 'Company', value: lead.company || '—' },
            { label: 'Phone', value: lead.phone || '—' },
            { label: 'Budget', value: lead.budget || '—' },
        ],
        bodyHtml: lead.message ? `<div style="margin-top:8px;padding:18px;border-radius:18px;background:#f8fafc;border:1px solid #e2e8f0;">${lead.message.split('\n').map((line) => `<p style="margin:0 0 12px;line-height:1.7;color:#334155;">${line}</p>`).join('')}</div>` : '',
        ctaText: isAdmin ? 'Review leads' : 'View our services',
        ctaUrl: isAdmin ? `${process.env.FRONTEND_URL || 'http://localhost:5173'}/admin/leads` : `${process.env.FRONTEND_URL || 'http://localhost:5173'}/services`,
        footerNote: isAdmin
            ? 'This lead should be reviewed promptly to maintain response times.'
            : 'A team member will follow up if additional information is required.',
    });

    return {
        subject: isAdmin
            ? `New lead from ${lead.name} - ${brand.siteName || 'Scalax Labs'}`
            : `We received your message, ${lead.name}`,
        ...content,
    };
};

module.exports = { buildContactEmail };
