const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please provide a name'],
            trim: true,
        },
        company: {
            type: String,
            trim: true,
        },
        email: {
            type: String,
            required: [true, 'Please provide an email address'],
            match: [
                /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                'Please add a valid email',
            ],
            trim: true,
        },
        phone: {
            type: String,
            trim: true,
        },
        service: {
            type: String,
            required: [true, 'Please specify the service you are interested in'],
        },
        budget: {
            type: String,
        },
        message: {
            type: String,
            required: [true, 'Please provide a message detailing your request'],
        },
        status: {
            type: String,
            enum: ['new', 'contacted', 'qualified', 'proposal', 'closed'],
            default: 'new',
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Lead', leadSchema);
