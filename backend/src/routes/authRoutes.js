const express = require('express');
const {
    registerUser,
    loginUser,
    getUserProfile,
    updateProfile,
    changePassword,
    forgotPassword,
    resetPassword,
    refreshTokenHandler,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/refresh', refreshTokenHandler);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

router.get('/me', protect, getUserProfile);
router.put('/profile', protect, updateProfile);
router.put('/password', protect, changePassword);

module.exports = router;
