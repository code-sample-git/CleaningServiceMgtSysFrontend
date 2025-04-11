import React from 'react';
import ManagerDashboard from '../../components/ManagerDashboard';

const ManagerDashboardPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-800">
          Manager Dashboard
        </h1>
        <ManagerDashboard />
      </div>
    </div>
  );
};

export default ManagerDashboardPage;
