// backend/src/routes/archiveRoutes.js
const express = require('express');
const router = express.Router();
const archiveController = require('../controllers/archiveController');
const { authenticateToken } = require('../middleware/auth');

// All routes require authentication
router.use(authenticateToken);

// Get all archived tasks
router.get('/', archiveController.getArchivedTasks);

// Delete archived task
router.delete('/:id', archiveController.deleteArchivedTask);

module.exports = router;