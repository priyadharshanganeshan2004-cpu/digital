const { buildEmailLayout } = require('./_shared');

const buildInvoiceEmail = ({ brand, invoice, client, mode = 'new' }) => {
    const isPaid = mode === 'paid';
    const content = buildEmailLayout({
        brand,
        preheader: isPaid ? 'Payment received' : 'Your invoice is ready',
        title: 'Invoice Email',
        headline: isPaid ? `Payment received for ${invoice.invoiceNumber}` : `Invoice ${invoice.invoiceNumber} is ready`,
        intro: isPaid
            ? `We have recorded a payment for invoice ${invoice.invoiceNumber}.`
            : `Please review your invoice ${invoice.invoiceNumber} and complete payment by the due date.`,
        details: [
            { label: 'Client', value: client?.name || invoice.client?.name || client?.email || 'Client' },
            { label: 'Invoice No.', value: invoice.invoiceNumber },
            { label: 'Subtotal', value: `$${Number(invoice.subtotal || 0).toLocaleString()}` },
            { label: 'Tax', value: `$${Number(invoice.tax || 0).toLocaleString()}` },
            { label: 'Total', value: `$${Number(invoice.total || 0).toLocaleString()}` },
            { label: 'Status', value: invoice.status },
            { label: 'Due Date', value: invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString() : '—' },
        ],
        ctaText: isPaid ? 'View dashboard' : 'Review invoice',
        ctaUrl: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/dashboard/invoices`,
        footerNote: isPaid ? 'Thank you for your prompt payment.' : 'If you have any questions, reply to this email and our team will assist you.',
    });

    return {
        subject: isPaid
            ? `Payment received - ${invoice.invoiceNumber}`
            : `Invoice ${invoice.invoiceNumber} from ${brand.siteName || 'NexusDigital'}`,
        ...content,
    };
};

module.exports = { buildInvoiceEmail };