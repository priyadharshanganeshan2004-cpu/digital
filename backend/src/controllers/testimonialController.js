const Testimonial = require('../models/Testimonial');
const asyncHandler = require('../middleware/asyncHandler');

// ─────────────────────────────────────────────────────────────────────────────
// PUBLIC — GET /api/testimonials/active
// Returns only active testimonials, sorted by display order.
// No auth required. Cache headers prevent CDN/browser stale reads.
// ─────────────────────────────────────────────────────────────────────────────
const getActiveTestimonials = asyncHandler(async (req, res) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Surrogate-Control', 'no-store');

    const testimonials = await Testimonial.find({ isActive: true }).sort({ order: 1, createdAt: 1 });
    res.json({ success: true, count: testimonials.length, data: testimonials });
});

// ─────────────────────────────────────────────────────────────────────────────
// ADMIN — GET /api/admin/testimonials
// Returns ALL testimonials (active + inactive) for the admin dashboard.
// ─────────────────────────────────────────────────────────────────────────────
const getAllTestimonials = asyncHandler(async (req, res) => {
    const testimonials = await Testimonial.find().sort({ order: 1, createdAt: 1 });
    res.json({ success: true, count: testimonials.length, data: testimonials });
});

// ─────────────────────────────────────────────────────────────────────────────
// ADMIN — POST /api/admin/testimonials
// ─────────────────────────────────────────────────────────────────────────────
const createTestimonial = asyncHandler(async (req, res) => {
    const { name, role, company, message, rating, avatar, isActive, order } = req.body;

    if (!name || !role || !company || !message) {
        res.status(400);
        throw new Error('Name, role, company, and message are required');
    }

    const parsedRating = Number(rating);
    if (isNaN(parsedRating) || parsedRating < 1 || parsedRating > 5) {
        res.status(400);
        throw new Error('Rating must be a number between 1 and 5');
    }

    const testimonial = await Testimonial.create({
        name: name.trim(),
        role: role.trim(),
        company: company.trim(),
        message: message.trim(),
        rating: parsedRating,
        avatar: (avatar || '').trim(),
        isActive: isActive !== false,
        order: order != null ? Number(order) : 0,
    });

    res.status(201).json({ success: true, data: testimonial, message: 'Testimonial created successfully' });
});

// ─────────────────────────────────────────────────────────────────────────────
// ADMIN — PUT /api/admin/testimonials/:id
// ─────────────────────────────────────────────────────────────────────────────
const updateTestimonial = asyncHandler(async (req, res) => {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) {
        res.status(404);
        throw new Error('Testimonial not found');
    }

    const { name, role, company, message, rating, avatar, isActive, order } = req.body;

    if (rating !== undefined) {
        const parsedRating = Number(rating);
        if (isNaN(parsedRating) || parsedRating < 1 || parsedRating > 5) {
            res.status(400);
            throw new Error('Rating must be a number between 1 and 5');
        }
        testimonial.rating = parsedRating;
    }

    if (name !== undefined) testimonial.name = name.trim();
    if (role !== undefined) testimonial.role = role.trim();
    if (company !== undefined) testimonial.company = company.trim();
    if (message !== undefined) testimonial.message = message.trim();
    if (avatar !== undefined) testimonial.avatar = (avatar || '').trim();
    if (isActive !== undefined) testimonial.isActive = Boolean(isActive);
    if (order !== undefined) testimonial.order = Number(order);

    const updated = await testimonial.save();
    res.json({ success: true, data: updated, message: 'Testimonial updated successfully' });
});

// ─────────────────────────────────────────────────────────────────────────────
// ADMIN — DELETE /api/admin/testimonials/:id
// ─────────────────────────────────────────────────────────────────────────────
const deleteTestimonial = asyncHandler(async (req, res) => {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) {
        res.status(404);
        throw new Error('Testimonial not found');
    }

    await testimonial.deleteOne();
    res.json({ success: true, message: 'Testimonial deleted successfully' });
});

module.exports = {
    getActiveTestimonials,
    getAllTestimonials,
    createTestimonial,
    updateTestimonial,
    deleteTestimonial,
};
