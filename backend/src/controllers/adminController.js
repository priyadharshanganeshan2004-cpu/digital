const User = require('../models/User');
const Project = require('../models/Project');
const Invoice = require('../models/Invoice');
const asyncHandler = require('../middleware/asyncHandler');
const crypto = require('crypto');

// @desc    Get all clients
// @route   GET /api/admin/clients
// @access  Admin
const getClients = asyncHandler(async (req, res) => {
    const { search, status } = req.query;
    const query = { role: 'client' };

    if (search) {
        query.$or = [
            { name: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
            { company: { $regex: search, $options: 'i' } },
        ];
    }
    if (status === 'active') query.isActive = true;
    if (status === 'inactive') query.isActive = false;

    const clients = await User.find(query).sort({ createdAt: -1 });

    // Attach project count per client
    const clientsWithStats = await Promise.all(
        clients.map(async (client) => {
            const projectCount = await Project.countDocuments({ client: client._id });
            const invoiceTotal = await Invoice.aggregate([
                { $match: { client: client._id, status: 'paid' } },
                { $group: { _id: null, total: { $sum: '$total' } } },
            ]);
            return {
                ...client.toJSON(),
                projectCount,
                totalPaid: invoiceTotal[0]?.total || 0,
            };
        })
    );

    res.json({ success: true, count: clientsWithStats.length, data: clientsWithStats });
});

// @desc    Get single client
// @route   GET /api/admin/clients/:id
// @access  Admin
const getClientById = asyncHandler(async (req, res) => {
    const client = await User.findOne({ _id: req.params.id, role: 'client' });
    if (!client) {
        res.status(404);
        throw new Error('Client not found');
    }

    const projects = await Project.find({ client: client._id }).sort({ createdAt: -1 });
    const invoices = await Invoice.find({ client: client._id }).sort({ createdAt: -1 });

    res.json({
        success: true,
        data: { ...client.toJSON(), projects, invoices },
    });
});

// @desc    Create client account
// @route   POST /api/admin/clients
// @access  Admin
const createClient = asyncHandler(async (req, res) => {
    const { name, email, phone, company } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
        res.status(400);
        throw new Error('User with this email already exists');
    }

    // Generate a temporary password
    const tempPassword = crypto.randomBytes(8).toString('hex');

    const client = await User.create({
        name,
        email,
        phone,
        company,
        password: tempPassword,
        role: 'client',
    });

    // In production, send welcome email with temp password
    res.status(201).json({
        success: true,
        data: client,
        // Dev only — remove in production
        ...(process.env.NODE_ENV === 'development' && { tempPassword }),
    });
});

// @desc    Update client
// @route   PUT /api/admin/clients/:id
// @access  Admin
const updateClient = asyncHandler(async (req, res) => {
    const client = await User.findOne({ _id: req.params.id, role: 'client' });
    if (!client) {
        res.status(404);
        throw new Error('Client not found');
    }

    const { name, email, phone, company, isActive } = req.body;
    if (name) client.name = name;
    if (email) client.email = email;
    if (phone !== undefined) client.phone = phone;
    if (company !== undefined) client.company = company;
    if (typeof isActive === 'boolean') client.isActive = isActive;

    const updated = await client.save();
    res.json({ success: true, data: updated });
});

// @desc    Delete (deactivate) client
// @route   DELETE /api/admin/clients/:id
// @access  Admin
const deleteClient = asyncHandler(async (req, res) => {
    const client = await User.findOne({ _id: req.params.id, role: 'client' });
    if (!client) {
        res.status(404);
        throw new Error('Client not found');
    }

    client.isActive = false;
    await client.save();

    res.json({ success: true, message: 'Client account deactivated' });
});

module.exports = {
    getClients,
    getClientById,
    createClient,
    updateClient,
    deleteClient,
};
