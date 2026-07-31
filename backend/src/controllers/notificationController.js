const Notification = require('../models/Notification');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Get my notifications
// @route   GET /api/notifications
// @access  Private
const getNotifications = asyncHandler(async (req, res) => {
    const notifications = await Notification.find({ recipient: req.user._id })
        .sort({ createdAt: -1 })
        .limit(50);

    const unreadCount = await Notification.countDocuments({
        recipient: req.user._id,
        isRead: false,
    });

    res.json({ success: true, data: notifications, unreadCount });
});

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
const markAsRead = asyncHandler(async (req, res) => {
    const notification = await Notification.findOne({
        _id: req.params.id,
        recipient: req.user._id,
    });

    if (!notification) {
        res.status(404);
        throw new Error('Notification not found');
    }

    notification.isRead = true;
    await notification.save();

    res.json({ success: true, data: notification });
});

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read-all
// @access  Private
const markAllAsRead = asyncHandler(async (req, res) => {
    await Notification.updateMany(
        { recipient: req.user._id, isRead: false },
        { isRead: true }
    );

    res.json({ success: true, message: 'All notifications marked as read' });
});

// @desc    Send notification (admin to client)
// @route   POST /api/notifications
// @access  Admin
const createNotification = asyncHandler(async (req, res) => {
    const { recipient, title, message, type, link } = req.body;

    const notification = await Notification.create({
        recipient,
        title,
        message,
        type: type || 'general',
        link: link || '',
    });

    res.status(201).json({ success: true, data: notification });
});

// @desc    Delete notification
// @route   DELETE /api/notifications/:id
// @access  Private
const deleteNotification = asyncHandler(async (req, res) => {
    const notification = await Notification.findOne({
        _id: req.params.id,
        recipient: req.user._id,
    });

    if (!notification) {
        res.status(404);
        throw new Error('Notification not found');
    }

    await notification.deleteOne();
    res.json({ success: true, message: 'Notification deleted' });
});

module.exports = {
    getNotifications,
    markAsRead,
    markAllAsRead,
    createNotification,
    deleteNotification,
};
