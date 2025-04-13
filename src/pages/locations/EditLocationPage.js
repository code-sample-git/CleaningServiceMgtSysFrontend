import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { locationService } from '../../services/mockData';
import { Form, FormInput, FormSelect } from '../../components/common';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useRole } from '../../context/RoleContext';

const EditLocationPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { checkPermission } = useRole();
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    status: 'active'
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!checkPermission('canManageLocations')) {
      navigate('/locations');
      return;
    }
    loadLocationDetails();
  }, [id]);

  const loadLocationDetails = () => {
    const location = locationService.getById(Number(id));
    if (!location) {
      navigate('/locations');
      return;
    }
    setFormData(location);
    setLoading(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.address) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      locationService.update(Number(id), formData);
      navigate('/locations');
    } catch (err) {
      setError('Failed to update location. Please try again.');
    }
  };

  const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' }
  ];

  if (loading) {
    return (
      <DashboardLayout>
        <div className="container">
          <div className="loading">Loading location details...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container">
        <div className="page-header">
          <h1>Edit Location</h1>
        </div>

        <div className="card">
          <Form onSubmit={handleSubmit}>
            {error && <div className="error">{error}</div>}
            
            <FormInput
              label="Location Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <FormInput
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
            />

            <FormSelect
              label="Status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              options={statusOptions}
            />

            <div className="form-actions">
              <button
                type="button"
                className="button"
                onClick={() => navigate('/locations')}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="button is-primary"
              >
                Save Changes
              </button>
            </div>
          </Form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default EditLocationPage; 