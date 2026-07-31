const User = require('../models/User');
const Project = require('../models/Project');
const Invoice = require('../models/Invoice');
const Lead = require('../models/Lead');
const Notification = require('../models/Notification');
const Message = require('../models/Message');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Get admin dashboard stats
// @route   GET /api/dashboard/admin
// @access  Admin
const getAdminStats = asyncHandler(async (req, res) => {
    const [
        totalClients,
        activeClients,
        totalProjects,
        activeProjects,
        totalLeads,
        newLeads,
        totalRevenue,
        pendingRevenue,
        recentLeads,
        recentProjects,
    ] = await Promise.all([
        User.countDocuments({ role: 'client' }),
        User.countDocuments({ role: 'client', isActive: true }),
        Project.countDocuments(),
        Project.countDocuments({ status: { $in: ['pending', 'in-progress', 'review'] } }),
        Lead.countDocuments(),
        Lead.countDocuments({ status: 'new' }),
        Invoice.aggregate([
            { $match: { status: 'paid' } },
            { $group: { _id: null, total: { $sum: '$total' } } },
        ]),
        Invoice.aggregate([
            { $match: { status: { $in: ['sent', 'overdue'] } } },
            { $group: { _id: null, total: { $sum: '$total' } } },
        ]),
        Lead.find().sort({ createdAt: -1 }).limit(5),
        Project.find()
            .populate('client', 'name email company')
            .sort({ createdAt: -1 })
            .limit(5),
    ]);

    res.json({
        success: true,
        data: {
            totalClients,
            activeClients,
            totalProjects,
            activeProjects,
            totalLeads,
            newLeads,
            totalRevenue: totalRevenue[0]?.total || 0,
            pendingRevenue: pendingRevenue[0]?.total || 0,
            recentLeads,
            recentProjects,
        },
    });
});

// @desc    Get client dashboard stats
// @route   GET /api/dashboard/client
// @access  Client
const getClientStats = asyncHandler(async (req, res) => {
    const clientId = req.user._id;

    const [
        totalProjects,
        activeProjects,
        completedProjects,
        pendingInvoices,
        totalPaid,
        unreadMessages,
        unreadNotifications,
        recentProjects,
        recentNotifications,
    ] = await Promise.all([
        Project.countDocuments({ client: clientId }),
        Project.countDocuments({ client: clientId, status: { $in: ['pending', 'in-progress', 'review'] } }),
        Project.countDocuments({ client: clientId, status: 'completed' }),
        Invoice.aggregate([
            { $match: { client: clientId, status: { $in: ['sent', 'overdue'] } } },
            { $group: { _id: null, total: { $sum: '$total' } } },
        ]),
        Invoice.aggregate([
            { $match: { client: clientId, status: 'paid' } },
            { $group: { _id: null, total: { $sum: '$total' } } },
        ]),
        Message.countDocuments({ recipient: clientId, isRead: false }),
        Notification.countDocuments({ recipient: clientId, isRead: false }),
        Project.find({ client: clientId }).sort({ updatedAt: -1 }).limit(3),
        Notification.find({ recipient: clientId }).sort({ createdAt: -1 }).limit(5),
    ]);

    res.json({
        success: true,
        data: {
            totalProjects,
            activeProjects,
            completedProjects,
            pendingInvoices: pendingInvoices[0]?.total || 0,
            totalPaid: totalPaid[0]?.total || 0,
            unreadMessages,
            unreadNotifications,
            recentProjects,
            recentNotifications,
        },
    });
});

module.exports = { getAdminStats, getClientStats };
