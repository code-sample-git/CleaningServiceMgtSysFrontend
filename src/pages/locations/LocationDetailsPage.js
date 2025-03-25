import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { locationService, taskService } from '../../services/mockData';
import { Table, StatusTag, Loading } from '../../components/common';
import DashboardLayout from '../../components/layout/DashboardLayout';

const LocationDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [location, setLocation] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLocationDetails();
  }, [id]);

  const loadLocationDetails = () => {
    const locationData = locationService.getById(Number(id));
    if (!locationData) {
      navigate('/locations');
      return;
    }

    const allTasks = taskService.getAll();
    const locationTasks = allTasks.filter(task => 
      locationData.tasks.includes(task.id)
    );

    setLocation(locationData);
    setTasks(locationTasks);
    setLoading(false);
  };

  const taskColumns = [
    { key: 'name', label: 'Task Name' },
    { key: 'frequency', label: 'Frequency' },
    { 
      key: 'estimatedDuration',
      label: 'Duration',
      render: (row) => `${row.estimatedDuration} minutes`
    }
  ];

  if (loading) {
    return (
      <DashboardLayout>
        <Loading />
      </DashboardLayout>
    );
  }

  if (!location) {
    return (
      <DashboardLayout>
        <div className="container">
          <h1>Location not found</h1>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container">
        <div className="page-header">
          <h1>{location.name}</h1>
          <StatusTag status={location.status} />
        </div>

        <div className="card">
          <h2>Location Details</h2>
          <div className="details-grid">
            <div className="detail-item">
              <label>Address:</label>
              <p>{location.address}</p>
            </div>
            <div className="detail-item">
              <label>Status:</label>
              <StatusTag status={location.status} />
            </div>
          </div>
        </div>

        <div className="card">
          <h2>Assigned Tasks</h2>
          <Table
            columns={taskColumns}
            data={tasks}
          />
        </div>

        <div className="form-actions">
          <button
            className="button"
            onClick={() => navigate('/locations')}
          >
            Back to Locations
          </button>
          <button
            className="button is-primary"
            onClick={() => navigate(`/locations/${id}/edit`)}
          >
            Edit Location
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default LocationDetailsPage; 