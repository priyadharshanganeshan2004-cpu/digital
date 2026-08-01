const mongoose = require('mongoose');

const portfolioItemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    category: { type: String, default: 'Website', trim: true },
    description: { type: String, default: '', trim: true },
    results: { type: [String], default: [] },
    color: { type: String, default: 'from-blue-500 to-indigo-600' },
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('PortfolioItem', portfolioItemSchema);
