import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { timeEntryService, authService, locationService } from '../../services/mockData';
import { Card, StatusTag } from '../../components/common';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { useRole } from '../../context/RoleContext';

const TimeEntryDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { checkPermission } = useRole();
  const [timeEntry, setTimeEntry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadTimeEntry();
  }, [id]);

  const loadTimeEntry = () => {
    const entry = timeEntryService.getById(Number(id));
    if (!entry) {
      setError('Time entry not found');
      setLoading(false);
      return;
    }

    // Check if user has permission to view this entry
    if (entry.userId !== user.id && !checkPermission('canManageTimeEntries')) {
      navigate('/time-entries');
      return;
    }

    setTimeEntry(entry);
    setLoading(false);
  };

  const handleClockOut = () => {
    try {
      const updatedEntry = {
        ...timeEntry,
        clockOut: new Date().toISOString(),
        status: 'completed'
      };
      timeEntryService.update(updatedEntry);
      setTimeEntry(updatedEntry);
    } catch (err) {
      setError('Failed to clock out. Please try again.');
    }
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

  if (loading) {
    return (
      <DashboardLayout>
        <div className="loading">Loading time entry details...</div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="error">{error}</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="page-content">
        <div className="page-header">
          <h1>Time Entry Details</h1>
          <div className="header-actions">
            {!timeEntry.clockOut && timeEntry.userId === user.id && (
              <button
                className="btn-primary"
                onClick={handleClockOut}
              >
                Clock Out
              </button>
            )}
            <button
              className="btn-secondary"
              onClick={() => navigate('/time-entries')}
            >
              Back to Time Entries
            </button>
          </div>
        </div>

        <div className="info-grid">
          <div className="info-item">
            <label>Staff Member:</label>
            <span>{getUserName(timeEntry.userId)}</span>
          </div>
          <div className="info-item">
            <label>Location:</label>
            <span>{getLocationName(timeEntry.locationId)}</span>
          </div>
          <div className="info-item">
            <label>Clock In:</label>
            <span>{formatDateTime(timeEntry.clockIn)}</span>
          </div>
          <div className="info-item">
            <label>Clock Out:</label>
            <span>{timeEntry.clockOut ? formatDateTime(timeEntry.clockOut) : 'In Progress'}</span>
          </div>
          <div className="info-item">
            <label>Duration:</label>
            <span>{calculateDuration(timeEntry.clockIn, timeEntry.clockOut)}</span>
          </div>
          <div className="info-item">
            <label>Status:</label>
            <span><StatusTag status={timeEntry.status} /></span>
          </div>
        </div>

        {timeEntry.notes && (
          <div className="section">
            <h2>Notes</h2>
            <p>{timeEntry.notes}</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default TimeEntryDetailsPage; 