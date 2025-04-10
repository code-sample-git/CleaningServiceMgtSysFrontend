import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/mockData';
import { Table, Card } from '../../components/common';
import DashboardLayout from '../../components/layout/DashboardLayout';

const StaffPage = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadStaff();
  }, []);

  const loadStaff = () => {
    const users = authService.getAll();
    const staffMembers = users.filter(user => 
      user.role === 'staff' || user.role === 'manager'
    );
    setStaff(staffMembers);
    setLoading(false);
  };

  const columns = [
    {
      key: 'name',
      label: 'Name',
      render: (row) => `${row.firstName} ${row.lastName}`
    },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'role', label: 'Role' }
  ];

  const actions = [
    {
      label: 'View',
      className: 'edit',
      onClick: (row) => navigate(`/staff/${row.id}`)
    },
    {
      label: 'Time Entries',
      className: 'primary',
      onClick: (row) => navigate(`/staff/${row.id}/time-entries`)
    }
  ];

  const stats = [
    {
      title: 'Total Staff',
      value: staff.length
    },
    {
      title: 'Managers',
      value: staff.filter(s => s.role === 'manager').length
    },
    {
      title: 'Staff Members',
      value: staff.filter(s => s.role === 'staff').length
    }
  ];

  return (
    <DashboardLayout>
      <div className="container">
        <div className="page-header">
          <h1>Staff Management</h1>
          <button
            className="button"
            onClick={() => navigate('/staff/add')}
          >
            Add Staff Member
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
          data={staff}
          actions={actions}
        />
      </div>
    </DashboardLayout>
  );
};

export default StaffPage; 