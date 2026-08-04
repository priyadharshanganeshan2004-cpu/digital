const mongoose = require('mongoose');

const newsletterSubscriberSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: [true, 'Please provide an email address'],
            trim: true,
            lowercase: true,
            unique: true,
        },
        name: {
            type: String,
            trim: true,
            default: '',
        },
        status: {
            type: String,
            enum: ['subscribed', 'unsubscribed'],
            default: 'subscribed',
        },
        source: {
            type: String,
            default: 'website',
        },
        tags: [String],
        confirmedAt: Date,
        unsubscribedAt: Date,
    },
    {
        timestamps: true,
    }
);

newsletterSubscriberSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('NewsletterSubscriber', newsletterSubscriberSchema);