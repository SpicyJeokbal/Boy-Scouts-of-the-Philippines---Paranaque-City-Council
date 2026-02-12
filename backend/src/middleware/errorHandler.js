// backend/src/middleware/errorHandler.js

// Global error handler middleware
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err.stack);

  // Default error
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // Handle specific error types
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation Error';
  }

  if (err.name === 'UnauthorizedError') {
    statusCode = 401;
    message = 'Unauthorized';
  }

  if (err.code === '23505') { // PostgreSQL unique violation
    statusCode = 400;
    message = 'Duplicate entry';
  }

  res.status(statusCode).json({
    success: false,
    message,
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};

module.exports = errorHandler;