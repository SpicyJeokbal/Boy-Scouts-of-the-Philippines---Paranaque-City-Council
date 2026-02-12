// backend/src/routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticateToken } = require('../middleware/auth');

// All routes require authentication
router.use(authenticateToken);

// Get all users (Super Admin only)
router.get('/users', adminController.getAllUsers);

// Create new user (Super Admin only)
router.post('/users', adminController.createUser);

// Update user (Super Admin only)
router.put('/users/:id', adminController.updateUser);

// Update user permissions (Super Admin only)
router.put('/users/:id/permissions', adminController.updateUserPermissions);

// Deactivate user (Super Admin only)
router.put('/users/:id/deactivate', adminController.deactivateUser);

// Delete user permanently (Super Admin only)
router.delete('/users/:id', adminController.deleteUser);

// Reset user password (Super Admin only)
router.post('/users/:id/reset-password', adminController.resetUserPassword);

module.exports = router;