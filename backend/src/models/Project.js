const mongoose = require('mongoose');

const milestoneSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    status: {
        type: String,
        enum: ['pending', 'completed'],
        default: 'pending',
    },
    dueDate: Date,
    completedDate: Date,
});

const deliverableSchema = new mongoose.Schema({
    name: { type: String, required: true },
    fileUrl: { type: String, required: true },
    fileType: { type: String },
    fileSize: { type: Number },
    cloudinaryId: { type: String },
    uploadedAt: { type: Date, default: Date.now },
});

const noteSchema = new mongoose.Schema({
    content: { type: String, required: true },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    createdAt: { type: Date, default: Date.now },
});

const projectSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Please add a project title'],
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
        client: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Please assign a client'],
        },
        service: {
            type: String,
            required: [true, 'Please specify the service'],
        },
        status: {
            type: String,
            enum: ['pending', 'in-progress', 'review', 'completed'],
            default: 'pending',
        },
        progress: {
            type: Number,
            min: 0,
            max: 100,
            default: 0,
        },
        startDate: Date,
        estimatedEndDate: Date,
        completedDate: Date,
        milestones: [milestoneSchema],
        deliverables: [deliverableSchema],
        quotation: {
            amount: Number,
            description: String,
            status: {
                type: String,
                enum: ['draft', 'sent', 'approved', 'rejected'],
                default: 'draft',
            },
            sentAt: Date,
            respondedAt: Date,
        },
        notes: [noteSchema],
    },
    {
        timestamps: true,
    }
);

// Index for fast client lookups
projectSchema.index({ client: 1, status: 1 });

module.exports = mongoose.model('Project', projectSchema);
