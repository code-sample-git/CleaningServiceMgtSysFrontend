import React from 'react';
import { NavLink } from 'react-router-dom';
import { useRole } from '../../context/RoleContext';

const Sidebar = () => {
  const { checkPermission } = useRole();

  const menuItems = [
    {
      label: 'Dashboard',
      path: '/home',
      permission: 'canManageUsers'
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
      permission: 'canManageLocations'
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