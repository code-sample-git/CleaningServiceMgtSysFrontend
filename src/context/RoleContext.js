import React, { createContext, useContext } from 'react';
import { useAuth } from './AuthContext';

const RoleContext = createContext(null);

const rolePermissions = {
  admin: {
    canManageUsers: true,
    canManageLocations: true,
    canManageTasks: true,
    canViewReports: true,
    canCreateReports: true,
    canManageInventory: true,
    canApproveRequests: true,
    canManageProposals: true,
    canRequestService: true,
    canViewDashboard: true
  },
  manager: {
    canManageUsers: false,
    canManageLocations: true,
    canManageTasks: true,
    canViewReports: true,
    canCreateReports: true,
    canManageInventory: true,
    canApproveRequests: true,
    canManageProposals: true,
    canRequestService: true,
    canViewDashboard: true
  },
  staff: {
    canManageUsers: false,
    canManageLocations: false,
    canManageTasks: false,
    canViewReports: false,
    canCreateReports: false,
    canManageInventory: false,
    canApproveRequests: false,
    canManageProposals: false,
    canClockInOut: true,
    canRequestSupplies: true,
    canViewAssignedTasks: true,
    canRequestService: true,
    canViewDashboard: true
  },
  client: {
    canManageUsers: false,
    canManageLocations: false,
    canManageTasks: false,
    canViewReports: true,
    canCreateReports: false,
    canManageInventory: false,
    canApproveRequests: false,
    canManageProposals: false,
    canViewLocations: true,
    canRequestService: true,
    canViewDashboard: true
  }
};

export const RoleProvider = ({ children }) => {
  const { user, loading } = useAuth();
  
  const checkPermission = (permission) => {
    if (loading || !user) return false;
    const userRole = user.role || 'staff';
    return rolePermissions[userRole]?.[permission] || false;
  };

  const value = {
    checkPermission,
    userRole: user?.role || 'staff'
  };

  return (
    <RoleContext.Provider value={value}>
      {!loading && children}
    </RoleContext.Provider>
  );
};

export const useRole = () => {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
}; 