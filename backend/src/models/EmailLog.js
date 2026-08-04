const mongoose = require('mongoose');

const emailLogSchema = new mongoose.Schema(
    {
        recipient: {
            type: String,
            required: true,
            trim: true,
        },
        subject: {
            type: String,
            required: true,
            trim: true,
        },
        templateKey: {
            type: String,
            default: 'custom',
            trim: true,
        },
        category: {
            type: String,
            default: 'general',
            trim: true,
        },
        status: {
            type: String,
            enum: ['sent', 'failed'],
            default: 'sent',
        },
        provider: {
            type: String,
            default: 'unknown',
        },
        html: {
            type: String,
            default: '',
        },
        text: {
            type: String,
            default: '',
        },
        payload: {
            type: mongoose.Schema.Types.Mixed,
            default: {},
        },
        error: {
            type: String,
            default: '',
        },
        sentAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

emailLogSchema.index({ status: 1, createdAt: -1 });
emailLogSchema.index({ recipient: 1, createdAt: -1 });

module.exports = mongoose.model('EmailLog', emailLogSchema);