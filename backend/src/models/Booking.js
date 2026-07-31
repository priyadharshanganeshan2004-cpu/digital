const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
    {
        client: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        name: {
            type: String,
            required: [true, 'Please provide your name'],
            trim: true,
        },
        email: {
            type: String,
            required: [true, 'Please provide your email'],
            trim: true,
        },
        phone: {
            type: String,
            trim: true,
        },
        service: {
            type: String,
            required: [true, 'Please select a service'],
        },
        date: {
            type: String,
            required: [true, 'Please select a date'],
        },
        time: {
            type: String,
            required: [true, 'Please select a time'],
        },
        message: {
            type: String,
            trim: true,
        },
        status: {
            type: String,
            enum: ['pending', 'confirmed', 'cancelled', 'completed'],
            default: 'pending',
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Booking', bookingSchema);
