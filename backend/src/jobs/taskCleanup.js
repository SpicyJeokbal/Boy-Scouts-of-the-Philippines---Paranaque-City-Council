// backend/src/jobs/taskCleanup.js
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// Cleanup tasks: 
// 1. Archive DONE tasks older than 30 days
// 2. Delete archived tasks older than 90 days
exports.cleanupTasks = async () => {
  try {
    console.log('🧹 Starting task cleanup job...');

    // Calculate dates
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

    // 1. Archive DONE tasks older than 30 days
    const { data: tasksToArchive, error: archiveError } = await supabase
      .from('tasks')
      .update({ 
        is_archived: true,
        archived_at: new Date().toISOString()
      })
      .eq('status', 'done')
      .eq('is_archived', false)
      .lt('completed_at', thirtyDaysAgo.toISOString())
      .select();

    if (archiveError) {
      console.error('Error archiving tasks:', archiveError);
    } else {
      console.log(`Archived ${tasksToArchive?.length || 0} tasks (DONE > 30 days)`);
    }

    // 2. Delete archived tasks older than 90 days
    const { data: tasksToDelete, error: deleteError } = await supabase
      .from('tasks')
      .delete()
      .eq('is_archived', true)
      .lt('archived_at', ninetyDaysAgo.toISOString())
      .select();

    if (deleteError) {
      console.error('Error deleting old archived tasks:', deleteError);
    } else {
      console.log(`Deleted ${tasksToDelete?.length || 0} archived tasks (archived > 90 days)`);
    }

    console.log('Task cleanup job completed successfully');
    
    return {
      success: true,
      archived: tasksToArchive?.length || 0,
      deleted: tasksToDelete?.length || 0
    };
  } catch (error) {
    console.error('Task cleanup job failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
};