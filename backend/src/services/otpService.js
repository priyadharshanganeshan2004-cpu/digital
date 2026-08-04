const crypto = require('crypto');
const Otp = require('../models/Otp');

const OTP_TTL_MINUTES = 10;

const hashOtp = (otp) => crypto.createHash('sha256').update(String(otp)).digest('hex');

const generateOtp = async ({ email, purpose = 'password-reset' }) => {
    const otp = String(crypto.randomInt(100000, 999999));
    const expiresAt = new Date(Date.now() + OTP_TTL_MINUTES * 60 * 1000);

    await Otp.create({
        email: email.trim().toLowerCase(),
        otpHash: hashOtp(otp),
        purpose,
        expiresAt,
    });

    return otp;
};

const verifyOtp = async ({ email, otp, purpose = 'password-reset' }) => {
    const normalizedEmail = email.trim().toLowerCase();
    const otpRecord = await Otp.findOne({
        email: normalizedEmail,
        purpose,
        usedAt: { $exists: false },
        expiresAt: { $gt: new Date() },
    }).sort({ createdAt: -1 });

    if (!otpRecord) {
        return false;
    }

    const isMatch = otpRecord.otpHash === hashOtp(otp);
    otpRecord.attempts += 1;

    if (!isMatch) {
        await otpRecord.save();
        return false;
    }

    otpRecord.usedAt = new Date();
    await otpRecord.save();
    return true;
};

const invalidateOtps = async ({ email, purpose = 'password-reset' }) => {
    await Otp.updateMany(
        { email: email.trim().toLowerCase(), purpose, usedAt: { $exists: false } },
        { usedAt: new Date() }
    );
};

module.exports = {
    generateOtp,
    verifyOtp,
    invalidateOtps,
};