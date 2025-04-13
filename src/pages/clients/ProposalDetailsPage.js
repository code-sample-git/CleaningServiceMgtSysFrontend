import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { proposalService, authService, taskService, locationService } from '../../services/mockData';
import { Table, Card, StatusTag } from '../../components/common';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useRole } from '../../context/RoleContext';

const ProposalDetailsPage = () => {
  const { id } = useParams();
  const [proposal, setProposal] = useState(null);
  const [client, setClient] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { checkPermission } = useRole();

  useEffect(() => {
    loadProposalDetails();
  }, [id]);

  const loadProposalDetails = () => {
    const proposalData = proposalService.getById(Number(id));
    if (!proposalData) {
      navigate('/proposals');
      return;
    }

    const clientData = authService.getAll().find(user => user.id === proposalData.clientId);
    if (!clientData || clientData.role !== 'client') {
      navigate('/proposals');
      return;
    }

    // Get all tasks from the proposal's locations
    const proposalTasks = proposalData.locations.flatMap(location => {
      const locationData = locationService.getById(location.id);
      if (!locationData) return [];
      return location.tasks.map(taskId => taskService.getById(taskId));
    });

    setProposal(proposalData);
    setClient(clientData);
    setTasks(proposalTasks);
    setLoading(false);
  };

  const columns = [
    { key: 'name', label: 'Task Name' },
    { key: 'description', label: 'Description' },
    {
      key: 'frequency',
      label: 'Frequency',
      render: (row) => row.frequency.charAt(0).toUpperCase() + row.frequency.slice(1)
    },
    {
      key: 'price',
      label: 'Price',
      render: (row) => `$${row.price}`
    }
  ];

  const stats = [
    {
      title: 'Total Amount',
      value: `$${proposal?.totalAmount || 0}`
    },
    {
      title: 'Status',
      value: proposal?.status ? proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1) : 'Unknown'
    },
    {
      title: 'Created Date',
      value: proposal?.createdDate ? new Date(proposal.createdDate).toLocaleDateString() : 'Unknown'
    },
    {
      title: 'Number of Tasks',
      value: tasks.length
    }
  ];

  if (loading) {
    return (
      <DashboardLayout>
        <div className="loading">Loading proposal details...</div>
      </DashboardLayout>
    );
  }

  if (!proposal || !client) {
    return (
      <DashboardLayout>
        <div className="error">Proposal not found</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="page-content">
        <div className="page-header">
          <h1>Proposal Details</h1>
          <div className="header-actions">
            {checkPermission('canManageProposals') && (
              <button
                className="btn-primary"
                onClick={() => navigate(`/proposals/${id}/edit`)}
              >
                Edit Proposal
              </button>
            )}
          </div>
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

        <div className="section">
          <h2>Client Information</h2>
          <div className="info-grid">
            <div className="info-item">
              <label>Name:</label>
              <span>{client.firstName} {client.lastName}</span>
            </div>
            <div className="info-item">
              <label>Email:</label>
              <span>{client.email}</span>
            </div>
            <div className="info-item">
              <label>Phone:</label>
              <span>{client.phone}</span>
            </div>
          </div>
        </div>

        <div className="section">
          <h2>Tasks</h2>
          <div className="table-container">
            <Table
              columns={columns}
              data={tasks}
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProposalDetailsPage; 