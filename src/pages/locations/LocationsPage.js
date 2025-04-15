import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { locationService } from '../../services/mockData';
import { Table, Card, StatusTag } from '../../components/common';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { getLocations } from '../../utils/api';

const LocationsPage = () => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadLocations();
  }, []);

  const loadLocations = async () => {
    try {
      const response = await getLocations();
      setLocations(response.data || []);
    } catch (error) {
      console.error('Failed to load locations:', error);
    } finally {
      setLoading(false);
    }
  };
  

  const columns = [
    { key: 'name', label: 'Location Name' },
    { key: 'address', label: 'Address' },
    {
      key: 'status',
      label: 'Status',
      render: (row) => <StatusTag status={row.status} />
    }
  ];

  const actions = [
    {
      label: 'View',
      className: 'edit',
      onClick: (row) => navigate(`/locations/${row._id}`)
    }
  ];

  const stats = [
    {
      title: 'Total Locations',
      value: locations.length
    },
    {
      title: 'Active Locations',
      value: locations.filter(loc => loc.status === 'active').length
    }
  ];

  return (
    <DashboardLayout>
      <div className="container">
        <div className="page-header">
          <h1>Locations</h1>
          <button
            className="button"
            onClick={() => navigate('/locations/add')}
          >
            Add Location
          </button>
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

        <Table
          columns={columns}
          data={locations}
          actions={actions}
        />
      </div>
    </DashboardLayout>
  );
};

export default LocationsPage; 