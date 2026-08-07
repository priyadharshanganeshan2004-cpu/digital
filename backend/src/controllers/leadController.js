const Lead = require('../models/Lead');
const asyncHandler = require('../middleware/asyncHandler');
const { sendContactEmails } = require('../services/emailService');

// @desc    Submit a new contact form (creates a lead)
// @route   POST /api/leads
// @access  Public
const createLead = asyncHandler(async (req, res) => {
    const { name, company, email, phone, service, budget, message } = req.body;

    const lead = await Lead.create({
        name,
        company,
        email,
        phone,
        service,
        budget,
        message,
    });

    const emailResult = await sendContactEmails({
        lead: {
            name,
            company,
            email,
            phone,
            service,
            budget,
            message,
        },
    });

    res.status(201).json({
        success: true,
        data: lead,
        emailResult,
        message: 'Lead created and contact emails sent successfully',
    });
});

// @desc    Get all leads for admin dashboard
// @route   GET /api/leads
// @access  Private/Admin
const getLeads = asyncHandler(async (req, res) => {
    const leads = await Lead.find().sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        count: leads.length,
        data: leads,
    });
});

module.exports = {
    createLead,
    getLeads,
};
