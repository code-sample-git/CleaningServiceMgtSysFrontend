import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { timeEntryService, authService, locationService } from '../../services/mockData';
import { Table, Card, Loading } from '../../components/common';
import DashboardLayout from '../../components/layout/DashboardLayout';

const TimeEntriesPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [staff, setStaff] = useState(null);
  const [timeEntries, setTimeEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTimeEntries();
  }, [id]);

  const loadTimeEntries = () => {
    const users = authService.getAll();
    const staffMember = users.find(user => user.id === Number(id));
    
    if (!staffMember || !['staff', 'manager'].includes(staffMember.role)) {
      navigate('/staff');
      return;
    }

    const entries = timeEntryService.getByUser(Number(id));
    setStaff(staffMember);
    setTimeEntries(entries);
    setLoading(false);
  };

  const getLocationName = (locationId) => {
    const location = locationService.getById(locationId);
    return location ? location.name : 'Unknown Location';
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const calculateDuration = (entry) => {
    if (!entry.clockOut) return 'Active';
    
    const start = new Date(entry.clockIn);
    const end = new Date(entry.clockOut);
    const diff = end - start;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
  };

  const columns = [
    {
      key: 'locationId',
      label: 'Location',
      render: (row) => getLocationName(row.locationId)
    },
    {
      key: 'clockIn',
      label: 'Clock In',
      render: (row) => formatDateTime(row.clockIn)
    },
    {
      key: 'clockOut',
      label: 'Clock Out',
      render: (row) => row.clockOut ? formatDateTime(row.clockOut) : 'Active'
    },
    {
      key: 'duration',
      label: 'Duration',
      render: (row) => calculateDuration(row)
    },
    {
      key: 'status',
      label: 'Status'
    }
  ];

  const stats = [
    {
      title: 'Total Entries',
      value: timeEntries.length
    },
    {
      title: 'Active Sessions',
      value: timeEntries.filter(entry => entry.status === 'active').length
    },
    {
      title: 'Completed Sessions',
      value: timeEntries.filter(entry => entry.status === 'completed').length
    }
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
          <h1>Time Entries - {staff.firstName} {staff.lastName}</h1>
        </div>

        <div className="stats-grid">
          {stats.map((stat, index) => (
            <Card
              key={index}
              title={stat.title}
              value={stat.value}
            />
          ))}
        </div>

        <div className="card">
          <h2>Time Entry History</h2>
          <Table
            columns={columns}
            data={timeEntries}
          />
        </div>

        <div className="form-actions">
          <button
            className="button"
            onClick={() => navigate(`/staff/${id}`)}
          >
            Back to Staff Details
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TimeEntriesPage; 