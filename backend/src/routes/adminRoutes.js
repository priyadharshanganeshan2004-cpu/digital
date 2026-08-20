const express = require('express');
const { protect, authorize } = require('../middleware/authMiddleware');
const {
    getClients,
    getClientById,
    createClient,
    updateClient,
    deleteClient,
} = require('../controllers/adminController');
const {
    getSiteSettings,
    updateSiteSettings,
    getServices,
    getServiceById,
    createService,
    updateService,
    deleteService,
    getPricingPlans,
    getPricingPlanById,
    createPricingPlan,
    updatePricingPlan,
    deletePricingPlan,
    getTeamMembers,
    getTeamMemberById,
    createTeamMember,
    updateTeamMember,
    deleteTeamMember,
} = require('../controllers/cmsController');
const {
    getPortfolioItems,
    getPortfolioItemById,
    createPortfolioItem,
    updatePortfolioItem,
    deletePortfolioItem,
    getBlogPosts,
    getBlogPostById,
    createBlogPost,
    updateBlogPost,
    deleteBlogPost,
} = require('../controllers/contentController');

const {
    getAllTestimonials,
    createTestimonial,
    updateTestimonial,
    deleteTestimonial,
} = require('../controllers/testimonialController');

const router = express.Router();

// All routes require admin authentication
router.use(protect, authorize('admin'));

router.route('/settings')
    .get(getSiteSettings)
    .put(updateSiteSettings);

router.route('/services')
    .get(getServices)
    .post(createService);

router.route('/services/:id')
    .get(getServiceById)
    .put(updateService)
    .delete(deleteService);

router.route('/pricing')
    .get(getPricingPlans)
    .post(createPricingPlan);

router.route('/pricing/:id')
    .get(getPricingPlanById)
    .put(updatePricingPlan)
    .delete(deletePricingPlan);

router.route('/portfolio')
    .get(getPortfolioItems)
    .post(createPortfolioItem);

router.route('/portfolio/:id')
    .get(getPortfolioItemById)
    .put(updatePortfolioItem)
    .delete(deletePortfolioItem);

router.route('/blog')
    .get(getBlogPosts)
    .post(createBlogPost);

router.route('/blog/:id')
    .get(getBlogPostById)
    .put(updateBlogPost)
    .delete(deleteBlogPost);

router.route('/clients')
    .get(getClients)
    .post(createClient);

router.route('/clients/:id')
    .get(getClientById)
    .put(updateClient)
    .delete(deleteClient);

router.route('/team')
    .get(getTeamMembers)
    .post(createTeamMember);

router.route('/team/:id')
    .get(getTeamMemberById)
    .put(updateTeamMember)
    .delete(deleteTeamMember);

router.route('/testimonials')
    .get(getAllTestimonials)
    .post(createTestimonial);

router.route('/testimonials/:id')
    .put(updateTestimonial)
    .delete(deleteTestimonial);

module.exports = router;
