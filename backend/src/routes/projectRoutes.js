const express = require('express');
const { protect, authorize } = require('../middleware/authMiddleware');
const {
    getProjects,
    getProjectById,
    createProject,
    updateProject,
    deleteProject,
    updateMilestones,
    addDeliverable,
    removeDeliverable,
    addNote,
} = require('../controllers/projectController');

const router = express.Router();

// All project routes require authentication
router.use(protect);

router.route('/')
    .get(getProjects)
    .post(authorize('admin'), createProject);

router.route('/:id')
    .get(getProjectById)
    .put(authorize('admin'), updateProject)
    .delete(authorize('admin'), deleteProject);

router.put('/:id/milestones', authorize('admin'), updateMilestones);

router.route('/:id/deliverables')
    .post(authorize('admin'), addDeliverable);

router.delete('/:id/deliverables/:deliverableId', authorize('admin'), removeDeliverable);

router.post('/:id/notes', authorize('admin'), addNote);

module.exports = router;
