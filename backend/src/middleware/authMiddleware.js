const jwt = require('jsonwebtoken');

const asyncHandler = require('./asyncHandler');
const User = require('../models/User');

// Protect routes
const protect = asyncHandler(async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        res.status(401);
        throw new Error('Not authorized, no token');
    }

    // Verify token OUTSIDE of try/catch that wraps next().
    // Previously, next() was called inside the try block, which meant any error
    // thrown by the downstream controller was caught HERE and re-thrown as a
    // misleading "Not authorized, token failed" — and in some Express versions
    // caused a "next is not a function" crash due to double-next invocation.
    let decoded;
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        res.status(401);
        throw new Error('Not authorized, token failed');
    }

    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
        res.status(401);
        throw new Error('User no longer exists');
    }

    // ✅ next() is now called exactly once, outside any try/catch block
    next();
});

// Grant access to specific roles
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            res.status(403);
            throw new Error(`User role ${req.user.role} is not authorized to access this route`);
        }
        next();
    };
};

module.exports = { protect, authorize };
