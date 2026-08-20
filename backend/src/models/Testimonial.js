const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Client name is required'],
            trim: true,
            maxlength: [100, 'Name cannot exceed 100 characters'],
        },
        role: {
            type: String,
            required: [true, 'Job title/role is required'],
            trim: true,
            maxlength: [100, 'Role cannot exceed 100 characters'],
        },
        company: {
            type: String,
            required: [true, 'Company name is required'],
            trim: true,
            maxlength: [100, 'Company cannot exceed 100 characters'],
        },
        message: {
            type: String,
            required: [true, 'Testimonial message is required'],
            trim: true,
            maxlength: [1000, 'Message cannot exceed 1000 characters'],
        },
        rating: {
            type: Number,
            required: [true, 'Rating is required'],
            min: [1, 'Rating must be at least 1'],
            max: [5, 'Rating cannot exceed 5'],
            default: 5,
        },
        // Avatar URL — if blank, the frontend uses initials
        avatar: {
            type: String,
            default: '',
            trim: true,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        // Controls the display order in the carousel (lower = first)
        order: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);

// Index for fast public fetch (active + ordered)
testimonialSchema.index({ isActive: 1, order: 1 });

module.exports = mongoose.model('Testimonial', testimonialSchema);
