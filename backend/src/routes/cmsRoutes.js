const express = require('express');
const { getSiteSettingsPublic, getServicesPublic, getPricingPlansPublic, getTeamMembersPublic } = require('../controllers/cmsController');
const { getPortfolioItemsPublic, getBlogPostsPublic, getBlogPostBySlug } = require('../controllers/contentController');
const { getActiveTestimonials } = require('../controllers/testimonialController');

const router = express.Router();

router.get('/settings', getSiteSettingsPublic);
router.get('/services', getServicesPublic);
router.get('/pricing', getPricingPlansPublic);
router.get('/portfolio', getPortfolioItemsPublic);
router.get('/blog', getBlogPostsPublic);
router.get('/blog/:slug', getBlogPostBySlug);
router.get('/team', getTeamMembersPublic);
router.get('/testimonials', getActiveTestimonials);

module.exports = router;
