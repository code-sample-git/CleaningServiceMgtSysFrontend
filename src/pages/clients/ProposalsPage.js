import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { proposalService, authService } from '../../services/mockData';
import { Table, Card, StatusTag } from '../../components/common';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useRole } from '../../context/RoleContext';

const ProposalsPage = () => {
  const { clientId } = useParams();
  const [proposals, setProposals] = useState([]);
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { checkPermission } = useRole();

  useEffect(() => {
    loadProposals();
  }, [clientId]);

  const loadProposals = () => {
    const allProposals = proposalService.getAll();
    const clientProposals = clientId 
      ? allProposals.filter(p => p.clientId === parseInt(clientId))
      : allProposals;
    
    setProposals(clientProposals);
    
    if (clientId) {
      const clientData = authService.getAll().find(user => user.id === parseInt(clientId));
      setClient(clientData);
    }
    
    setLoading(false);
  };

  const columns = [
    {
      key: 'client',
      label: 'Client',
      render: (row) => {
        const client = authService.getAll().find(user => user.id === row.clientId);
        return client ? `${client.firstName} ${client.lastName}` : 'Unknown';
      }
    },
    {
      key: 'totalAmount',
      label: 'Amount',
      render: (row) => `$${row.totalAmount}`
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => <StatusTag status={row.status} />
    },
    {
      key: 'createdDate',
      label: 'Created Date',
      render: (row) => new Date(row.createdDate).toLocaleDateString()
    }
  ];

  const actions = [
    {
      label: 'View',
      className: 'btn-view',
      onClick: (row) => navigate(`/proposals/${row.id}`)
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
      title: 'Rejected',
      value: proposals.filter(p => p.status === 'rejected').length
    }
  ];

  if (loading) {
    return (
      <DashboardLayout>
        <div className="loading">Loading proposals...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="page-content">
        <div className="page-header">
          <h1>{client ? `${client.firstName} ${client.lastName}'s Proposals` : 'All Proposals'}</h1>
          {checkPermission('canManageProposals') && (
            <button
              className="btn-primary"
              onClick={() => navigate(clientId ? `/proposals/create?clientId=${clientId}` : '/proposals/create')}
            >
              Create Proposal
            </button>
          )}
          {clientId && (
            <button
              className="btn-secondary"
              onClick={() => navigate(`/clients/${clientId}`)}
            >
              Back to Client
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
            data={proposals}
            actions={actions}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProposalsPage; 