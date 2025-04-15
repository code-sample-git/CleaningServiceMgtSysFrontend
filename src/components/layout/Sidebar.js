import React from 'react';
import { NavLink } from 'react-router-dom';
import { useRole } from '../../context/RoleContext';

const Sidebar = () => {
  const { checkPermission } = useRole();

  const menuItems = [
    {
      label: 'Dashboard',
      path: '/home',
      permission: 'canViewDashboard'
    },
    {
      label: 'Staff',
      path: '/staff',
      permission: 'canManageUsers'
    },
    {
      label: 'Clients',
      path: '/clients',
      permission: 'canRequestService'
    },
    {
      label: 'Locations',
      path: '/locations',
      permission: 'canRequestService'
    },
    {
      label: 'Tasks',
      path: '/tasks',
      permission: 'canManageTasks'
    },
    {
      label: 'QA Reports',
      path: '/reports',
      permission: 'canViewReports'
    },
    {
      label: 'Inventory',
      path: '/inventory',
      permission: 'canManageInventory'
    },
    {
      label: 'Supplies',
      path: '/supply',
      permission: 'canManageInventory'
    },
    {
      label: 'Service',
      path: '/service',
      permission: 'canRequestService'
    },
    {
      label: 'Feedback',
      path: '/feedback',
      permission: 'canRequestService'
    }
  ];

  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          checkPermission(item.permission) && (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? 'active' : ''}`
              }
            >
              {item.label}
            </NavLink>
          )
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar; 