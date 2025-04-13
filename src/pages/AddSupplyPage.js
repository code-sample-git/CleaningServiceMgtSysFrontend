import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import { supplyService } from '../services/mockData';

function AddSupplyPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    condition: 'good',
    assignedTo: '',
    notes: '',
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      await supplyService.create(formData);
      navigate('/supply', { state: { message: 'Supply added successfully!' } });
    } catch (err) {
      setError('Failed to add supply');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <DashboardLayout>
      <div className="page-content">
        <div className="page-header">
          <h1>Add New Supply</h1>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="card">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Equipment Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label htmlFor="condition">Condition</label>
              <select
                id="condition"
                name="condition"
                value={formData.condition}
                onChange={handleChange}
                required
                className="form-control"
              >
                <option value="good">Good</option>
                <option value="needs maintenance">Needs Maintenance</option>
                <option value="needs replacement">Needs Replacement</option>
                <option value="broken">Broken</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="assignedTo">Assigned To</label>
              <input
                type="text"
                id="assignedTo"
                name="assignedTo"
                value={formData.assignedTo}
                onChange={handleChange}
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label htmlFor="notes">Notes</label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                className="form-control"
                rows="4"
              />
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => navigate('/supply')}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Adding...' : 'Add Supply'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default AddSupplyPage; 