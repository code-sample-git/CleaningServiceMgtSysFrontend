import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/mockData';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useRole } from '../../context/RoleContext';

const AddClientPage = () => {
  const navigate = useNavigate();
  const { checkPermission } = useRole();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: 'client'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add client logic here
    authService.create({
      ...formData,
      role: 'client'
    });
    navigate('/clients');
  };

  if (!checkPermission('canManageClients')) {
    navigate('/clients');
    return null;
  }

  return (
    <DashboardLayout>
      <div className="container">
        <div className="page-header">
          <h1>Add New Client</h1>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="firstName">First Name</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="lastName">Last Name</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="button"
              onClick={() => navigate('/clients')}
            >
              Cancel
            </button>
            <button type="submit" className="button is-primary">
              Add Client
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default AddClientPage; 