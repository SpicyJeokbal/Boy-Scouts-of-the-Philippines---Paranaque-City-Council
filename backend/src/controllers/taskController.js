// backend/src/controllers/taskController.js
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// Get all tasks (non-archived)
exports.getTasks = async (req, res) => {
  try {
    const { data: tasks, error } = await supabase
      .from('tasks')
      .select(`
        *,
        assigned_to_user:users!tasks_assigned_to_fkey(id, first_name, last_name),
        created_by_user:users!tasks_created_by_fkey(id, first_name, last_name)
      `)
      .eq('is_archived', false)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Format the response
    const formattedTasks = tasks.map(task => ({
      id: task.id,
      title: task.title,
      description: task.description,
      assigned_to: task.assigned_to,
      assigned_to_name: `${task.assigned_to_user.first_name} ${task.assigned_to_user.last_name}`,
      created_by: task.created_by,
      created_by_name: `${task.created_by_user.first_name} ${task.created_by_user.last_name}`,
      status: task.status,
      priority: task.priority,
      category: task.category,
      due_date: task.due_date,
      notes: task.notes,
      created_date: task.created_at,
      completed_date: task.completed_at,
      cancelled_date: task.cancelled_at
    }));

    res.json({
      success: true,
      tasks: formattedTasks
    });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching tasks',
      error: error.message
    });
  }
};

// Get single task by ID
exports.getTaskById = async (req, res) => {
  try {
    const { id } = req.params;

    const { data: task, error } = await supabase
      .from('tasks')
      .select(`
        *,
        assigned_to_user:users!tasks_assigned_to_fkey(id, first_name, last_name),
        created_by_user:users!tasks_created_by_fkey(id, first_name, last_name)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    const formattedTask = {
      id: task.id,
      title: task.title,
      description: task.description,
      assigned_to: task.assigned_to,
      assigned_to_name: `${task.assigned_to_user.first_name} ${task.assigned_to_user.last_name}`,
      created_by: task.created_by,
      created_by_name: `${task.created_by_user.first_name} ${task.created_by_user.last_name}`,
      status: task.status,
      priority: task.priority,
      category: task.category,
      due_date: task.due_date,
      notes: task.notes,
      created_date: task.created_at,
      completed_date: task.completed_at,
      cancelled_date: task.cancelled_at
    };

    res.json({
      success: true,
      task: formattedTask
    });
  } catch (error) {
    console.error('Error fetching task:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching task',
      error: error.message
    });
  }
};

// Create new task
exports.createTask = async (req, res) => {
  try {
    const {
      title,
      description,
      assigned_to,
      priority,
      due_date,
      category,
      notes,
      status
    } = req.body;

    const created_by = req.user.id; // From auth middleware

    // Validation
    if (!title || !assigned_to || !due_date) {
      return res.status(400).json({
        success: false,
        message: 'Title, assigned_to, and due_date are required'
      });
    }

    const { data: task, error } = await supabase
      .from('tasks')
      .insert([
        {
          title,
          description: description || '',
          assigned_to,
          created_by,
          status: status || 'ongoing',
          priority: priority || 'medium',
          category: category || 'other',
          due_date,
          notes: notes || '',
          is_archived: false
        }
      ])
      .select()
      .single();

    if (error) throw error;

    res.json({
      success: true,
      message: 'Task created successfully',
      task
    });
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating task',
      error: error.message
    });
  }
};

// Update task
exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      assigned_to,
      priority,
      due_date,
      category,
      notes,
      status
    } = req.body;

    const updateData = {
      title,
      description,
      assigned_to,
      priority,
      due_date,
      category,
      notes,
      status
    };

    const { data: task, error } = await supabase
      .from('tasks')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    res.json({
      success: true,
      message: 'Task updated successfully',
      task
    });
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating task',
      error: error.message
    });
  }
};

// Update task status (for drag and drop)
exports.updateTaskStatus = async (req, res) => {
  try {
    const { task_id, status } = req.body;

    if (!task_id || !status) {
      return res.status(400).json({
        success: false,
        message: 'task_id and status are required'
      });
    }

    const updateData = { status };

    // Set completion/cancellation timestamps
    if (status === 'done') {
      updateData.completed_at = new Date().toISOString();
      updateData.cancelled_at = null;
    } else if (status === 'cancelled') {
      updateData.cancelled_at = new Date().toISOString();
      updateData.completed_at = null;
    } else {
      updateData.completed_at = null;
      updateData.cancelled_at = null;
    }

    const { data: task, error } = await supabase
      .from('tasks')
      .update(updateData)
      .eq('id', task_id)
      .select()
      .single();

    if (error) throw error;

    res.json({
      success: true,
      message: 'Task status updated successfully',
      task
    });
  } catch (error) {
    console.error('Error updating task status:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating task status',
      error: error.message
    });
  }
};

// Delete task
exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.json({
      success: true,
      message: 'Task deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting task',
      error: error.message
    });
  }
};