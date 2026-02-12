// backend/src/controllers/userController.js
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// Get all users (only for leaders and admins)
exports.getUsers = async (req, res) => {
  try {
    // Only allow leaders, admins, and super_admins to view all users
    if (!['leader', 'admin', 'super_admin'].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Leaders and above only.'
      });
    }

    const { data: users, error } = await supabase
      .from('users')
      .select('id, email, first_name, last_name, role, created_at')
      .eq('is_active', true)
      .order('first_name', { ascending: true });

    if (error) throw error;

    res.json({
      success: true,
      users
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching users',
      error: error.message
    });
  }
};

// Get all scouts (users with role 'scout')
exports.getScouts = async (req, res) => {
  try {
    const { data: scouts, error } = await supabase
      .from('users')
      .select('id, email, first_name, last_name, created_at')
      .eq('role', 'scout')
      .eq('is_active', true)
      .order('first_name', { ascending: true });

    if (error) throw error;

    res.json({
      success: true,
      scouts
    });
  } catch (error) {
    console.error('Error fetching scouts:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching scouts',
      error: error.message
    });
  }
};

// Get user profile
exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id; // From auth middleware

    const { data: user, error } = await supabase
      .from('users')
      .select('id, email, first_name, last_name, role, created_at')
      .eq('id', userId)
      .single();

    if (error) throw error;

    res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user profile',
      error: error.message
    });
  }
};

// Update user profile (users can only update their own profile)
exports.updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { first_name, last_name, email } = req.body;

    const updateData = {};
    if (first_name) updateData.first_name = first_name;
    if (last_name) updateData.last_name = last_name;
    if (email) updateData.email = email;

    const { data: user, error } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', userId)
      .select('id, email, first_name, last_name, role')
      .single();

    if (error) throw error;

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating profile',
      error: error.message
    });
  }
};