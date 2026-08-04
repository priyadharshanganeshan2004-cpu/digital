const { buildEmailLayout } = require('./_shared');

const buildOtpEmail = ({ brand, email, otp, purpose = 'password reset' }) => {
    const content = buildEmailLayout({
        brand,
        preheader: 'Verification code',
        title: 'OTP Verification',
        headline: `Your ${purpose} code`,
        intro: `Use the verification code below to complete your ${purpose}. The code expires shortly for your security.`,
        details: [
            { label: 'Email', value: email },
            { label: 'Code', value: otp },
        ],
        bodyHtml: `
            <div style="margin:24px 0;padding:24px;border-radius:20px;background:linear-gradient(135deg, #eff6ff, #f5f3ff);text-align:center;border:1px dashed #cbd5e1;">
                <div style="font-size:34px;letter-spacing:10px;font-weight:800;color:#0f172a;">${String(otp).split('').join(' ')}</div>
                <p style="margin:12px 0 0;color:#475569;font-size:13px;">This code expires in 10 minutes.</p>
            </div>
        `,
        footerNote: 'Never share this code with anyone. Our team will never ask for it outside the official website.',
    });

    return {
        subject: `${purpose.charAt(0).toUpperCase() + purpose.slice(1)} code - ${brand.siteName || 'NexusDigital'}`,
        ...content,
    };
};

module.exports = { buildOtpEmail };