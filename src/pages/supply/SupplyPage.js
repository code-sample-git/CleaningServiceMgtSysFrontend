import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supplyService, authService } from '../../services/mockData';
import { Table, Card, StatusTag } from '../../components/common';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useRole } from '../../context/RoleContext';

const SupplyPage = () => {
  const [supplies, setSupplies] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { checkPermission } = useRole();

  useEffect(() => {
    loadSupplies();
  }, []);

  const loadSupplies = () => {
    const suppliesData = supplyService.getAll();
    setSupplies(suppliesData);
    setLoading(false);
  };

  const columns = [
    { key: 'name', label: 'Supply Name' },
    { key: 'category', label: 'Category' },
    {
      key: 'quantity',
      label: 'Quantity',
      render: (row) => `${row.quantity} ${row.unit}`
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => <StatusTag status={row.status} />
    },
    {
      key: 'requestedBy',
      label: 'Requested By',
      render: (row) => {
        const user = authService.getAll().find(u => u.id === row.requestedBy);
        return user ? `${user.firstName} ${user.lastName}` : 'Unknown';
      }
    },
    {
      key: 'requestedDate',
      label: 'Requested Date',
      render: (row) => new Date(row.requestedDate).toLocaleDateString()
    }
  ];

  const actions = [
    {
      label: 'View',
      className: 'btn-view',
      onClick: (row) => navigate(`/supply/${row.id}`)
    }
  ];

  const stats = [
    {
      title: 'Total Requests',
      value: supplies.length
    },
    {
      title: 'Pending',
      value: supplies.filter(s => s.status === 'pending').length
    },
    {
      title: 'Approved',
      value: supplies.filter(s => s.status === 'approved').length
    },
    {
      title: 'Rejected',
      value: supplies.filter(s => s.status === 'rejected').length
    }
  ];

  if (loading) {
    return (
      <DashboardLayout>
        <div className="loading">Loading supplies...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="page-content">
        <div className="page-header">
          <h1>Supply Requests</h1>
          {checkPermission('canRequestSupplies') && (
            <button
              className="btn-primary"
              onClick={() => navigate('/supply/add')}
            >
              Request Supplies
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
            data={supplies}
            actions={actions}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SupplyPage; 