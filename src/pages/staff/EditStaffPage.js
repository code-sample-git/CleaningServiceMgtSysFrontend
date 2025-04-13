import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { authService } from '../../services/mockData';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useRole } from '../../context/RoleContext';

const EditStaffPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { checkPermission } = useRole();
  const [staff, setStaff] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!checkPermission('canManageStaff')) {
      navigate('/staff');
      return;
    }
    loadStaffDetails();
  }, [id]);

  const loadStaffDetails = () => {
    const users = authService.getAll();
    const staffMember = users.find(user => user.id === Number(id));
    
    if (!staffMember || !['staff', 'manager'].includes(staffMember.role)) {
      navigate('/staff');
      return;
    }

    setStaff(staffMember);
    setLoading(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Update staff member logic here
    navigate('/staff');
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="container">
          <h1>Loading...</h1>
        </div>
      </DashboardLayout>
    );
  }

  if (!staff) {
    return (
      <DashboardLayout>
        <div className="container">
          <h1>Staff member not found</h1>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container">
        <div className="page-header">
          <h1>Edit Staff Member</h1>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="firstName">First Name</label>
            <input
              type="text"
              id="firstName"
              defaultValue={staff.firstName}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="lastName">Last Name</label>
            <input
              type="text"
              id="lastName"
              defaultValue={staff.lastName}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              defaultValue={staff.email}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone</label>
            <input
              type="tel"
              id="phone"
              defaultValue={staff.phone}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="role">Role</label>
            <select id="role" defaultValue={staff.role} required>
              <option value="staff">Staff</option>
              <option value="manager">Manager</option>
            </select>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="button"
              onClick={() => navigate(`/staff/${id}`)}
            >
              Cancel
            </button>
            <button type="submit" className="button is-primary">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default EditStaffPage; 