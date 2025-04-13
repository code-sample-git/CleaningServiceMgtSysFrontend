import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService, locationService } from '../../services/mockData';
import { Table, Card } from '../../components/common';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useRole } from '../../context/RoleContext';

const ClientsPage = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { checkPermission } = useRole();

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = () => {
    const users = authService.getAll();
    const clientUsers = users.filter(user => user.role === 'client');
    setClients(clientUsers);
    setLoading(false);
  };

  const getClientLocations = (clientId) => {
    const locations = locationService.getByClient(clientId);
    return locations.length;
  };

  const columns = [
    {
      key: 'name',
      label: 'Name',
      render: (row) => `${row.firstName} ${row.lastName}`
    },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    {
      key: 'locations',
      label: 'Locations',
      render: (row) => getClientLocations(row.id)
    }
  ];

  const actions = [
    {
      label: 'View',
      className: 'btn-view',
      onClick: (row) => navigate(`/clients/${row.id}`)
    }
  ];

  const stats = [
    {
      title: 'Total Clients',
      value: clients.length
    },
    {
      title: 'Total Locations',
      value: clients.reduce((sum, client) => sum + getClientLocations(client.id), 0)
    }
  ];

  if (loading) {
    return (
      <DashboardLayout>
        <div className="loading">Loading clients...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container">
        <div className="page-header">
          <h1>Client Management</h1>
          {checkPermission('canManageClients') && (
            <button
              className="button"
              onClick={() => navigate('/clients/add')}
            >
              Add Client
            </button>
          )}
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
          data={clients}
          actions={actions}
        />
      </div>
    </DashboardLayout>
  );
};

export default ClientsPage; 