import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { authService, locationService, proposalService } from '../../services/mockData';
import { Table, Loading } from '../../components/common';
import DashboardLayout from '../../components/layout/DashboardLayout';

const ClientDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState(null);
  const [locations, setLocations] = useState([]);
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadClientDetails();
  }, [id]);

  const loadClientDetails = () => {
    const users = authService.getAll();
    const clientUser = users.find(user => user.id === Number(id));
    
    if (!clientUser || clientUser.role !== 'client') {
      navigate('/clients');
      return;
    }

    const clientLocations = locationService.getByClient(Number(id));
    const clientProposals = proposalService.getByClient(Number(id));

    setClient(clientUser);
    setLocations(clientLocations);
    setProposals(clientProposals);
    setLoading(false);
  };

  const locationColumns = [
    { key: 'name', label: 'Location Name' },
    { key: 'address', label: 'Address' },
    { key: 'status', label: 'Status' }
  ];

  const proposalColumns = [
    { key: 'createdDate', label: 'Date' },
    { key: 'status', label: 'Status' },
    {
      key: 'totalAmount',
      label: 'Amount',
      render: (row) => `$${row.totalAmount}`
    }
  ];

  const proposalActions = [
    {
      label: 'View',
      className: 'edit',
      onClick: (row) => navigate(`/clients/${id}/proposals/${row.id}`)
    }
  ];

  if (loading) {
    return (
      <DashboardLayout>
        <Loading />
      </DashboardLayout>
    );
  }

  if (!client) {
    return (
      <DashboardLayout>
        <div className="container">
          <h1>Client not found</h1>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container">
        <div className="page-header">
          <h1>Client Details</h1>
        </div>

        <div className="card">
          <h2>Personal Information</h2>
          <div className="details-grid">
            <div className="detail-item">
              <label>Name:</label>
              <p>{client.firstName} {client.lastName}</p>
            </div>
            <div className="detail-item">
              <label>Email:</label>
              <p>{client.email}</p>
            </div>
            <div className="detail-item">
              <label>Phone:</label>
              <p>{client.phone}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h2>Locations</h2>
            <button
              className="button"
              onClick={() => navigate('/locations/add')}
            >
              Add Location
            </button>
          </div>
          <Table
            columns={locationColumns}
            data={locations}
          />
        </div>

        <div className="card">
          <div className="card-header">
            <h2>Proposals</h2>
            <button
              className="button"
              onClick={() => navigate(`/clients/${id}/proposals/create`)}
            >
              Create Proposal
            </button>
          </div>
          <Table
            columns={proposalColumns}
            data={proposals}
            actions={proposalActions}
          />
        </div>

        <div className="form-actions">
          <button
            className="button"
            onClick={() => navigate('/clients')}
          >
            Back to Clients
          </button>
          <button
            className="button is-primary"
            onClick={() => navigate(`/clients/${id}/edit`)}
          >
            Edit Client
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ClientDetailsPage; 