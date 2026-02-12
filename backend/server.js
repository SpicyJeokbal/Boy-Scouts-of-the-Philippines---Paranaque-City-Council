// backend/server.js
require('dotenv').config();
const app = require('./src/app');
const cron = require('node-cron');
const taskCleanup = require('./src/jobs/taskCleanup');

const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API URL: http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});

// Schedule cron job to run daily at midnight
// This will:
// 1. Move DONE tasks older than 30 days to archive
// 2. Delete archived tasks older than 90 days
cron.schedule('0 0 * * *', async () => {
  console.log('Running scheduled task cleanup job...');
  await taskCleanup.cleanupTasks();
});

console.log('Cron job scheduled: Task cleanup runs daily at midnight');