import React from 'react';
import { NavLink } from 'react-router-dom';
import { useRole } from '../../context/RoleContext';

const Sidebar = () => {
  const { checkPermission, userRole } = useRole();

  const menuItems = [
    {
      label: 'Dashboard',
      path: '/home',
      permission: true // Everyone can see dashboard
    },
    {
      label: 'Staff',
      path: '/staff',
      permission: 'canManageUsers'
    },
    {
      label: 'Clients',
      path: '/clients',
      permission: 'canManageUsers'
    },
    {
      label: 'Locations',
      path: '/locations',
      permission: ['canManageLocations', 'canViewLocations']
    },
    {
      label: 'Tasks',
      path: '/tasks',
      permission: ['canManageTasks', 'canViewAssignedTasks']
    },
    {
      label: 'QA Reports',
      path: '/reports',
      permission: ['canViewReports', 'canCreateReports']
    },
    {
      label: 'Inventory',
      path: '/inventory',
      permission: 'canManageInventory'
    },
    {
      label: 'Supplies',
      path: '/supply',
      permission: ['canManageInventory', 'canRequestSupplies']
    }
  ];

  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        {menuItems.map((item) => {
          const hasPermission = item.permission === true || 
            (Array.isArray(item.permission) 
              ? item.permission.some(p => checkPermission(p))
              : checkPermission(item.permission));

          return hasPermission && (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? 'active' : ''}`
              }
            >
              {item.label}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar; 