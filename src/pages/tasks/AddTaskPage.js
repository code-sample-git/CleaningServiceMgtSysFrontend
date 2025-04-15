import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { taskService } from '../../services/mockData';
import { createTask } from '../../utils/api';

function AddTaskPage() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    frequency: 'daily',
    estimatedDuration: '',
    price: ''
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
      const response = await createTask(formData);
      if (response.status === 201) {
        navigate('/tasks');
      } else {
        setError('Failed to create task');
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
                rows={3}
              />
            </div>

            <div className="form-group">
              <label htmlFor="frequency">Frequency *</label>
              <select
                id="frequency"
                name="frequency"
                value={formData.frequency}
                onChange={handleChange}
                required
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="estimatedDuration">Estimated Duration (minutes) *</label>
              <input
                id="estimatedDuration"
                name="estimatedDuration"
                type="number"
                value={formData.estimatedDuration}
                onChange={handleChange}
                required
                placeholder="Enter duration"
              />
            </div>

            <div className="form-group">
              <label htmlFor="price">Price ($) *</label>
              <input
                id="price"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                required
                placeholder="Enter price"
              />
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn-secondary"
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