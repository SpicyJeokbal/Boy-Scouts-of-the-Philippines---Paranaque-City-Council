// backend/src/routes/analyticsRoutes.js
const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const { authenticateToken } = require('../middleware/auth');

// All routes require authentication
router.use(authenticateToken);

// Get analytics/statistics
router.get('/', analyticsController.getAnalytics);

// Get recent activity
router.get('/activity', analyticsController.getRecentActivity);

module.exports = router;