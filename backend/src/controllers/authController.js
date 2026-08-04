const User = require('../models/User');
const asyncHandler = require('../middleware/asyncHandler');
const { generateAccessToken, generateRefreshToken } = require('../utils/generateToken');
const jwt = require('jsonwebtoken');
const { sendWelcomeEmail, sendLoginNotificationEmail, sendOtpEmail } = require('../services/emailService');
const { generateOtp, verifyOtp, invalidateOtps } = require('../services/otpService');

const safeSend = async (task, label) => {
    try {
        await task;
    } catch (error) {
        console.error(`${label} email delivery failed:`, error.message);
    }
};

const isStrongPassword = (value) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(String(value || ''));

const refreshCookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/api/auth',
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
    if (typeof req.body.name !== 'string' || typeof req.body.email !== 'string' || typeof req.body.password !== 'string') {
        res.status(400);
        throw new Error('Name, email, and password are required');
    }

    const name = req.body.name.trim();
    const email = req.body.email.trim().toLowerCase();
    const password = req.body.password;
    const phone = req.body.phone?.trim();
    const company = req.body.company?.trim();

    if (!name || !email || !password) {
        res.status(400);
        throw new Error('Name, email, and password are required');
    }

    if (!isStrongPassword(password)) {
        res.status(400);
        throw new Error('Password must be at least 8 characters and include uppercase letters and numbers');
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }

    const user = await User.create({
        name,
        email,
        password,
        role: 'client',
        phone,
        company,
    });

    if (user) {
        const accessToken = generateAccessToken(user._id);
        const refreshToken = generateRefreshToken(user._id);

        res.cookie('refreshToken', refreshToken, {
            ...refreshCookieOptions,
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        if (process.env.SEND_LOGIN_NOTIFICATION_EMAILS === 'true') {
            await safeSend(sendLoginNotificationEmail({ user }), 'Login notification');
        }

        await safeSend(sendWelcomeEmail({ user }), 'Welcome');

        res.status(201).json({
            success: true,
            accessToken,
            refreshToken,
            user,
        });
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
});

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
    if (typeof req.body.email !== 'string' || typeof req.body.password !== 'string') {
        res.status(400);
        throw new Error('Email and password are required');
    }

    const email = req.body.email.trim().toLowerCase();
    const password = req.body.password;

    if (!email || !password) {
        res.status(400);
        throw new Error('Email and password are required');
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.matchPassword(password))) {
        res.status(401);
        throw new Error('Invalid email or password');
    }

    if (!user.isActive) {
        res.status(403);
        throw new Error('Account has been deactivated. Contact support.');
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    res.cookie('refreshToken', refreshToken, {
        ...refreshCookieOptions,
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
        success: true,
        accessToken,
        refreshToken,
        user,
    });
});

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }
    res.json({ success: true, data: user });
});

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = asyncHandler(async (req, res) => {
    console.log('[updateProfile] Incoming request body:', JSON.stringify(req.body));
    console.log('[updateProfile] User ID from token:', req.user._id);

    const user = await User.findById(req.user._id);
    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    // ✅ FIX: Use explicit hasOwnProperty checks instead of `|| user.field`
    // The old `req.body.phone || user.phone` pattern silently discards empty-string
    // updates (clearing a field), causing the save to be a no-op while still
    // returning success — the root cause of the "success but not persisted" bug.
    const body = req.body;

    if (body.name !== undefined && body.name !== '') user.name = body.name;
    if (body.email !== undefined && body.email !== '') user.email = body.email;
    if (Object.prototype.hasOwnProperty.call(body, 'phone')) user.phone = body.phone;
    if (Object.prototype.hasOwnProperty.call(body, 'company')) user.company = body.company;

    console.log('[updateProfile] Document to be saved:', { name: user.name, email: user.email, phone: user.phone, company: user.company });

    const updatedUser = await user.save();

    console.log('[updateProfile] MongoDB save result — updated _id:', updatedUser._id, '| updatedAt:', updatedUser.updatedAt);

    res.json({
        success: true,
        message: 'Profile updated successfully',
        user: updatedUser,
        // Keep backward-compat: also expose as `data` so both response shapes work
        data: updatedUser,
    });
});

// @desc    Change password
// @route   PUT /api/auth/password
// @access  Private
const changePassword = asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id).select('+password');
    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
        res.status(400);
        throw new Error('Current password is incorrect');
    }

    if (!isStrongPassword(newPassword)) {
        res.status(400);
        throw new Error('New password must be at least 8 characters and include uppercase letters and numbers');
    }

    user.password = newPassword;
    await user.save();

    res.json({ success: true, message: 'Password updated successfully' });
});

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = asyncHandler(async (req, res) => {
    if (typeof req.body.email !== 'string') {
        res.status(400);
        throw new Error('Email is required');
    }

    const email = req.body.email.trim().toLowerCase();
    const user = await User.findOne({ email });
    if (!user) {
        res.status(404);
        throw new Error('No account with that email');
    }

    const otp = await generateOtp({ email, purpose: 'password-reset' });
    await safeSend(sendOtpEmail({ email, otp, purpose: 'password reset' }), 'Forgot password OTP');

    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?email=${encodeURIComponent(email)}`;

    res.json({
        success: true,
        message: 'Password reset OTP sent to email',
        resetUrl,
        ...(process.env.NODE_ENV === 'development' && { otp }),
    });
});

// @desc    Reset password
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = asyncHandler(async (req, res) => {
    if (typeof req.body.email !== 'string' || typeof req.body.password !== 'string') {
        res.status(400);
        throw new Error('Email and password are required');
    }

    const email = req.body.email.trim().toLowerCase();
    const otp = req.body.otp || req.params.token;
    const password = req.body.password;

    const isValid = await verifyOtp({ email, otp, purpose: 'password-reset' });

    const user = await User.findOne({ email });

    if (!user) {
        res.status(400);
        throw new Error('Invalid or expired reset request');
    }

    if (!isValid) {
        res.status(400);
        throw new Error('Invalid or expired OTP');
    }

    if (!isStrongPassword(password)) {
        res.status(400);
        throw new Error('Password must be at least 8 characters and include uppercase letters and numbers');
    }

    user.password = password;
    await user.save();

    await invalidateOtps({ email, purpose: 'password-reset' });

    res.json({ success: true, message: 'Password reset successful' });
});

// @desc    Refresh access token
// @route   POST /api/auth/refresh
// @access  Public
const refreshTokenHandler = asyncHandler(async (req, res) => {
    const refreshToken = req.cookies?.refreshToken || req.body.refreshToken;
    if (!refreshToken) {
        res.status(400);
        throw new Error('Refresh token is required');
    }

    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        const user = await User.findById(decoded.id);
        if (!user || !user.isActive) {
            res.status(401);
            throw new Error('Invalid refresh token');
        }
        const accessToken = generateAccessToken(user._id);
        const newRefreshToken = generateRefreshToken(user._id);
        res.cookie('refreshToken', newRefreshToken, {
            ...refreshCookieOptions,
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        res.json({ success: true, accessToken });
    } catch (error) {
        res.status(401);
        throw new Error('Invalid or expired refresh token');
    }
});

module.exports = {
    registerUser,
    loginUser,
    getUserProfile,
    updateProfile,
    changePassword,
    forgotPassword,
    resetPassword,
    refreshTokenHandler,
};
