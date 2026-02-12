// frontend/src/pages/RoleSelection.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../index.css';

const RoleSelection = () => {
  const navigate = useNavigate();

  const handleRoleSelect = (role) => {
    localStorage.setItem('selectedRole', role);
    navigate(`/login/${role}`);
  };

  return (
    <div className="role-selection-container">
      <div className="role-selection-content">
        <div className="role-header">
          <h1>🏕️ Boy Scouts</h1>
          <p>Task Management System</p>
        </div>

        <h2 className="role-title">Select Your Role</h2>
        <p className="role-subtitle">Choose how you want to access the system</p>

        <div className="role-cards">
          <div 
            className="role-card role-card-admin"
            onClick={() => handleRoleSelect('admin')}
          >
            <div className="role-icon">👤</div>
            <h3>Admin</h3>
            <p>Manage tasks, users, and system settings</p>
            <div className="role-arrow">→</div>
          </div>

          <div 
            className="role-card role-card-scout"
            onClick={() => handleRoleSelect('scout')}
          >
            <div className="role-icon">⛺</div>
            <h3>Scout</h3>
            <p>View and update assigned tasks</p>
            <div className="role-arrow">→</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;