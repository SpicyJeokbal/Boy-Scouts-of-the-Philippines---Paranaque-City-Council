// backend/src/app.js
const express = require('express');
const cors = require('cors');
const errorHandler = require('./middleware/errorHandler');

// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const taskRoutes = require('./routes/taskRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const archiveRoutes = require('./routes/archiveRoutes');
const adminRoutes = require('./routes/adminRoutes');


const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/archive', archiveRoutes);
app.use('/api/admin', adminRoutes);

// Health check route
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Boy Scout Task Manager API is running' });
});

// Error handling middleware (should be last)
app.use(errorHandler);

module.exports = app;