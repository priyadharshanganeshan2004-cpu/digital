const express = require('express');
const { getSiteSettingsPublic, getServicesPublic, getPricingPlansPublic } = require('../controllers/cmsController');
const { getPortfolioItems, getBlogPosts, getBlogPostBySlug } = require('../controllers/contentController');

const router = express.Router();

router.get('/settings', getSiteSettingsPublic);
router.get('/services', getServicesPublic);
router.get('/pricing', getPricingPlansPublic);
router.get('/portfolio', getPortfolioItems);
router.get('/blog', getBlogPosts);
router.get('/blog/:slug', getBlogPostBySlug);

module.exports = router;
