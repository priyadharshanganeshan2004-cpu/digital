const express = require('express');
const { protect, authorize } = require('../middleware/authMiddleware');
const {
    getClients,
    getClientById,
    createClient,
    updateClient,
    deleteClient,
} = require('../controllers/adminController');

const router = express.Router();

// All routes require admin authentication
router.use(protect, authorize('admin'));

router.route('/clients')
    .get(getClients)
    .post(createClient);

router.route('/clients/:id')
    .get(getClientById)
    .put(updateClient)
    .delete(deleteClient);

module.exports = router;
