import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService, inventoryService, supplyService, qaReportService as qaService, proposalService } from '../services/mockData';
import { useRole } from '../context/RoleContext';
import { Card } from '../components/common';
import DashboardLayout from '../components/layout/DashboardLayout';

const DashboardPage = () => {
  const navigate = useNavigate();
  const { checkPermission, userRole } = useRole();
  const [stats, setStats] = useState({
    inventory: { total: 0, lowStock: 0 },
    supplies: { total: 0, pending: 0 },
    staff: { total: 0, active: 0 },
    clients: { total: 0 },
    qaReports: { total: 0, avgRating: 0 },
    proposals: { total: 0, pending: 0 }
  });

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = () => {
    // Get inventory stats
    const inventory = inventoryService.getAll();
    const lowStockItems = inventory.filter(item => item.quantity <= item.minQuantity);

    // Get supply stats
    const supplies = supplyService.getAll();
    const pendingSupplies = supplies.filter(supply => supply.condition === 'needs maintenance');

    // Get staff stats
    const users = authService.getAll();
    const staffMembers = users.filter(user => ['staff', 'manager'].includes(user.role));
    const clients = users.filter(user => user.role === 'client');

    // Get QA report stats
    const qaReports = qaService.getAll();
    const avgRating = qaReports.length > 0
      ? (qaReports.reduce((sum, report) => sum + report.rating, 0) / qaReports.length).toFixed(1)
      : 0;

    // Get proposal stats
    const proposals = proposalService.getAll();
    const pendingProposals = proposals.filter(proposal => proposal.status === 'pending');

    setStats({
      inventory: {
        total: inventory.length,
        lowStock: lowStockItems.length
      },
      supplies: {
        total: supplies.length,
        pending: pendingSupplies.length
      },
      staff: {
        total: staffMembers.length,
        active: staffMembers.filter(staff => staff.status === 'active').length
      },
      clients: {
        total: clients.length
      },
      qaReports: {
        total: qaReports.length,
        avgRating
      },
      proposals: {
        total: proposals.length,
        pending: pendingProposals.length
      }
    });
  };

  const allSections = [
    {
      title: 'Staff Management',
      cards: [
        { title: 'Total Staff', value: stats.staff.total },
        { title: 'Active Staff', value: stats.staff.active }
      ],
      action: { label: 'View Staff', onClick: () => navigate('/staff') },
      permission: 'canManageUsers'
    },
    {
      title: 'Client Management',
      cards: [
        { title: 'Total Clients', value: stats.clients.total },
        { title: 'Active Proposals', value: stats.proposals.pending }
      ],
      action: { label: 'View Clients', onClick: () => navigate('/clients') },
      permission: 'canManageUsers'
    },
    {
      title: 'Quality Assurance',
      cards: [
        { title: 'Total Reports', value: stats.qaReports.total },
        { title: 'Average Rating', value: `${stats.qaReports.avgRating}/5` }
      ],
      action: { label: 'View Reports', onClick: () => navigate('/reports') },
      permission: ['canViewReports', 'canCreateReports']
    },
    {
      title: 'Inventory Overview',
      cards: [
        { title: 'Total Items', value: stats.inventory.total },
        { title: 'Low Stock Items', value: stats.inventory.lowStock }
      ],
      action: { label: 'View Inventory', onClick: () => navigate('/inventory') },
      permission: 'canManageInventory'
    },
    {
      title: 'Supplies Overview',
      cards: [
        { title: 'Total Supplies', value: stats.supplies.total },
        { title: 'Pending Requests', value: stats.supplies.pending }
      ],
      action: { label: 'View Supplies', onClick: () => navigate('/supply') },
      permission: ['canManageInventory', 'canRequestSupplies']
    },
    {
      title: 'My Tasks',
      cards: [
        { title: 'Assigned Tasks', value: stats.staff.total }, // This should be updated to show actual assigned tasks
        { title: 'Completed Tasks', value: stats.staff.active } // This should be updated to show actual completed tasks
      ],
      action: { label: 'View Tasks', onClick: () => navigate('/tasks') },
      permission: ['canManageTasks', 'canViewAssignedTasks']
    }
  ];

  // Filter sections based on user permissions
  const visibleSections = allSections.filter(section => {
    return Array.isArray(section.permission)
      ? section.permission.some(p => checkPermission(p))
      : checkPermission(section.permission);
  });

  return (
    <DashboardLayout>
      <div className="page-content">
        <div className="page-header">
          <h1>Dashboard</h1>
        </div>

        <div className="dashboard-grid">
          {visibleSections.map((section, index) => (
            <div key={index} className="dashboard-section card">
              <div className="section-header">
                <h2>{section.title}</h2>
                <button
                  className="btn-primary"
                  onClick={section.action.onClick}
                >
                  {section.action.label}
                </button>
              </div>
              <div className="stats-grid">
                {section.cards.map((stat, statIndex) => (
                  <Card
                    key={statIndex}
                    title={stat.title}
                    value={stat.value}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage; 