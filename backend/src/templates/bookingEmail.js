const { buildEmailLayout } = require('./_shared');

const buildBookingEmail = ({ brand, booking, mode = 'customer' }) => {
    const isAdmin = mode === 'admin';
    const content = buildEmailLayout({
        brand,
        preheader: isAdmin ? 'New consultation request' : 'Your consultation is booked',
        title: isAdmin ? 'Booking Alert' : 'Booking Confirmation',
        headline: isAdmin ? `New booking from ${booking.name}` : `Your consultation is confirmed, ${booking.name}!`,
        intro: isAdmin
            ? 'A new consultation booking was submitted on the website.'
            : 'We have reserved your consultation slot and will be ready for the meeting.',
        details: [
            { label: 'Date', value: booking.date },
            { label: 'Time', value: booking.time },
            { label: 'Service', value: booking.service },
            { label: 'Email', value: booking.email },
            { label: 'Phone', value: booking.phone || '—' },
        ],
        bodyHtml: booking.message ? `<div style="margin-top:8px;padding:18px;border-radius:18px;background:#f8fafc;border:1px solid #e2e8f0;">${booking.message.split('\n').map((line) => `<p style="margin:0 0 12px;line-height:1.7;color:#334155;">${line}</p>`).join('')}</div>` : '',
        ctaText: isAdmin ? 'Open bookings' : 'See preparation tips',
        ctaUrl: isAdmin ? `${process.env.FRONTEND_URL || 'http://localhost:5173'}/admin/bookings` : `${process.env.FRONTEND_URL || 'http://localhost:5173'}/faq`,
        footerNote: isAdmin
            ? 'Please review the booking and confirm if needed.'
            : 'If you need to reschedule, reply to this message or contact our team.',
    });

    return {
        subject: isAdmin
            ? `New booking request from ${booking.name}`
            : `Consultation confirmed for ${booking.date}`,
        ...content,
    };
};

module.exports = { buildBookingEmail };