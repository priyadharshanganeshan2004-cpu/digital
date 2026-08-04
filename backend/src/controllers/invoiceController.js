const Invoice = require('../models/Invoice');
const Notification = require('../models/Notification');
const asyncHandler = require('../middleware/asyncHandler');
const { sendInvoiceEmail } = require('../services/emailService');

const safeSend = async (task, label) => {
    try {
        await task;
    } catch (error) {
        console.error(`${label} email delivery failed:`, error.message);
    }
};

// @desc    Get invoices (admin: all, client: own)
// @route   GET /api/invoices
// @access  Private
const getInvoices = asyncHandler(async (req, res) => {
    const { status, client: clientId } = req.query;
    let query = {};

    if (req.user.role === 'client') {
        query.client = req.user._id;
    } else if (clientId) {
        query.client = clientId;
    }

    if (status && status !== 'all') {
        query.status = status;
    }

    const invoices = await Invoice.find(query)
        .populate('client', 'name email company')
        .populate('project', 'title')
        .sort({ createdAt: -1 });

    res.json({ success: true, count: invoices.length, data: invoices });
});

// @desc    Get single invoice
// @route   GET /api/invoices/:id
// @access  Private (ownership check)
const getInvoiceById = asyncHandler(async (req, res) => {
    const invoice = await Invoice.findById(req.params.id)
        .populate('client', 'name email company phone')
        .populate('project', 'title service');

    if (!invoice) {
        res.status(404);
        throw new Error('Invoice not found');
    }

    if (req.user.role === 'client' && invoice.client._id.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error('Not authorized to view this invoice');
    }

    res.json({ success: true, data: invoice });
});

// @desc    Create invoice
// @route   POST /api/invoices
// @access  Admin
const createInvoice = asyncHandler(async (req, res) => {
    const { client, project, items, tax, dueDate, notes } = req.body;

    const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
    const total = subtotal + (tax || 0);

    const invoice = await Invoice.create({
        client,
        project,
        items,
        subtotal,
        tax: tax || 0,
        total,
        dueDate,
        notes,
    });

    const populated = await invoice.populate('client', 'name email company');

    await safeSend(sendInvoiceEmail({ invoice: populated, client: populated.client, mode: 'new' }), 'Invoice');

    // Notify client
    await Notification.create({
        recipient: client,
        title: 'New Invoice',
        message: `Invoice ${invoice.invoiceNumber} for $${total.toLocaleString()} has been generated.`,
        type: 'invoice',
        link: `/dashboard/invoices`,
    });

    res.status(201).json({ success: true, data: populated });
});

// @desc    Update invoice
// @route   PUT /api/invoices/:id
// @access  Admin
const updateInvoice = asyncHandler(async (req, res) => {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) {
        res.status(404);
        throw new Error('Invoice not found');
    }

    const { items, tax, status, dueDate, notes } = req.body;

    if (items) {
        invoice.items = items;
        invoice.subtotal = items.reduce((sum, item) => sum + item.amount, 0);
        invoice.total = invoice.subtotal + (tax !== undefined ? tax : invoice.tax);
    }
    if (tax !== undefined) {
        invoice.tax = tax;
        invoice.total = invoice.subtotal + tax;
    }
    if (status) {
        invoice.status = status;
        if (status === 'sent') {
            await Notification.create({
                recipient: invoice.client,
                title: 'Invoice Sent',
                message: `Invoice ${invoice.invoiceNumber} is ready for review.`,
                type: 'invoice',
                link: `/dashboard/invoices`,
            });
        }
    }
    if (dueDate) invoice.dueDate = dueDate;
    if (notes !== undefined) invoice.notes = notes;

    const updated = await invoice.save();
    const populated = await updated.populate('client', 'name email company');

    if (status === 'sent') {
        await safeSend(sendInvoiceEmail({ invoice: populated, client: populated.client, mode: 'new' }), 'Invoice status');
    }

    res.json({ success: true, data: populated });
});

// @desc    Record payment
// @route   PUT /api/invoices/:id/pay
// @access  Admin
const recordPayment = asyncHandler(async (req, res) => {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) {
        res.status(404);
        throw new Error('Invoice not found');
    }

    invoice.status = 'paid';
    invoice.paidAt = new Date();
    invoice.paymentMethod = req.body.paymentMethod || 'manual';

    const updated = await invoice.save();

    const populated = await updated.populate('client', 'name email company');

    await safeSend(sendInvoiceEmail({ invoice: populated, client: populated.client, mode: 'paid' }), 'Invoice payment');

    // Notify client
    await Notification.create({
        recipient: invoice.client,
        title: 'Payment Received',
        message: `Payment for invoice ${invoice.invoiceNumber} has been recorded.`,
        type: 'invoice',
        link: `/dashboard/invoices`,
    });

    res.json({ success: true, data: populated });
});

module.exports = {
    getInvoices,
    getInvoiceById,
    createInvoice,
    updateInvoice,
    recordPayment,
};
