const express = require('express');
const { protect, authorize } = require('../middleware/authMiddleware');
const {
    getNotifications,
    markAsRead,
    markAllAsRead,
    createNotification,
    deleteNotification,
} = require('../controllers/notificationController');

const router = express.Router();

router.use(protect);

router.route('/')
    .get(getNotifications)
    .post(authorize('admin'), createNotification);

router.put('/read-all', markAllAsRead);
router.put('/:id/read', markAsRead);
router.delete('/:id', deleteNotification);

module.exports = router;
