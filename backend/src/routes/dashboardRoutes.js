const express = require('express');
const { protect, authorize } = require('../middleware/authMiddleware');
const { getAdminStats, getClientStats, getAdminAnalytics } = require('../controllers/dashboardController');

const router = express.Router();

router.get('/admin', protect, authorize('admin'), getAdminStats);
router.get('/admin/analytics', protect, authorize('admin'), getAdminAnalytics);
router.get('/client', protect, authorize('client'), getClientStats);

module.exports = router;
