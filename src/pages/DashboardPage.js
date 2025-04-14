import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService, inventoryService, supplyService, qaService, proposalService, serviceService } from '../services/mockData';
import { Card } from '../components/common';
import DashboardLayout from '../components/layout/DashboardLayout';

const DashboardPage = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    inventory: { total: 0, lowStock: 0 },
    supplies: { total: 0, pending: 0 },
    staff: { total: 0, active: 0 },
    clients: { total: 0 },
    qaReports: { total: 0, avgRating: 0 },
    proposals: { total: 0, pending: 0 },
    service: { total: 0, pending: 0 }
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
    const pendingSupplies = supplies.filter(supply => supply.status === 'pending');

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

    //
    const services = serviceService.getAll();;
    const pendingServices = services.filter(req => req.status === 'pending');

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
      },
      service: {
        total: services.length,
        pending: pendingServices.length
      }
    });
  };

  const sections = [
    {
      title: 'Staff Management',
      cards: [
        { title: 'Total Staff', value: stats.staff.total },
        { title: 'Active Staff', value: stats.staff.active }
      ],
      action: { label: 'View Staff', onClick: () => navigate('/staff') }
    },
    {
      title: 'Client Management',
      cards: [
        { title: 'Total Clients', value: stats.clients.total },
        { title: 'Active Proposals', value: stats.proposals.pending }
      ],
      action: { label: 'View Clients', onClick: () => navigate('/clients') }
    },
    {
      title: 'Quality Assurance',
      cards: [
        { title: 'Total Reports', value: stats.qaReports.total },
        { title: 'Average Rating', value: `${stats.qaReports.avgRating}/5` }
      ],
      action: { label: 'View Reports', onClick: () => navigate('/qa-reports') }
    },
    {
      title: 'Inventory Overview',
      cards: [
        { title: 'Total Items', value: stats.inventory.total },
        { title: 'Low Stock Items', value: stats.inventory.lowStock }
      ],
      action: { label: 'View Inventory', onClick: () => navigate('/inventory') }
    },
    {
      title: 'Supplies Overview',
      cards: [
        { title: 'Total Supplies', value: stats.supplies.total },
        { title: 'Pending Requests', value: stats.supplies.pending }
      ],
      action: { label: 'View Supplies', onClick: () => navigate('/supplies') }
    },
    {
      title: 'Proposals',
      cards: [
        { title: 'Total Proposals', value: stats.proposals.total },
        { title: 'Pending Approval', value: stats.proposals.pending }
      ],
      action: { label: 'View Proposals', onClick: () => navigate('/proposals') }
    },
    {
      title: 'Service Requests',
      cards: [
        { title: 'Total Requests', value: stats.service.total },
        { title: 'Pending Requests', value: stats.service.pending }
      ],
      action: { label: 'View Requests', onClick: () => navigate('/service') }
    }
    
  ];

  return (
    <DashboardLayout>
      <div className="container">
        <div className="page-header">
          <h1>Dashboard</h1>
        </div>

        <div className="dashboard-grid">
          {sections.map((section, index) => (
            <div key={index} className="dashboard-section card">
              <div className="section-header">
                <h2>{section.title}</h2>
                <button
                  className="button"
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