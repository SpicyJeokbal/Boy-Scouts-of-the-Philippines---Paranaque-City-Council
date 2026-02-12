// backend/src/middleware/auth.js
const jwt = require('jsonwebtoken');

// Middleware to verify JWT token
exports.authenticateToken = (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token required'
      });
    }

    // Verify token
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({
          success: false,
          message: 'Invalid or expired token'
        });
      }

      // Attach user info to request
      req.user = user;
      next();
    });
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'Authentication error',
      error: error.message
    });
  }
};

// Middleware to check if user is a leader
exports.isLeader = (req, res, next) => {
  if (req.user.role !== 'leader') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Leader role required.'
    });
  }
  next();
};