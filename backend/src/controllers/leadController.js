const Lead = require('../models/Lead');
const asyncHandler = require('../middleware/asyncHandler');
const { sendContactEmails } = require('../services/emailService');

// @desc    Submit a new contact form (creates a lead + fires notification email)
// @route   POST /api/leads
// @access  Public
const createLead = asyncHandler(async (req, res) => {
    const { name, company, email, phone, service, budget, message } = req.body;

    // ── 1. Persist the lead to MongoDB first ────────────────────────────
    // This always succeeds even if the email step later fails.
    const lead = await Lead.create({
        name,
        company,
        email,
        phone,
        service,
        budget,
        message,
    });

    // ── 2. Fire notification emails (best-effort, non-blocking on error) ─
    // Capture IP and User-Agent for the admin notification.
    const submittedAt = new Date().toISOString();
    const clientIp =
        req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
        req.socket?.remoteAddress ||
        'unknown';
    const userAgent = req.headers['user-agent'] || 'unknown';

    let emailStatus = 'sent';
    let emailError = null;

    try {
        await sendContactEmails({
            lead: { name, company, email, phone, service, budget, message },
            meta: { submittedAt, clientIp, userAgent },
        });
    } catch (err) {
        // Log safely — never expose provider details to the frontend.
        console.error('[leadController] Email delivery failed for lead', lead._id, ':', err.message);
        emailStatus = 'failed';
        emailError = err.message;
    }

    // ── 3. Always return success to the customer ─────────────────────────
    // Use a generic message regardless of email delivery outcome.
    res.status(201).json({
        success: true,
        message: 'Thank you! Your message has been submitted successfully. Our team will contact you soon.',
        data: { id: lead._id },
        _emailStatus: emailStatus,
        ...(process.env.NODE_ENV === 'development' && emailError ? { _emailError: emailError } : {}),
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
