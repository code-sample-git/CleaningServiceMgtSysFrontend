import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
//import { authService, locationService } from '../../services/mockData';
import { Table, Card } from '../../components/common';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { getAllUsers, getLocationsByClientId } from '../../utils/api';

const ClientsPage = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      const { data: users } = await getAllUsers();
      const clientUsers = users.filter(user => user.role === 'client');
      setClients(clientUsers);
      setLoading(false);
    } catch (err) {
      console.error(err);
    }
  };

  const [locationCounts, setLocationCounts] = useState({});

  const loadLocationCounts = async (clientList) => {
    const counts = {};
    for (const client of clientList) {
      const { data } = await getLocationsByClientId(client.id);
      counts[client.id] = data.length;
    }
    setLocationCounts(counts);
  };

  useEffect(() => {
    const fetchAll = async () => {
      const { data: users } = await getAllUsers();
      const clientUsers = users.filter(u => u.role === 'client');
      setClients(clientUsers);
      await loadLocationCounts(clientUsers);
      setLoading(false);
    };
    fetchAll();
  }, []);

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
      render: (row) => locationCounts[row.id || row._id] || 0
    }
  ];

  const actions = [
    {
      label: 'View',
      className: 'edit',
      onClick: (row) => navigate(`/clients/${row.id}`)
    },
    {
      label: 'Proposals',
      className: 'primary',
      onClick: (row) => navigate(`/clients/${row.id}/proposals`)
    }
  ];

  const stats = [
    {
      title: 'Total Clients',
      value: clients.length
    },
    {
      title: 'Total Locations',
      value: clients.reduce((sum, client) => sum + locationCounts.length, 0)
    }
  ];

  return (
    <DashboardLayout>
      <div className="container">
        <div className="page-header">
          <h1>Client Management</h1>
          <button
            className="button"
            onClick={() => navigate('/clients/add')}
          >
            Add Client
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
          data={clients}
          actions={actions}
        />
      </div>
    </DashboardLayout>
  );
};

export default ClientsPage; 