const Project = require('../models/Project');
const Notification = require('../models/Notification');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Get all projects (admin) or own projects (client)
// @route   GET /api/projects
// @access  Private
const getProjects = asyncHandler(async (req, res) => {
    const { status, client: clientId } = req.query;
    let query = {};

    if (req.user.role === 'client') {
        query.client = req.user._id;
    } else if (clientId) {
        query.client = clientId;
    }

    if (status && status !== 'all') {
        query.status = status;
    }

    const projects = await Project.find(query)
        .populate('client', 'name email company avatar')
        .sort({ createdAt: -1 });

    res.json({ success: true, count: projects.length, data: projects });
});

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Private (ownership check for clients)
const getProjectById = asyncHandler(async (req, res) => {
    const project = await Project.findById(req.params.id)
        .populate('client', 'name email company avatar')
        .populate('notes.createdBy', 'name avatar');

    if (!project) {
        res.status(404);
        throw new Error('Project not found');
    }

    // Clients can only see their own projects
    if (req.user.role === 'client' && project.client._id.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error('Not authorized to view this project');
    }

    res.json({ success: true, data: project });
});

// @desc    Create project
// @route   POST /api/projects
// @access  Admin
const createProject = asyncHandler(async (req, res) => {
    const { title, description, client, service, startDate, estimatedEndDate, milestones, quotation } = req.body;

    const project = await Project.create({
        title,
        description,
        client,
        service,
        startDate,
        estimatedEndDate,
        milestones: milestones || [],
        quotation: quotation || {},
    });

    const populated = await project.populate('client', 'name email company');

    // Notify client
    await Notification.create({
        recipient: client,
        title: 'New Project Created',
        message: `A new project "${title}" has been assigned to you.`,
        type: 'project_update',
        link: `/dashboard/projects/${project._id}`,
    });

    res.status(201).json({ success: true, data: populated });
});

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Admin
const updateProject = asyncHandler(async (req, res) => {
    const project = await Project.findById(req.params.id);
    if (!project) {
        res.status(404);
        throw new Error('Project not found');
    }

    const { title, description, service, status, progress, startDate, estimatedEndDate, quotation } = req.body;

    if (title) project.title = title;
    if (description !== undefined) project.description = description;
    if (service) project.service = service;
    if (startDate) project.startDate = startDate;
    if (estimatedEndDate) project.estimatedEndDate = estimatedEndDate;
    if (quotation) project.quotation = { ...project.quotation?.toObject?.() || {}, ...quotation };

    if (status && status !== project.status) {
        project.status = status;
        if (status === 'completed') {
            project.completedDate = new Date();
            project.progress = 100;
        }
        // Notify client of status change
        await Notification.create({
            recipient: project.client,
            title: 'Project Status Updated',
            message: `Your project "${project.title}" is now "${status}".`,
            type: 'project_update',
            link: `/dashboard/projects/${project._id}`,
        });
    }

    if (progress !== undefined) project.progress = progress;

    const updated = await project.save();
    const populated = await updated.populate('client', 'name email company');

    res.json({ success: true, data: populated });
});

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Admin
const deleteProject = asyncHandler(async (req, res) => {
    const project = await Project.findById(req.params.id);
    if (!project) {
        res.status(404);
        throw new Error('Project not found');
    }

    await project.deleteOne();
    res.json({ success: true, message: 'Project deleted' });
});

// @desc    Update milestones
// @route   PUT /api/projects/:id/milestones
// @access  Admin
const updateMilestones = asyncHandler(async (req, res) => {
    const project = await Project.findById(req.params.id);
    if (!project) {
        res.status(404);
        throw new Error('Project not found');
    }

    project.milestones = req.body.milestones;
    const updated = await project.save();

    // Notify client
    await Notification.create({
        recipient: project.client,
        title: 'Milestones Updated',
        message: `Milestones for "${project.title}" have been updated.`,
        type: 'project_update',
        link: `/dashboard/projects/${project._id}`,
    });

    res.json({ success: true, data: updated });
});

// @desc    Add deliverable (admin uploads)
// @route   POST /api/projects/:id/deliverables
// @access  Admin
const addDeliverable = asyncHandler(async (req, res) => {
    const project = await Project.findById(req.params.id);
    if (!project) {
        res.status(404);
        throw new Error('Project not found');
    }

    const { name, fileUrl, fileType, fileSize, cloudinaryId } = req.body;

    project.deliverables.push({
        name,
        fileUrl,
        fileType,
        fileSize,
        cloudinaryId,
    });

    const updated = await project.save();

    // Notify client
    await Notification.create({
        recipient: project.client,
        title: 'New Deliverable Available',
        message: `A new file "${name}" has been uploaded to your project "${project.title}".`,
        type: 'project_update',
        link: `/dashboard/projects/${project._id}`,
    });

    res.json({ success: true, data: updated });
});

// @desc    Remove deliverable
// @route   DELETE /api/projects/:id/deliverables/:deliverableId
// @access  Admin
const removeDeliverable = asyncHandler(async (req, res) => {
    const project = await Project.findById(req.params.id);
    if (!project) {
        res.status(404);
        throw new Error('Project not found');
    }

    project.deliverables = project.deliverables.filter(
        (d) => d._id.toString() !== req.params.deliverableId
    );

    const updated = await project.save();
    res.json({ success: true, data: updated });
});

// @desc    Add note to project
// @route   POST /api/projects/:id/notes
// @access  Admin
const addNote = asyncHandler(async (req, res) => {
    const project = await Project.findById(req.params.id);
    if (!project) {
        res.status(404);
        throw new Error('Project not found');
    }

    project.notes.push({
        content: req.body.content,
        createdBy: req.user._id,
    });

    const updated = await project.save();
    const populated = await updated.populate('notes.createdBy', 'name avatar');

    res.json({ success: true, data: populated });
});

module.exports = {
    getProjects,
    getProjectById,
    createProject,
    updateProject,
    deleteProject,
    updateMilestones,
    addDeliverable,
    removeDeliverable,
    addNote,
};
