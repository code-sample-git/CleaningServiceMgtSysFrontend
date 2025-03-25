import React from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useRole } from '../../context/RoleContext';
import '../../styles/global.css';

const DashboardLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuth();
  const { checkPermission } = useRole();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    {
      label: 'Dashboard',
      path: '/home',
      show: true
    },
    {
      label: 'Locations',
      path: '/locations',
      show: checkPermission('canManageLocations') || checkPermission('canViewLocations')
    },
    {
      label: 'Tasks',
      path: '/tasks',
      show: checkPermission('canManageTasks') || checkPermission('canViewAssignedTasks')
    },
    {
      label: 'Staff',
      path: '/staff',
      show: checkPermission('canManageUsers')
    },
    {
      label: 'Clients',
      path: '/clients',
      show: checkPermission('canManageUsers')
    },
    {
      label: 'Inventory',
      path: '/inventory',
      show: checkPermission('canManageInventory')
    },
    {
      label: 'Supplies',
      path: '/supply',
      show: checkPermission('canManageInventory') || checkPermission('canRequestSupplies')
    },
    {
      label: 'QA Reports',
      path: '/reports',
      show: checkPermission('canViewReports') || checkPermission('canCreateReports')
    },
    {
      label: 'Proposals',
      path: '/proposals',
      show: checkPermission('canManageProposals')
    },
    {
      label: 'Time Entries',
      path: '/time-entries',
      show: checkPermission('canClockInOut')
    }
  ];

  return (
    <div className="dashboard-layout">
      <Navbar user={user} onLogout={handleLogout} />
      <div className="dashboard-content">
        <Sidebar />
        <main className="main-content">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout; 