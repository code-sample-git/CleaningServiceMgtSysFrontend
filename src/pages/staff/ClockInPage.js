import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { timeEntryService, locationService } from '../../services/mockData';
import { Form, FormSelect, FormTextarea } from '../../components/common';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { useRole } from '../../context/RoleContext';

const ClockInPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { checkPermission } = useRole();
  const [formData, setFormData] = useState({
    locationId: '',
    notes: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (!checkPermission('canClockInOut')) {
      navigate('/time-entries');
    }
  }, [checkPermission, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.locationId) {
      setError('Please select a location');
      return;
    }

    try {
      const newEntry = {
        userId: user.id,
        locationId: parseInt(formData.locationId),
        clockIn: new Date().toISOString(),
        notes: formData.notes,
        status: 'active'
      };
      
      timeEntryService.add(newEntry);
      navigate('/time-entries');
    } catch (err) {
      setError('Failed to clock in. Please try again.');
    }
  };

  const locations = locationService.getAll();
  const locationOptions = locations.map(loc => ({
    value: loc.id.toString(),
    label: loc.name
  }));

  return (
    <DashboardLayout>
      <div className="page-content">
        <div className="page-header">
          <h1>Clock In</h1>
        </div>

        <div className="form-container">
          <Form onSubmit={handleSubmit}>
            {error && <div className="error">{error}</div>}

            <FormSelect
              label="Location"
              name="locationId"
              value={formData.locationId}
              onChange={handleChange}
              options={locationOptions}
              required
            />

            <FormTextarea
              label="Notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Add any notes about your shift..."
            />

            <div className="form-actions">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => navigate('/time-entries')}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary"
              >
                Clock In
              </button>
            </div>
          </Form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ClockInPage; 