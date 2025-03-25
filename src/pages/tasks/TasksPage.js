import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { taskService } from '../../services/mockData';

function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const result = await taskService.getTasks();
      setTasks(result.data || []);
    } catch (err) {
      setError('Failed to load tasks');
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewTask = (taskId) => {
    navigate(`/tasks/${taskId}`);
  };

  const handleAddTask = () => {
    navigate('/tasks/add');
  };

  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'status-success';
      case 'in progress':
        return 'status-warning';
      case 'pending':
        return 'status-pending';
      default:
        return 'status-default';
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="loading">Loading tasks...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="page-content">
        <div className="page-header">
          <h1>Tasks</h1>
          <button className="btn-primary" onClick={handleAddTask}>
            Add New Task
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="stats-container">
          <div className="stat-card">
            <h3>Total Tasks</h3>
            <p>{tasks.length}</p>
          </div>
          <div className="stat-card">
            <h3>Pending</h3>
            <p>{tasks.filter(task => task.status.toLowerCase() === 'pending').length}</p>
          </div>
          <div className="stat-card">
            <h3>In Progress</h3>
            <p>{tasks.filter(task => task.status.toLowerCase() === 'in progress').length}</p>
          </div>
          <div className="stat-card">
            <h3>Completed</h3>
            <p>{tasks.filter(task => task.status.toLowerCase() === 'completed').length}</p>
          </div>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Task Name</th>
                <th>Location</th>
                <th>Assigned To</th>
                <th>Due Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task.id}>
                  <td>{task.name}</td>
                  <td>{task.location}</td>
                  <td>{task.assignedTo}</td>
                  <td>{new Date(task.dueDate).toLocaleDateString()}</td>
                  <td>
                    <span className={`status-tag ${getStatusClass(task.status)}`}>
                      {task.status}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn-secondary"
                      onClick={() => handleViewTask(task.id)}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default TasksPage;

 