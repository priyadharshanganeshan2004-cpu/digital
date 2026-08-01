const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    shortDesc: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    icon: { type: String, default: 'HiCode' },
    color: { type: String, default: '#6366f1' },
    featured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Service', serviceSchema);
