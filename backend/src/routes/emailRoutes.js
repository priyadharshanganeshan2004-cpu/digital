const express = require('express');
const rateLimit = require('express-rate-limit');
const { protect, authorize } = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validateRequest');
const {
    contactEmailValidators,
    bookingEmailValidators,
    newsletterValidators,
    otpValidators,
    resetPasswordValidators,
    customEmailValidators,
    campaignValidators,
} = require('../validators/emailValidators');
const {
    sendContact,
    sendBooking,
    sendNewsletter,
    requestOtp,
    resetPasswordWithOtp,
    sendCustom,
    getLogs,
    getStats,
    getSubscribers,
    getTemplates,
    resendEmail,
    sendCampaign,
} = require('../controllers/emailController');

const router = express.Router();

const publicLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: 'Too many email requests. Please try again later.' },
});

router.post('/contact', publicLimiter, contactEmailValidators, validateRequest, sendContact);
router.post('/booking', publicLimiter, bookingEmailValidators, validateRequest, sendBooking);
router.post('/newsletter', publicLimiter, newsletterValidators, validateRequest, sendNewsletter);
router.post('/otp', publicLimiter, otpValidators, validateRequest, requestOtp);
router.post('/reset-password', publicLimiter, resetPasswordValidators, validateRequest, resetPasswordWithOtp);

router.use(protect, authorize('admin'));

router.get('/logs', getLogs);
router.get('/stats', getStats);
router.get('/subscribers', getSubscribers);
router.get('/templates', getTemplates);
router.post('/send', customEmailValidators, validateRequest, sendCustom);
router.post('/campaign', campaignValidators, validateRequest, sendCampaign);
router.post('/:id/resend', resendEmail);

module.exports = router;