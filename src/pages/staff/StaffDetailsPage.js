import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { authService, locationService } from '../../services/mockData';
import { Table, Loading } from '../../components/common';
import DashboardLayout from '../../components/layout/DashboardLayout';

const StaffDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [staff, setStaff] = useState(null);
  const [assignedLocations, setAssignedLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStaffDetails();
  }, [id]);

  const loadStaffDetails = () => {
    const users = authService.getAll();
    const staffMember = users.find(user => user.id === Number(id));
    
    if (!staffMember || !['staff', 'manager'].includes(staffMember.role)) {
      navigate('/staff');
      return;
    }

    const locations = locationService.getAll();
    const staffLocations = locations.filter(loc => 
      loc.assignedStaff.includes(Number(id))
    );

    setStaff(staffMember);
    setAssignedLocations(staffLocations);
    setLoading(false);
  };

  const locationColumns = [
    { key: 'name', label: 'Location Name' },
    { key: 'address', label: 'Address' }
  ];

  if (loading) {
    return (
      <DashboardLayout>
        <Loading />
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
          <h1>Staff Details</h1>
        </div>

        <div className="card">
          <h2>Personal Information</h2>
          <div className="details-grid">
            <div className="detail-item">
              <label>Name:</label>
              <p>{staff.firstName} {staff.lastName}</p>
            </div>
            <div className="detail-item">
              <label>Email:</label>
              <p>{staff.email}</p>
            </div>
            <div className="detail-item">
              <label>Phone:</label>
              <p>{staff.phone}</p>
            </div>
            <div className="detail-item">
              <label>Role:</label>
              <p>{staff.role}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <h2>Assigned Locations</h2>
          <Table
            columns={locationColumns}
            data={assignedLocations}
          />
        </div>

        <div className="form-actions">
          <button
            className="button"
            onClick={() => navigate('/staff')}
          >
            Back to Staff
          </button>
          <button
            className="button is-primary"
            onClick={() => navigate(`/staff/${id}/edit`)}
          >
            Edit Staff Member
          </button>
          <button
            className="button"
            onClick={() => navigate(`/staff/${id}/time-entries`)}
          >
            View Time Entries
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StaffDetailsPage; 