const { body } = require('express-validator');

const contactEmailValidators = [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').trim().isEmail().withMessage('Please enter a valid email address'),
    body('service').trim().notEmpty().withMessage('Service is required'),
    body('message').trim().notEmpty().withMessage('Message is required'),
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