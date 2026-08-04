const express = require('express');
const rateLimit = require('express-rate-limit');
const { protect, authorize } = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validateRequest');
const { bookingEmailValidators } = require('../validators/emailValidators');
const {
    createBooking,
    getBookings,
    updateBooking,
} = require('../controllers/bookingController');

const router = express.Router();
const bookingLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: 'Too many booking requests, please try again later.' },
});

// Public: create booking (optionally pass auth)
router.post('/', bookingLimiter, bookingEmailValidators, validateRequest, createBooking);

// Protected routes
router.get('/', protect, getBookings);
router.put('/:id', protect, authorize('admin'), updateBooking);

module.exports = router;
