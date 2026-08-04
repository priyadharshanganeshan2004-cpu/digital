const User = require('../models/User');
const Project = require('../models/Project');
const Invoice = require('../models/Invoice');
const Lead = require('../models/Lead');
const Notification = require('../models/Notification');
const Message = require('../models/Message');
const asyncHandler = require('../middleware/asyncHandler');

const buildMonthlyBuckets = (range = 12) => {
    const buckets = [];
    const end = new Date();
    end.setDate(1);
    end.setHours(0, 0, 0, 0);

    for (let i = range - 1; i >= 0; i -= 1) {
        const date = new Date(end);
        date.setMonth(end.getMonth() - i);
        buckets.push({
            key: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`,
            label: date.toLocaleString('en-US', { month: 'short' }),
            year: date.getFullYear(),
            month: date.getMonth() + 1,
            revenue: 0,
            leads: 0,
            invoices: 0,
        });
    }

    return buckets;
};

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

// @desc    Get admin analytics timeline
// @route   GET /api/dashboard/admin/analytics
// @access  Admin
const getAdminAnalytics = asyncHandler(async (req, res) => {
    const range = Math.min(Math.max(parseInt(req.query.range, 10) || 12, 1), 24);
    const buckets = buildMonthlyBuckets(range);
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - (range - 1), 1);
    startDate.setHours(0, 0, 0, 0);

    const [revenueByMonth, leadsByMonth] = await Promise.all([
        Invoice.aggregate([
            { $match: { status: 'paid', createdAt: { $gte: startDate } } },
            {
                $group: {
                    _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
                    revenue: { $sum: '$total' },
                    invoices: { $sum: 1 },
                },
            },
        ]),
        Lead.aggregate([
            { $match: { createdAt: { $gte: startDate } } },
            {
                $group: {
                    _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
                    leads: { $sum: 1 },
                },
            },
        ]),
    ]);

    const bucketMap = new Map(buckets.map((bucket) => [bucket.key, bucket]));

    revenueByMonth.forEach((item) => {
        const key = `${item._id.year}-${String(item._id.month).padStart(2, '0')}`;
        const bucket = bucketMap.get(key);
        if (bucket) {
            bucket.revenue = item.revenue || 0;
            bucket.invoices = item.invoices || 0;
        }
    });

    leadsByMonth.forEach((item) => {
        const key = `${item._id.year}-${String(item._id.month).padStart(2, '0')}`;
        const bucket = bucketMap.get(key);
        if (bucket) {
            bucket.leads = item.leads || 0;
        }
    });

    const totals = buckets.reduce((acc, bucket) => {
        acc.revenue += bucket.revenue;
        acc.leads += bucket.leads;
        acc.invoices += bucket.invoices;
        return acc;
    }, { revenue: 0, leads: 0, invoices: 0 });

    res.json({
        success: true,
        data: {
            range,
            timeline: buckets.map(({ key, ...bucket }) => bucket),
            totals,
        },
    });
});

module.exports = { getAdminStats, getClientStats, getAdminAnalytics };
