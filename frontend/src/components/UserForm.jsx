// frontend/src/components/UserForm.jsx
import React, { useState, useEffect } from 'react';
import '../index.css';

const UserForm = ({ user, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    role: 'scout',
    permissions: {
      can_view: true,
      can_create: false,
      can_edit: false,
      can_delete: false,
      can_manage_users: false
    }
  });

  useEffect(() => {
    if (user) {
      setFormData({
        email: user.email || '',
        password: '',
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        role: user.role || 'scout',
        permissions: user.permissions || {
          can_view: true,
          can_create: false,
          can_edit: false,
          can_delete: false,
          can_manage_users: false
        }
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Auto-set permissions based on role
    if (name === 'role') {
      const rolePermissions = {
        super_admin: {
          can_view: true,
          can_create: true,
          can_edit: true,
          can_delete: true,
          can_manage_users: true
        },
        admin: {
          can_view: true,
          can_create: true,
          can_edit: true,
          can_delete: false,
          can_manage_users: false
        },
        leader: {
          can_view: true,
          can_create: true,
          can_edit: true,
          can_delete: false,
          can_manage_users: false
        },
        scout: {
          can_view: true,
          can_create: false,
          can_edit: false,
          can_delete: false,
          can_manage_users: false
        }
      };
      
      setFormData(prev => ({
        ...prev,
        permissions: rolePermissions[value] || rolePermissions.scout
      }));
    }
  };

  const handlePermissionChange = (permission) => {
    setFormData(prev => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [permission]: !prev.permissions[permission]
      }
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    if (!user && !formData.password) {
      alert('Password is required for new users');
      return;
    }
    
    if (formData.password && formData.password.length < 6) {
      alert('Password must be at least 6 characters');
      return;
    }

    onSubmit(formData);
  };

  const getCurrentUser = () => {
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    return currentUser;
  };

  const currentUser = getCurrentUser();

  return (
    <div className="modal-overlay active" onClick={onClose}>
      <div className="modal-content modal-task-form modal-user-form" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{user ? 'EDIT USER' : 'CREATE NEW USER'}</h2>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body-grid">
            {/* Left Column - Basic Info */}
            <div className="form-left">
              <div className="form-section-header">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2c5f2d" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
                <h3>USER INFORMATION</h3>
              </div>
              
              <div className="form-row-inline">
                <div className="form-group">
                  <label htmlFor="first_name">FIRST NAME:</label>
                  <input
                    type="text"
                    id="first_name"
                    name="first_name"
                    className="form-input"
                    value={formData.first_name}
                    onChange={handleChange}
                    required
                    placeholder="John"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="last_name">LAST NAME:</label>
                  <input
                    type="text"
                    id="last_name"
                    name="last_name"
                    className="form-input"
                    value={formData.last_name}
                    onChange={handleChange}
                    required
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="email">EMAIL ADDRESS:</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="form-input"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="john.doe@example.com"
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">
                  PASSWORD: {user ? '(leave blank to keep current)' : ''}
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  className="form-input"
                  value={formData.password}
                  onChange={handleChange}
                  required={!user}
                  placeholder="Minimum 6 characters"
                  minLength={6}
                />
              </div>

              <div className="form-group">
                <label htmlFor="role">ROLE:</label>
                <select
                  id="role"
                  name="role"
                  className="form-input"
                  value={formData.role}
                  onChange={handleChange}
                  required
                >
                  <option value="scout">Scout</option>
                  <option value="leader">Leader</option>
                  <option value="admin">Admin</option>
                  <option value="super_admin">Super Admin</option>
                </select>
                <p style={{ fontSize: '11px', color: '#999', marginTop: '5px' }}>
                  Permissions will auto-update based on role
                </p>
              </div>

              <div className="signature-section">
                <div className="signature-group">
                  <label>CREATED BY:</label>
                  <div className="created-by-name">
                    {user && user.created_by_name 
                      ? user.created_by_name.toUpperCase() 
                      : `${currentUser.first_name?.toUpperCase()} ${currentUser.last_name?.toUpperCase()}`
                    }
                  </div>
                  <div className="signature-line"></div>
                </div>
              </div>
            </div>

            {/* Right Column - Permissions */}
            <div className="form-right">
              <div className="summary-box permissions-box">
                <div className="form-section-header" style={{ marginBottom: '15px' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2c5f2d" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                  <h3>PERMISSIONS</h3>
                </div>
                <p className="permissions-subtitle">
                  Set what this user can do in the system
                </p>

                <div className="permission-item">
                  <label>
                    <input
                      type="checkbox"
                      checked={formData.permissions.can_view}
                      onChange={() => handlePermissionChange('can_view')}
                    />
                    <div className="permission-label">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="permission-icon">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                      <div>
                        <strong>View Tasks</strong>
                        <p>Can see all tasks and dashboard</p>
                      </div>
                    </div>
                  </label>
                </div>

                <div className="permission-item">
                  <label>
                    <input
                      type="checkbox"
                      checked={formData.permissions.can_create}
                      onChange={() => handlePermissionChange('can_create')}
                    />
                    <div className="permission-label">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="permission-icon">
                        <line x1="12" y1="5" x2="12" y2="19"/>
                        <line x1="5" y1="12" x2="19" y2="12"/>
                      </svg>
                      <div>
                        <strong>Create Tasks</strong>
                        <p>Can add new tasks</p>
                      </div>
                    </div>
                  </label>
                </div>

                <div className="permission-item">
                  <label>
                    <input
                      type="checkbox"
                      checked={formData.permissions.can_edit}
                      onChange={() => handlePermissionChange('can_edit')}
                    />
                    <div className="permission-label">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="permission-icon">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                      </svg>
                      <div>
                        <strong>Edit Tasks</strong>
                        <p>Can modify existing tasks</p>
                      </div>
                    </div>
                  </label>
                </div>

                <div className="permission-item">
                  <label>
                    <input
                      type="checkbox"
                      checked={formData.permissions.can_delete}
                      onChange={() => handlePermissionChange('can_delete')}
                    />
                    <div className="permission-label">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="permission-icon">
                        <polyline points="3 6 5 6 21 6"/>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                        <line x1="10" y1="11" x2="10" y2="17"/>
                        <line x1="14" y1="11" x2="14" y2="17"/>
                      </svg>
                      <div>
                        <strong>Delete Tasks</strong>
                        <p>Can permanently remove tasks</p>
                      </div>
                    </div>
                  </label>
                </div>

                <div className="permission-item">
                  <label>
                    <input
                      type="checkbox"
                      checked={formData.permissions.can_manage_users}
                      onChange={() => handlePermissionChange('can_manage_users')}
                    />
                    <div className="permission-label">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="permission-icon">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                        <circle cx="9" cy="7" r="4"/>
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                      </svg>
                      <div>
                        <strong>Manage Users</strong>
                        <p>Can create, edit, and delete users</p>
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              <button type="submit" className="btn-save">
                {user ? 'UPDATE USER' : 'CREATE USER'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserForm;