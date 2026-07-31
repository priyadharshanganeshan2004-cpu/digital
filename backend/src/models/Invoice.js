const mongoose = require('mongoose');

const invoiceItemSchema = new mongoose.Schema({
    description: { type: String, required: true },
    quantity: { type: Number, required: true, default: 1 },
    rate: { type: Number, required: true },
    amount: { type: Number, required: true },
});

const invoiceSchema = new mongoose.Schema(
    {
        invoiceNumber: {
            type: String,
            unique: true,
        },
        client: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Please assign a client'],
        },
        project: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Project',
        },
        items: [invoiceItemSchema],
        subtotal: {
            type: Number,
            required: true,
        },
        tax: {
            type: Number,
            default: 0,
        },
        total: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            enum: ['draft', 'sent', 'paid', 'overdue', 'cancelled'],
            default: 'draft',
        },
        dueDate: Date,
        paidAt: Date,
        paymentMethod: String,
        notes: String,
    },
    {
        timestamps: true,
    }
);

// Auto-generate invoice number before save
invoiceSchema.pre('save', async function (next) {
    if (!this.invoiceNumber) {
        const count = await mongoose.model('Invoice').countDocuments();
        const year = new Date().getFullYear();
        this.invoiceNumber = `INV-${year}-${String(count + 1).padStart(4, '0')}`;
    }
    next();
});

invoiceSchema.index({ client: 1, status: 1 });

module.exports = mongoose.model('Invoice', invoiceSchema);
