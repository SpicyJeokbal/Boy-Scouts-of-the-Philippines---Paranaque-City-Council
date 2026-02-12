// backend/src/controllers/archiveController.js
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// Get all archived tasks
exports.getArchivedTasks = async (req, res) => {
  try {
    const { data: tasks, error } = await supabase
      .from('tasks')
      .select(`
        *,
        assigned_to_user:users!tasks_assigned_to_fkey(id, first_name, last_name),
        created_by_user:users!tasks_created_by_fkey(id, first_name, last_name)
      `)
      .eq('is_archived', true)
      .order('archived_at', { ascending: false });

    if (error) throw error;

    // Calculate days remaining until deletion (90 days from archive)
    const formattedTasks = tasks.map(task => {
      const archivedDate = new Date(task.archived_at);
      const deletionDate = new Date(archivedDate);
      deletionDate.setDate(deletionDate.getDate() + 90);
      
      const today = new Date();
      const daysRemaining = Math.ceil((deletionDate - today) / (1000 * 60 * 60 * 24));

      return {
        id: task.id,
        title: task.title,
        description: task.description,
        assigned_to_name: `${task.assigned_to_user.first_name} ${task.assigned_to_user.last_name}`,
        created_by_name: `${task.created_by_user.first_name} ${task.created_by_user.last_name}`,
        status: task.status,
        priority: task.priority,
        category: task.category,
        due_date: task.due_date,
        archived_at: task.archived_at,
        days_until_deletion: daysRemaining > 0 ? daysRemaining : 0,
        completed_at: task.completed_at,
        cancelled_at: task.cancelled_at
      };
    });

    res.json({
      success: true,
      tasks: formattedTasks
    });
  } catch (error) {
    console.error('Error fetching archived tasks:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching archived tasks',
      error: error.message
    });
  }
};

// Delete archived task
exports.deleteArchivedTask = async (req, res) => {
  try {
    const { id } = req.params;

    // Verify task is archived
    const { data: task } = await supabase
      .from('tasks')
      .select('is_archived')
      .eq('id', id)
      .single();

    if (!task || !task.is_archived) {
      return res.status(400).json({
        success: false,
        message: 'Task is not archived or does not exist'
      });
    }

    // Delete the task
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.json({
      success: true,
      message: 'Archived task deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting archived task:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting archived task',
      error: error.message
    });
  }
};