const mongoose = require('mongoose');

const teamMemberSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        role: { type: String, required: true },
        initials: { type: String, required: true, maxlength: 3 },
        sortOrder: { type: Number, default: 0 },
    },
    { timestamps: true }
);

module.exports = mongoose.model('TeamMember', teamMemberSchema);
