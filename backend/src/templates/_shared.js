const escapeHtml = (value = '') =>
    String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');

const formatParagraphs = (value = '') =>
    escapeHtml(value)
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => `<p style="margin:0 0 14px;line-height:1.7;color:#334155;">${line}</p>`)
        .join('');

const buildEmailLayout = ({
    brand,
    preheader,
    title,
    headline,
    intro,
    bodyHtml = '',
    ctaText,
    ctaUrl,
    secondaryCtaText,
    secondaryCtaUrl,
    details = [],
    footerNote = '',
}) => {
    const brandName = escapeHtml(brand?.siteName || 'NexusDigital');
    const logoUrl = brand?.logoUrl || '';
    const primaryColor = brand?.primaryColor || '#6366f1';
    const accentColor = brand?.accentColor || '#a855f7';
    const contactEmail = escapeHtml(brand?.contactEmail || 'hello@nexusdigital.com');
    const phone = escapeHtml(brand?.phone || '+1 (555) 123-4567');
    const address = escapeHtml(brand?.address || '123 Business Avenue, New York, NY');
    const facebook = brand?.facebook || '';
    const instagram = brand?.instagram || '';
    const linkedin = brand?.linkedin || '';
    const youtube = brand?.youtube || '';

    const detailMarkup = details.length
        ? `
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:24px 0;border-collapse:collapse;">
                ${details
                    .map(
                        (detail) => `
                            <tr>
                                <td style="padding:10px 0;border-bottom:1px solid #e2e8f0;color:#64748b;font-size:14px;">${escapeHtml(detail.label)}</td>
                                <td style="padding:10px 0;border-bottom:1px solid #e2e8f0;color:#0f172a;font-size:14px;font-weight:600;text-align:right;">${escapeHtml(detail.value)}</td>
                            </tr>`
                    )
                    .join('')}
            </table>`
        : '';

    const ctaMarkup = ctaText && ctaUrl
        ? `
            <table role="presentation" cellspacing="0" cellpadding="0" style="margin:28px 0 12px;">
                <tr>
                    <td align="center" style="border-radius:14px;background:${primaryColor};">
                        <a href="${ctaUrl}" style="display:inline-block;padding:14px 28px;color:#ffffff;text-decoration:none;font-weight:700;font-size:15px;">${escapeHtml(ctaText)}</a>
                    </td>
                    ${secondaryCtaText && secondaryCtaUrl ? `
                        <td style="width:12px;">&nbsp;</td>
                        <td align="center" style="border-radius:14px;background:#e2e8f0;">
                            <a href="${secondaryCtaUrl}" style="display:inline-block;padding:14px 24px;color:#0f172a;text-decoration:none;font-weight:700;font-size:15px;">${escapeHtml(secondaryCtaText)}</a>
                        </td>` : ''}
                </tr>
            </table>`
        : '';

    const socialMarkup = [
        facebook ? `<a href="${facebook}" style="color:${primaryColor};text-decoration:none;margin-right:14px;">Facebook</a>` : '',
        instagram ? `<a href="${instagram}" style="color:${primaryColor};text-decoration:none;margin-right:14px;">Instagram</a>` : '',
        linkedin ? `<a href="${linkedin}" style="color:${primaryColor};text-decoration:none;margin-right:14px;">LinkedIn</a>` : '',
        youtube ? `<a href="${youtube}" style="color:${primaryColor};text-decoration:none;">YouTube</a>` : '',
    ].filter(Boolean).join('');

    return {
        html: `
            <!doctype html>
            <html lang="en">
            <head>
                <meta charset="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta name="x-apple-disable-message-reformatting" />
                <title>${escapeHtml(title || headline || brandName)}</title>
            </head>
            <body style="margin:0;padding:0;background:#f8fafc;font-family:Arial,Helvetica,sans-serif;color:#0f172a;">
                <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${escapeHtml(preheader || headline || title || brandName)}</div>
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f8fafc;padding:32px 16px;">
                    <tr>
                        <td align="center">
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;background:#ffffff;border-radius:24px;overflow:hidden;box-shadow:0 24px 60px rgba(15,23,42,0.08);">
                                <tr>
                                    <td style="padding:28px 32px 0;">
                                        <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                                            <tr>
                                                <td>
                                                    ${logoUrl ? `<img src="${logoUrl}" alt="${brandName}" style="height:42px;max-width:180px;object-fit:contain;display:block;" />` : `<div style="display:inline-flex;align-items:center;justify-content:center;width:48px;height:48px;border-radius:14px;background:linear-gradient(135deg, ${primaryColor}, ${accentColor});color:#fff;font-weight:800;font-size:18px;">${brandName.slice(0,1)}</div>`}
                                                </td>
                                                <td align="right" style="color:#64748b;font-size:13px;font-weight:600;">${brandName}</td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding:28px 32px 8px;">
                                        <p style="margin:0 0 10px;color:${primaryColor};font-size:12px;font-weight:800;letter-spacing:.12em;text-transform:uppercase;">${escapeHtml(preheader || 'Notification')}</p>
                                        <h1 style="margin:0 0 14px;font-size:30px;line-height:1.2;color:#0f172a;">${escapeHtml(headline || title || 'Update from ' + brandName)}</h1>
                                        ${intro ? formatParagraphs(intro) : ''}
                                        ${bodyHtml}
                                        ${detailMarkup}
                                        ${ctaMarkup}
                                        ${footerNote ? `<p style="margin:24px 0 0;color:#475569;line-height:1.7;">${formatParagraphs(footerNote)}</p>` : ''}
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding:24px 32px 32px;background:linear-gradient(180deg, #ffffff, #f8fafc);border-top:1px solid #e2e8f0;">
                                        <p style="margin:0 0 12px;color:#475569;font-size:14px;line-height:1.7;">${escapeHtml(brandName)} • ${address}</p>
                                        <p style="margin:0 0 16px;color:#475569;font-size:14px;line-height:1.7;">
                                            <a href="mailto:${contactEmail}" style="color:${primaryColor};text-decoration:none;">${contactEmail}</a>
                                            ${phone ? `&nbsp;&nbsp;|&nbsp;&nbsp;<a href="tel:${phone.replace(/\s+/g, '')}" style="color:${primaryColor};text-decoration:none;">${phone}</a>` : ''}
                                        </p>
                                        ${socialMarkup ? `<p style="margin:0 0 20px;font-size:14px;">${socialMarkup}</p>` : ''}
                                        <p style="margin:0;color:#94a3b8;font-size:12px;line-height:1.6;">© ${new Date().getFullYear()} ${brandName}. All rights reserved.</p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </body>
            </html>
        `,
        text: [
            headline || title || brandName,
            intro || '',
            details.map((detail) => `${detail.label}: ${detail.value}`).join('\n'),
            footerNote || '',
        ].filter(Boolean).join('\n\n'),
    };
};

module.exports = {
    escapeHtml,
    formatParagraphs,
    buildEmailLayout,
};