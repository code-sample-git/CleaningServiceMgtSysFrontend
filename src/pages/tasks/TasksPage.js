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
      const result = await taskService.getAll();
      setTasks(result);
    } catch (err) {
      setError('Failed to load tasks');
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewTask = (id) => {
    navigate(`/tasks/${id}`);
  };

  const handleAddTask = () => {
    navigate('/tasks/add');
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
            Add Task
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="stats-row">
          <div className="stat-card">
            <h3>Total Tasks</h3>
            <div className="stat-value">{tasks.length}</div>
          </div>
          <div className="stat-card">
            <h3>Active Tasks</h3>
            <div className="stat-value">
              {tasks.filter(task => task.status === 'In Progress').length}
            </div>
          </div>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Task Name</th>
                <th>Location</th>
                <th>Status</th>
                <th>Due Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task.id}>
                  <td>{task.name}</td>
                  <td>{task.location}</td>
                  <td>
                    <span className={`status-tag ${
                      task.status === 'Completed' ? 'status-success' :
                      task.status === 'In Progress' ? 'status-warning' :
                      'status-danger'
                    }`}>
                      {task.status}
                    </span>
                  </td>
                  <td>{new Date(task.dueDate).toLocaleDateString()}</td>
                  <td>
                    <button 
                      className="btn-view"
                      onClick={() => handleViewTask(task.id)}
                    >
                      View
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

 