const express = require('express');
const { createLead, getLeads } = require('../controllers/leadController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// Public route for frontend submission
router.post('/', createLead);

// Protected Admin route for dashboard fetching
router.get('/', protect, authorize('admin'), getLeads);

module.exports = router;
