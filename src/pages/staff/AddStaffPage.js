import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { authService } from '../../services/mockData';

function AddStaffPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    role: 'staff',
    status: 'active'
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      authService.create(formData);
      navigate('/staff');
    } catch (err) {
      setError('Failed to create staff member');
    }
  };

  return (
    <DashboardLayout>
      <div className="page-content">
        <div className="page-header">
          <h1>Add Staff Member</h1>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="card">
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
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
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

            <div className="form-group">
              <label htmlFor="role">Role</label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
              >
                <option value="staff">Staff</option>
                <option value="manager">Manager</option>
              </select>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-primary">
                Add Staff Member
              </button>
              <button 
                type="button" 
                className="btn-secondary"
                onClick={() => navigate('/staff')}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default AddStaffPage; 