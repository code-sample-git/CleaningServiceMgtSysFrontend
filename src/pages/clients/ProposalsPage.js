import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { proposalService, authService } from '../../services/mockData';
import { Table, Card, StatusTag } from '../../components/common';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { getProposalsByClient, getClientById, sendProposalEmail } from '../../utils/api';

const ProposalsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState(null);
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProposals();
  }, [id]);

  const loadProposals = async () => {
    try {
      const { data: user } = await getClientById(id);
      if (user.role !== 'client') {
        navigate('/clients');
        return;
      }
      setClient(user);
  
      const { data: proposals } = await getProposalsByClient(id);
      setProposals(proposals);
      setLoading(false);
    } catch {
      navigate('/clients');
    }
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
      onClick: (row) => navigate(`/clients/${id}/proposals/${row.id || row._id}`)
    },
    {
      label: 'Send Email',
      className: 'primary',
      onClick: async (row) => {
        try {
          await sendProposalEmail(row.id || row._id);
          alert('Proposal email sent successfully!');
        } catch (err) {
          console.error(err);
          alert('Failed to send email.');
        }
      }
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