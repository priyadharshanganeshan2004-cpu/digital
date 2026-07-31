const Message = require('../models/Message');
const Notification = require('../models/Notification');
const User = require('../models/User');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Get conversations (unique threads)
// @route   GET /api/messages
// @access  Private
const getConversations = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    // Find all unique conversation partners
    const messages = await Message.aggregate([
        {
            $match: {
                $or: [{ sender: userId }, { recipient: userId }],
            },
        },
        { $sort: { createdAt: -1 } },
        {
            $group: {
                _id: {
                    $cond: [{ $eq: ['$sender', userId] }, '$recipient', '$sender'],
                },
                lastMessage: { $first: '$content' },
                lastMessageDate: { $first: '$createdAt' },
                unreadCount: {
                    $sum: {
                        $cond: [
                            { $and: [{ $eq: ['$recipient', userId] }, { $eq: ['$isRead', false] }] },
                            1,
                            0,
                        ],
                    },
                },
            },
        },
        { $sort: { lastMessageDate: -1 } },
    ]);

    // Populate user details
    const conversations = await User.populate(messages, {
        path: '_id',
        select: 'name email company avatar',
    });

    const formatted = conversations.map((conv) => ({
        user: conv._id,
        lastMessage: conv.lastMessage,
        lastMessageDate: conv.lastMessageDate,
        unreadCount: conv.unreadCount,
    }));

    res.json({ success: true, data: formatted });
});

// @desc    Get messages with a specific user
// @route   GET /api/messages/:userId
// @access  Private
const getMessages = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const otherUserId = req.params.userId;

    // Clients can only message admins
    if (req.user.role === 'client') {
        const otherUser = await User.findById(otherUserId);
        if (!otherUser || otherUser.role !== 'admin') {
            res.status(403);
            throw new Error('Clients can only message administrators');
        }
    }

    const messages = await Message.find({
        $or: [
            { sender: userId, recipient: otherUserId },
            { sender: otherUserId, recipient: userId },
        ],
    })
        .populate('sender', 'name avatar role')
        .populate('recipient', 'name avatar role')
        .populate('project', 'title')
        .sort({ createdAt: 1 });

    // Mark messages as read
    await Message.updateMany(
        { sender: otherUserId, recipient: userId, isRead: false },
        { isRead: true }
    );

    res.json({ success: true, data: messages });
});

// @desc    Send message
// @route   POST /api/messages
// @access  Private
const sendMessage = asyncHandler(async (req, res) => {
    const { recipient, content, subject, project } = req.body;

    // Clients can only message admins
    if (req.user.role === 'client') {
        const recipientUser = await User.findById(recipient);
        if (!recipientUser || recipientUser.role !== 'admin') {
            res.status(403);
            throw new Error('Clients can only message administrators');
        }
    }

    const message = await Message.create({
        sender: req.user._id,
        recipient,
        content,
        subject,
        project,
    });

    // Create notification for recipient
    await Notification.create({
        recipient,
        title: 'New Message',
        message: `${req.user.name} sent you a message.`,
        type: 'message',
        link: req.user.role === 'admin' ? `/dashboard/messages` : `/admin/messages`,
    });

    const populated = await message.populate([
        { path: 'sender', select: 'name avatar role' },
        { path: 'recipient', select: 'name avatar role' },
    ]);

    res.status(201).json({ success: true, data: populated });
});

module.exports = {
    getConversations,
    getMessages,
    sendMessage,
};
