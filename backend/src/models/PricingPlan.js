const mongoose = require('mongoose');

const pricingPlanSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    price: { type: String, required: true },
    period: { type: String, default: '/month' },
    description: { type: String, default: '' },
    features: { type: [String], default: [] },
    ctaText: { type: String, default: 'Get Started' },
    isPopular: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('PricingPlan', pricingPlanSchema);
