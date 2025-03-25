import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { proposalService, authService } from '../../services/mockData';
import { Table, Card, StatusTag } from '../../components/common';
import DashboardLayout from '../../components/layout/DashboardLayout';

const ProposalsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState(null);
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProposals();
  }, [id]);

  const loadProposals = () => {
    const users = authService.getAll();
    const clientUser = users.find(user => user.id === Number(id));
    
    if (!clientUser || clientUser.role !== 'client') {
      navigate('/clients');
      return;
    }

    const clientProposals = proposalService.getByClient(Number(id));
    setClient(clientUser);
    setProposals(clientProposals);
    setLoading(false);
  };

  const columns = [
    { key: 'createdDate', label: 'Date' },
    {
      key: 'status',
      label: 'Status',
      render: (row) => <StatusTag status={row.status} />
    },
    {
      key: 'totalAmount',
      label: 'Amount',
      render: (row) => `$${row.totalAmount}`
    },
    {
      key: 'frequency',
      label: 'Frequency'
    }
  ];

  const actions = [
    {
      label: 'View',
      className: 'edit',
      onClick: (row) => navigate(`/clients/${id}/proposals/${row.id}`)
    }
  ];

  const stats = [
    {
      title: 'Total Proposals',
      value: proposals.length
    },
    {
      title: 'Pending',
      value: proposals.filter(p => p.status === 'pending').length
    },
    {
      title: 'Approved',
      value: proposals.filter(p => p.status === 'approved').length
    },
    {
      title: 'Total Value',
      value: `$${proposals.reduce((sum, p) => sum + p.totalAmount, 0)}`
    }
  ];

  return (
    <DashboardLayout>
      <div className="container">
        <div className="page-header">
          <h1>Proposals - {client?.firstName} {client?.lastName}</h1>
          <button
            className="button"
            onClick={() => navigate(`/clients/${id}/proposals/create`)}
          >
            Create Proposal
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
          data={proposals}
          actions={actions}
        />

        <div className="form-actions">
          <button
            className="button"
            onClick={() => navigate(`/clients/${id}`)}
          >
            Back to Client Details
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProposalsPage; 