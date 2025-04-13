import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { qaReportService, authService } from '../../services/mockData';
import { Table, Card, StatusTag } from '../../components/common';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useRole } from '../../context/RoleContext';

const QAReportsPage = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { checkPermission } = useRole();

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = () => {
    const reportsData = qaReportService.getAll();
    setReports(reportsData);
    setLoading(false);
  };

  const columns = [
    { key: 'location', label: 'Location' },
    {
      key: 'inspector',
      label: 'Inspector',
      render: (row) => {
        const user = authService.getAll().find(u => u.id === row.inspectorId);
        return user ? `${user.firstName} ${user.lastName}` : 'Unknown';
      }
    },
    {
      key: 'date',
      label: 'Date',
      render: (row) => new Date(row.date).toLocaleDateString()
    },
    {
      key: 'score',
      label: 'Score',
      render: (row) => `${row.score}%`
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => <StatusTag status={row.status} />
    }
  ];

  const actions = [
    {
      label: 'View',
      className: 'btn-view',
      onClick: (row) => navigate(`/reports/${row.id}`)
    }
  ];

  const stats = [
    {
      title: 'Total Reports',
      value: reports.length
    },
    {
      title: 'Average Score',
      value: reports.length > 0 
        ? `${Math.round(reports.reduce((sum, r) => sum + r.score, 0) / reports.length)}%`
        : '0%'
    },
    {
      title: 'Passed',
      value: reports.filter(r => r.status === 'passed').length
    },
    {
      title: 'Failed',
      value: reports.filter(r => r.status === 'failed').length
    }
  ];

  if (loading) {
    return (
      <DashboardLayout>
        <div className="loading">Loading QA reports...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="page-content">
        <div className="page-header">
          <h1>QA Reports</h1>
          {checkPermission('canCreateReports') && (
            <button
              className="btn-primary"
              onClick={() => navigate('/reports/create')}
            >
              Create Report
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
            data={reports}
            actions={actions}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default QAReportsPage; 