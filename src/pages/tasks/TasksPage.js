import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { taskService } from '../../services/mockData';
import { getAllTasks } from '../../utils/api';

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
      const response = await getAllTasks();
      setTasks(response.data || []);
    } catch (err) {
      console.error(err);
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
            <h3>Estimated Total Time</h3>
            <p>{tasks.reduce((sum, t) => sum + (t.estimatedDuration || 0), 0)} min</p>
          </div>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Task Name</th>
                <th>Description</th>
                <th>Frequency</th>
                <th>Duration</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task._id}>
                  <td>{task.name}</td>
                  <td>{task.description}</td>
                  <td>{task.frequency}</td>
                  <td>{task.estimatedDuration} min</td>
                  <td>${task.price}</td>
                  <td>
                    <button
                      className="btn-secondary"
                      onClick={() => handleViewTask(task._id)}
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

