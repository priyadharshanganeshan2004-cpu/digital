const Booking = require('../models/Booking');
const Notification = require('../models/Notification');
const asyncHandler = require('../middleware/asyncHandler');
const { sendBookingEmails } = require('../services/emailService');

const safeSend = async (task) => {
    try {
        await task;
    } catch (error) {
        console.error('Booking email delivery failed:', error.message);
    }
};

// @desc    Create booking
// @route   POST /api/bookings
// @access  Public
const createBooking = asyncHandler(async (req, res) => {
    const { name, email, phone, service, date, time, message } = req.body;

    const bookingData = { name, email, phone, service, date, time, message };

    // If user is authenticated, link the booking
    if (req.user) {
        bookingData.client = req.user._id;
    }

    const booking = await Booking.create(bookingData);

    await safeSend(sendBookingEmails({
        booking: {
            name,
            email,
            phone,
            service,
            date,
            time,
            message,
        },
    }));

    res.status(201).json({ success: true, data: booking });
});

// @desc    Get bookings (admin: all, client: own)
// @route   GET /api/bookings
// @access  Private
const getBookings = asyncHandler(async (req, res) => {
    const { status } = req.query;
    let query = {};

    if (req.user.role === 'client') {
        query.client = req.user._id;
    }

    if (status && status !== 'all') {
        query.status = status;
    }

    const bookings = await Booking.find(query)
        .populate('client', 'name email')
        .sort({ createdAt: -1 });

    res.json({ success: true, count: bookings.length, data: bookings });
});

// @desc    Update booking status
// @route   PUT /api/bookings/:id
// @access  Admin
const updateBooking = asyncHandler(async (req, res) => {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
        res.status(404);
        throw new Error('Booking not found');
    }

    const { status } = req.body;
    if (status) booking.status = status;

    const updated = await booking.save();

    // Notify client if linked
    if (booking.client) {
        await Notification.create({
            recipient: booking.client,
            title: 'Booking Update',
            message: `Your consultation booking for ${booking.date} has been ${status}.`,
            type: 'general',
            link: `/dashboard/meetings`,
        });
    }

    res.json({ success: true, data: updated });
});

module.exports = {
    createBooking,
    getBookings,
    updateBooking,
};
