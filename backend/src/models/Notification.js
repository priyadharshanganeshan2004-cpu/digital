const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
    {
        recipient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        title: {
            type: String,
            required: [true, 'Notification title is required'],
        },
        message: {
            type: String,
            required: [true, 'Notification message is required'],
        },
        type: {
            type: String,
            enum: ['project_update', 'invoice', 'message', 'general'],
            default: 'general',
        },
        link: {
            type: String,
            default: '',
        },
        isRead: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

notificationSchema.index({ recipient: 1, isRead: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);
