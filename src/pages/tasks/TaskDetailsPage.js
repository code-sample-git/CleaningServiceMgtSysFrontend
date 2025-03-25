import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { taskService } from '../../services/mockData';

function TaskDetailsPage() {
  const [task, setTask] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    loadTask();
  }, [id]);

  const loadTask = async () => {
    try {
      const result = await taskService.getTaskById(id);
      if (result.success) {
        setTask(result.data);
      } else {
        setError('Task not found');
      }
    } catch (err) {
      setError('Failed to load task details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    try {
      const result = await taskService.updateTaskStatus(id, newStatus);
      if (result.success) {
        setTask(prev => ({ ...prev, status: newStatus }));
      } else {
        setError('Failed to update task status');
      }
    } catch (err) {
      setError('An error occurred while updating the task');
    }
  };

  const handleBack = () => {
    navigate('/tasks');
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="loading">Loading task details...</div>
      </DashboardLayout>
    );
  }

  if (!task) {
    return (
      <DashboardLayout>
        <div className="error-message">{error || 'Task not found'}</div>
        <button className="btn-secondary" onClick={handleBack}>
          Back to Tasks
        </button>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="page-content">
        <div className="page-header">
          <button className="btn-secondary" onClick={handleBack}>
            Back to Tasks
          </button>
          <h1>{task.name}</h1>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="details-container">
          <div className="details-section">
            <h2>Task Information</h2>
            <div className="details-grid">
              <div className="detail-item">
                <label>Status</label>
                <div className="status-actions">
                  <span className={`status-tag status-${task.status.toLowerCase()}`}>
                    {task.status}
                  </span>
                  <div className="status-buttons">
                    <button
                      className="btn-small"
                      onClick={() => handleStatusUpdate('Pending')}
                      disabled={task.status === 'Pending'}
                    >
                      Mark Pending
                    </button>
                    <button
                      className="btn-small"
                      onClick={() => handleStatusUpdate('In Progress')}
                      disabled={task.status === 'In Progress'}
                    >
                      Mark In Progress
                    </button>
                    <button
                      className="btn-small"
                      onClick={() => handleStatusUpdate('Completed')}
                      disabled={task.status === 'Completed'}
                    >
                      Mark Completed
                    </button>
                  </div>
                </div>
              </div>
              <div className="detail-item">
                <label>Location</label>
                <p>{task.location}</p>
              </div>
              <div className="detail-item">
                <label>Assigned To</label>
                <p>{task.assignedTo}</p>
              </div>
              <div className="detail-item">
                <label>Due Date</label>
                <p>{new Date(task.dueDate).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          <div className="details-section">
            <h2>Description</h2>
            <p className="task-description">{task.description}</p>
          </div>

          {task.notes && (
            <div className="details-section">
              <h2>Notes</h2>
              <p className="task-notes">{task.notes}</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default TaskDetailsPage; 