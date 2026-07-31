const express = require('express');
const { protect, authorize } = require('../middleware/authMiddleware');
const {
    getInvoices,
    getInvoiceById,
    createInvoice,
    updateInvoice,
    recordPayment,
} = require('../controllers/invoiceController');

const router = express.Router();

router.use(protect);

router.route('/')
    .get(getInvoices)
    .post(authorize('admin'), createInvoice);

router.route('/:id')
    .get(getInvoiceById)
    .put(authorize('admin'), updateInvoice);

router.put('/:id/pay', authorize('admin'), recordPayment);

module.exports = router;
