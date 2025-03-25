import React from 'react';

const StatusTag = ({ status, className }) => {
  const getStatusClass = () => {
    switch (status.toLowerCase()) {
      case 'active':
      case 'completed':
      case 'approved':
        return 'status-active';
      case 'pending':
      case 'in progress':
      case 'in review':
        return 'status-pending';
      case 'inactive':
      case 'cancelled':
      case 'rejected':
        return 'status-inactive';
      default:
        return '';
    }
  };

  return (
    <span className={`status-tag ${getStatusClass()} ${className || ''}`}>
      {status}
    </span>
  );
};

export default StatusTag; 