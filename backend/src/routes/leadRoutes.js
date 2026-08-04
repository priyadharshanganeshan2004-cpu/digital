const express = require('express');
const { createLead, getLeads } = require('../controllers/leadController');
const { protect, authorize } = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validateRequest');
const { contactEmailValidators } = require('../validators/emailValidators');

const router = express.Router();

// Public route for frontend submission
router.post('/', contactEmailValidators, validateRequest, createLead);

// Protected Admin route for dashboard fetching
router.get('/', protect, authorize('admin'), getLeads);

module.exports = router;
