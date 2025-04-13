import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { qaReportService as qaService } from '../../services/mockData';
import { locationService } from '../../services/mockData';
import { Table, Card } from '../../components/common';
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
    const data = qaService.getAll();
    setReports(data);
    setLoading(false);
  };

  const getLocationName = (locationId) => {
    const location = locationService.getById(locationId);
    return location ? location.name : 'Unknown Location';
  };

  const columns = [
    {
      key: 'locationId',
      label: 'Location',
      render: (row) => getLocationName(row.locationId)
    },
    { key: 'date', label: 'Date' },
    {
      key: 'rating',
      label: 'Rating',
      render: (row) => `${row.rating}/5`
    }
  ];

  const actions = [
    {
      label: 'View',
      className: 'edit',
      onClick: (row) => navigate(`/reports/${row.id}`)
    }
  ];

  const stats = [
    {
      title: 'Total Reports',
      value: reports.length
    },
    {
      title: 'Average Rating',
      value: reports.length > 0
        ? (reports.reduce((sum, report) => sum + report.rating, 0) / reports.length).toFixed(1)
        : 'N/A'
    }
  ];

  return (
    <DashboardLayout>
      <div className="container">
        <div className="page-header">
          <h1>QA Reports</h1>
          {checkPermission('canCreateReports') && (
            <button
              className="button"
              onClick={() => navigate('/reports/create')}
            >
              Create Report
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
          data={reports}
          actions={actions}
        />
      </div>
    </DashboardLayout>
  );
};

export default QAReportsPage; 