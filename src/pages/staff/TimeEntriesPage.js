import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { timeEntryService, authService, locationService } from '../../services/mockData';
import { Table, Card, StatusTag } from '../../components/common';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useRole } from '../../context/RoleContext';
import { useAuth } from '../../context/AuthContext';

const TimeEntriesPage = () => {
  const [timeEntries, setTimeEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { checkPermission } = useRole();
  const { user } = useAuth();

  useEffect(() => {
    loadTimeEntries();
  }, []);

  const loadTimeEntries = () => {
    const entriesData = timeEntryService.getAll();
    setTimeEntries(entriesData);
    setLoading(false);
  };

  const getLocationName = (locationId) => {
    const location = locationService.getById(locationId);
    return location ? location.name : 'Unknown Location';
  };

  const getUserName = (userId) => {
    const user = authService.getAll().find(u => u.id === userId);
    return user ? `${user.firstName} ${user.lastName}` : 'Unknown User';
  };

  const formatDateTime = (dateTime) => {
    return new Date(dateTime).toLocaleString();
  };

  const calculateDuration = (clockIn, clockOut) => {
    if (!clockIn || !clockOut) return 'In Progress';
    const start = new Date(clockIn);
    const end = new Date(clockOut);
    const diff = end - start;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const columns = [
    {
      key: 'user',
      label: 'Staff Member',
      render: (row) => getUserName(row.userId)
    },
    {
      key: 'location',
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
      render: (row) => formatDateTime(row.clockOut)
    },
    {
      key: 'duration',
      label: 'Duration',
      render: (row) => calculateDuration(row.clockIn, row.clockOut)
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => <StatusTag status={row.status} />
    }
  ];

  const actions = [
    {
      label: 'View',
      className: 'btn-view',
      onClick: (row) => navigate(`/time-entries/${row.id}`),
      show: (row) => row.userId === user.id || checkPermission('canManageTimeEntries')
    }
  ];

  const stats = [
    {
      title: 'Total Entries',
      value: timeEntries.length
    },
    {
      title: 'Active Sessions',
      value: timeEntries.filter(entry => !entry.clockOut).length
    },
    {
      title: 'Completed Sessions',
      value: timeEntries.filter(entry => entry.clockOut).length
    }
  ];

  if (loading) {
    return (
      <DashboardLayout>
        <div className="loading">Loading time entries...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="page-content">
        <div className="page-header">
          <h1>Time Entries</h1>
          {checkPermission('canManageTimeEntries') && (
            <button
              className="btn-primary"
              onClick={() => navigate('/time-entries/add')}
            >
              Add Time Entry
            </button>
          )}
        </div>

        <div className="stats-row">
          {stats.map((stat, index) => (
            <Card
              key={index}
              title={stat.title}
              value={stat.value}
            />
          ))}
        </div>

        <div className="table-container">
          <Table
            columns={columns}
            data={timeEntries}
            actions={actions}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TimeEntriesPage; 