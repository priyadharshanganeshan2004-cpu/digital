const { body } = require('express-validator');

const contactEmailValidators = [
    body('name')
        .trim()
        .notEmpty().withMessage('Name is required')
        .isLength({ max: 100 }).withMessage('Name must be 100 characters or fewer'),
    body('email')
        .trim()
        .isEmail().withMessage('Please enter a valid email address')
        .normalizeEmail(),
    body('company')
        .optional()
        .trim()
        .isLength({ max: 200 }).withMessage('Company name must be 200 characters or fewer'),
    body('phone')
        .optional()
        .trim()
        .matches(/^[\d\s+\-().]*$/).withMessage('Phone number contains invalid characters')
        .isLength({ max: 30 }).withMessage('Phone number is too long'),
    body('service')
        .trim()
        .notEmpty().withMessage('Service is required')
        .isLength({ max: 100 }).withMessage('Service value is too long'),
    body('budget')
        .optional()
        .trim()
        .isLength({ max: 100 }).withMessage('Budget value is too long'),
    body('message')
        .trim()
        .notEmpty().withMessage('Message is required')
        .isLength({ min: 10 }).withMessage('Message must be at least 10 characters')
        .isLength({ max: 2000 }).withMessage('Message must be 2000 characters or fewer'),
];

const bookingEmailValidators = [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').trim().isEmail().withMessage('Please enter a valid email address'),
    body('service').trim().notEmpty().withMessage('Service is required'),
    body('date').trim().notEmpty().withMessage('Date is required'),
    body('time').trim().notEmpty().withMessage('Time is required'),
];

const newsletterValidators = [
    body('email').trim().isEmail().withMessage('Please enter a valid email address'),
];

const otpValidators = [
    body('email').trim().isEmail().withMessage('Please enter a valid email address'),
];

const resetPasswordValidators = [
    body('email').trim().isEmail().withMessage('Please enter a valid email address'),
    body('otp').trim().isLength({ min: 4 }).withMessage('OTP is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

const customEmailValidators = [
    body('recipient').trim().isEmail().withMessage('Recipient email is required'),
    body('subject').trim().notEmpty().withMessage('Subject is required'),
    body('message').trim().notEmpty().withMessage('Message is required'),
];

const campaignValidators = [
    body('subject').trim().notEmpty().withMessage('Subject is required'),
    body('message').trim().notEmpty().withMessage('Message is required'),
];

module.exports = {
    contactEmailValidators,
    bookingEmailValidators,
    newsletterValidators,
    otpValidators,
    resetPasswordValidators,
    customEmailValidators,
    campaignValidators,
};