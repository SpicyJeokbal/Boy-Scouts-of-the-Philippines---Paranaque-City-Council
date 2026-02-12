// backend/src/controllers/analyticsController.js
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// Get task statistics for dashboard
exports.getAnalytics = async (req, res) => {
  try {
    // Get all non-archived tasks
    const { data: tasks, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('is_archived', false);

    if (error) throw error;

    // Calculate statistics
    const stats = {
      total_tasks: tasks.length,
      ongoing: tasks.filter(t => t.status === 'ongoing').length,
      done: tasks.filter(t => t.status === 'done').length,
      cancelled: tasks.filter(t => t.status === 'cancelled').length,
      
      // Priority breakdown
      high_priority: tasks.filter(t => t.priority === 'high' && t.status === 'ongoing').length,
      medium_priority: tasks.filter(t => t.priority === 'medium' && t.status === 'ongoing').length,
      low_priority: tasks.filter(t => t.priority === 'low' && t.status === 'ongoing').length,
      
      // Category breakdown
      by_category: {
        camping: tasks.filter(t => t.category === 'camping').length,
        training: tasks.filter(t => t.category === 'training').length,
        community: tasks.filter(t => t.category === 'community').length,
        admin: tasks.filter(t => t.category === 'admin').length,
        other: tasks.filter(t => t.category === 'other').length
      },
      
      // Overdue tasks (ongoing tasks past due date)
      overdue: tasks.filter(t => {
        if (t.status !== 'ongoing') return false;
        const dueDate = new Date(t.due_date);
        const today = new Date();
        return dueDate < today;
      }).length,
      
      // Completion rate
      completion_rate: tasks.length > 0 
        ? Math.round((tasks.filter(t => t.status === 'done').length / tasks.length) * 100) 
        : 0
    };

    res.json({
      success: true,
      stats
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching analytics',
      error: error.message
    });
  }
};

// Get recent activity
exports.getRecentActivity = async (req, res) => {
  try {
    const { data: tasks, error } = await supabase
      .from('tasks')
      .select(`
        *,
        assigned_to_user:users!tasks_assigned_to_fkey(first_name, last_name),
        created_by_user:users!tasks_created_by_fkey(first_name, last_name)
      `)
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) throw error;

    const activity = tasks.map(task => ({
      id: task.id,
      title: task.title,
      status: task.status,
      created_by: `${task.created_by_user.first_name} ${task.created_by_user.last_name}`,
      created_at: task.created_at
    }));

    res.json({
      success: true,
      activity
    });
  } catch (error) {
    console.error('Error fetching recent activity:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching recent activity',
      error: error.message
    });
  }
};