// frontend/src/pages/Workspace.jsx
import React, { useState, useEffect } from 'react';
import Navbar from '../components/NavBar';
import KanbanBoard from '../components/KanBanBoard';
import TaskForm from '../components/TaskForm';
import '../index.css';

const Workspace = () => {
  const [tasks, setTasks] = useState({
    ongoing: [],
    done: [],
    cancelled: []
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('ongoing');
  const [selectedTask, setSelectedTask] = useState(null);
  const [scouts, setScouts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchTasks();
    fetchScouts();
  }, []);

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/tasks', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      
      if (data.success) {
        // Group tasks by status
        const grouped = {
          ongoing: data.tasks.filter(t => t.status === 'ongoing'),
          done: data.tasks.filter(t => t.status === 'done'),
          cancelled: data.tasks.filter(t => t.status === 'cancelled')
        };
        setTasks(grouped);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const fetchScouts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/users/scouts', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      
      if (data.success) {
        setScouts(data.scouts);
      }
    } catch (error) {
      console.error('Error fetching scouts:', error);
    }
  };

  const handleAddTask = (status) => {
    setSelectedStatus(status);
    setSelectedTask(null);
    setIsModalOpen(true);
  };

  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTask(null);
  };

  const handleTaskSubmit = async (taskData) => {
    try {
      const token = localStorage.getItem('token');
      const url = selectedTask 
        ? `http://localhost:5000/api/tasks/${selectedTask.id}`
        : 'http://localhost:5000/api/tasks';
      
      const method = selectedTask ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(taskData)
      });

      const data = await response.json();
      
      if (data.success) {
        alert(selectedTask ? 'Task updated successfully!' : 'Task created successfully!');
        fetchTasks();
        handleCloseModal();
      } else {
        alert('Error: ' + data.message);
      }
    } catch (error) {
      console.error('Error submitting task:', error);
      alert('Error submitting task');
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/tasks/update-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          task_id: taskId,
          status: newStatus
        })
      });

      const data = await response.json();
      
      if (data.success) {
        fetchTasks();
      } else {
        alert('Error updating status');
        fetchTasks();
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Error updating status');
      fetchTasks();
    }
  };

  const filteredTasks = {
    ongoing: tasks.ongoing.filter(task => 
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.assigned_to_name.toLowerCase().includes(searchTerm.toLowerCase())
    ),
    done: tasks.done.filter(task => 
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.assigned_to_name.toLowerCase().includes(searchTerm.toLowerCase())
    ),
    cancelled: tasks.cancelled.filter(task => 
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.assigned_to_name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  };

  return (
    <div className="workspace-container">
      <Navbar />
      
      <div className="main-content">
        {/* Search Bar */}
        <div className="search-bar">
          <input 
            type="text" 
            className="search-input" 
            placeholder="Search tasks..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="filter-btn">⚙</button>
        </div>

        {/* Kanban Board */}
        <KanbanBoard 
          tasks={filteredTasks}
          onAddTask={handleAddTask}
          onTaskClick={handleTaskClick}
          onStatusChange={handleStatusChange}
        />
      </div>

      {/* Task Form Modal */}
      {isModalOpen && (
        <TaskForm 
          task={selectedTask}
          status={selectedStatus}
          scouts={scouts}
          onClose={handleCloseModal}
          onSubmit={handleTaskSubmit}
        />
      )}
    </div>
  );
};

export default Workspace;