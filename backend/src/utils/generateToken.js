const jwt = require('jsonwebtoken');

// Generate Access Token (15 mins)
const generateAccessToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '15m',
    });
};

// Generate Refresh Token (7 days)
const generateRefreshToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, {
        expiresIn: '7d',
    });
};

module.exports = { generateAccessToken, generateRefreshToken };
