const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
        },
        otpHash: {
            type: String,
            required: true,
        },
        purpose: {
            type: String,
            enum: ['password-reset', 'newsletter-confirmation', 'login-verification'],
            default: 'password-reset',
        },
        expiresAt: {
            type: Date,
            required: true,
            index: { expires: 0 },
        },
        attempts: {
            type: Number,
            default: 0,
        },
        usedAt: Date,
    },
    {
        timestamps: true,
    }
);

otpSchema.index({ email: 1, purpose: 1, createdAt: -1 });

module.exports = mongoose.model('Otp', otpSchema);