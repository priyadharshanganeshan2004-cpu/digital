const User = require('../models/User');
const Project = require('../models/Project');
const Invoice = require('../models/Invoice');
const asyncHandler = require('../middleware/asyncHandler');
const crypto = require('crypto');
const { sendClientCredentialsEmail } = require('../services/emailService');

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

    if (typeof name !== 'string' || typeof email !== 'string') {
        res.status(400);
        throw new Error('Name and email are required');
    }

    const normalizedEmail = email.trim().toLowerCase();

    const userExists = await User.findOne({ email: normalizedEmail });
    if (userExists) {
        res.status(400);
        throw new Error('User with this email already exists');
    }

    // Generate a temporary password
    const tempPassword = crypto.randomBytes(8).toString('hex');

    const client = await User.create({
        name: name.trim(),
        email: normalizedEmail,
        phone,
        company,
        password: tempPassword,
        role: 'client',
        mustResetPassword: true,
    });

    await sendClientCredentialsEmail({ user: client, tempPassword }).catch((error) => {
        console.error('Client credentials email failed:', error.message);
    });

    res.status(201).json({
        success: true,
        data: client,
        ...(process.env.NODE_ENV === 'development' && { tempPassword }),
    });
});

// @desc    Update client
// @route   PUT /api/admin/clients/:id
// @access  Admin
const updateClient = asyncHandler(async (req, res) => {
    console.log('[updateClient] Incoming request body:', JSON.stringify(req.body));
    console.log('[updateClient] Client ID:', req.params.id);

    const client = await User.findOne({ _id: req.params.id, role: 'client' });
    if (!client) {
        res.status(404);
        throw new Error('Client not found');
    }

    const body = req.body;

    // ✅ FIX: Use explicit checks so empty strings are treated as intentional clears
    if (body.name !== undefined && body.name !== '') client.name = body.name;
    if (body.email !== undefined && body.email !== '') client.email = body.email;
    if (Object.prototype.hasOwnProperty.call(body, 'phone')) client.phone = body.phone;
    if (Object.prototype.hasOwnProperty.call(body, 'company')) client.company = body.company;
    if (typeof body.isActive === 'boolean') client.isActive = body.isActive;

    console.log('[updateClient] Document to be saved:', { name: client.name, email: client.email, phone: client.phone, company: client.company });

    const updated = await client.save();

    console.log('[updateClient] MongoDB save result — updated _id:', updated._id, '| updatedAt:', updated.updatedAt);

    res.json({
        success: true,
        message: 'Profile updated successfully',
        user: updated,
        data: updated,
    });
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
