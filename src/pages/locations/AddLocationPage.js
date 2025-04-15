import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, FormInput, FormSelect } from '../../components/common';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { createLocation, getAllUsers } from '../../utils/api';

const AddLocationPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    status: 'active',
    clientId: ''
  });
  const [clients, setClients] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadClients = async () => {
      try {
        const { data: users } = await getAllUsers();
        const clientUsers = users.filter(user => user.role === 'client');
        setClients(clientUsers);
      } catch (err) {
        console.error('Failed to load clients:', err);
      }
    };
    loadClients();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.address || !formData.clientId) {
      setError('Please fill in all required fields.');
      return;
    }

    try {
      await createLocation(formData);
      navigate('/locations');
    } catch (err) {
      console.error(err);
      setError('Failed to add location. Please try again.');
    }
  };

  const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' }
  ];

  const clientOptions = clients.map(client => ({
    value: client._id,
    label: `${client.firstName} ${client.lastName}`
  }));

  return (
    <DashboardLayout>
      <div className="container">
        <div className="page-header">
          <h1>Add New Location</h1>
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

            <FormSelect
              label="Client"
              name="clientId"
              value={formData.clientId}
              onChange={handleChange}
              options={clientOptions}
              required
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
                Add Location
              </button>
            </div>
          </Form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AddLocationPage;
