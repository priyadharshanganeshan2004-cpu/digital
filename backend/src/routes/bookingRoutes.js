const express = require('express');
const { protect, authorize } = require('../middleware/authMiddleware');
const {
    createBooking,
    getBookings,
    updateBooking,
} = require('../controllers/bookingController');

const router = express.Router();

// Public: create booking (optionally pass auth)
router.post('/', createBooking);

// Protected routes
router.get('/', protect, getBookings);
router.put('/:id', protect, authorize('admin'), updateBooking);

module.exports = router;
