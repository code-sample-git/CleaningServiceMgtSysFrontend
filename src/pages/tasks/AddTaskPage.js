import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { taskService } from '../../services/mockData';

function AddTaskPage() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
    assignedTo: '',
    dueDate: '',
    notes: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await taskService.createTask({
        ...formData,
        status: 'Pending'
      });

      if (result.success) {
        navigate('/tasks');
      } else {
        setError(result.error || 'Failed to create task');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/tasks');
  };

  return (
    <DashboardLayout>
      <div className="page-content">
        <div className="page-header">
          <h1>Create New Task</h1>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="form-container">
          <form onSubmit={handleSubmit} className="form">
            <div className="form-group">
              <label htmlFor="name">Task Name *</label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Enter task name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description *</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                placeholder="Enter task description"
                rows={4}
              />
            </div>

            <div className="form-group">
              <label htmlFor="location">Location *</label>
              <input
                id="location"
                name="location"
                type="text"
                value={formData.location}
                onChange={handleChange}
                required
                placeholder="Enter task location"
              />
            </div>

            <div className="form-group">
              <label htmlFor="assignedTo">Assigned To *</label>
              <input
                id="assignedTo"
                name="assignedTo"
                type="text"
                value={formData.assignedTo}
                onChange={handleChange}
                required
                placeholder="Enter assignee name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="dueDate">Due Date *</label>
              <input
                id="dueDate"
                name="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="notes">Notes</label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Enter additional notes"
                rows={3}
              />
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="button"
                onClick={handleCancel}
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary"
                disabled={isLoading}
              >
                {isLoading ? 'Creating Task...' : 'Create Task'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default AddTaskPage; 