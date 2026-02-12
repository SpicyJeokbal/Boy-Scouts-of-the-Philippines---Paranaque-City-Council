// frontend/src/components/TaskCard.jsx
import React from 'react';

const TaskCard = ({ task, onDragStart, onClick }) => {
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const getPriorityClass = (priority) => {
    return `card-priority priority-${priority}`;
  };

  return (
    <div 
      className={`card ${task.status === 'cancelled' ? 'card-cancelled' : ''}`}
      draggable="true"
      onDragStart={(e) => onDragStart(e, task)}
      onDoubleClick={onClick}
    >
      <div className="card-header">
        <div className="card-title">{task.title}</div>
        <div className="card-menu">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <circle cx="3" cy="8" r="1.5"/>
            <circle cx="8" cy="8" r="1.5"/>
            <circle cx="13" cy="8" r="1.5"/>
          </svg>
        </div>
      </div>
      
      <div className="card-info">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '6px', flexShrink: 0 }}>
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
          <line x1="16" y1="13" x2="8" y2="13"/>
          <line x1="16" y1="17" x2="8" y2="17"/>
          <polyline points="10 9 9 9 8 9"/>
        </svg>
        <span>{task.description.substring(0, 50)}{task.description.length > 50 ? '...' : ''}</span>
      </div>
      
      <div className="card-info">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '6px', flexShrink: 0 }}>
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>
        <span>{task.assigned_to_name}</span>
      </div>
      
      <div className="card-info">
        {task.status === 'ongoing' && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              <span>Due: {formatDate(task.due_date)}</span>
            </div>
            {task.priority && (
              <span className={getPriorityClass(task.priority)}>
                {task.priority.toUpperCase()}
              </span>
            )}
          </>
        )}
        
        {task.status === 'done' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#388e3c" strokeWidth="2">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            <span>Completed: {formatDate(task.completed_date)}</span>
          </div>
        )}
        
        {task.status === 'cancelled' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#c62828" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="15" y1="9" x2="9" y2="15"/>
              <line x1="9" y1="9" x2="15" y2="15"/>
            </svg>
            <span>Cancelled: {formatDate(task.cancelled_date)}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskCard;