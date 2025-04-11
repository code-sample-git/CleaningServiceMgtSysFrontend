import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext'; // Custom hook for managing user authentication
import ProtectedRoute from './components/ProtectedRoute'; // ProtectedRoute for private routes

import LoginPage from './pages/LoginPage'; // Login page
import ManagerDashboard from './pages/Manager/ManagerDashboard'; // Manager Dashboard page
import LocationsPage from './pages/Manager/LocationsPage'; // Locations page

const AppRoutes = () => {
  const { user, loading } = useAuth(); // Get the current authenticated user from context

  if (loading) {
    return <div>Loading...</div>; // Show a loading indicator until the user data is fetched
  }

  return (
    <Routes>
      {/* Public route for login */}
      <Route path="/login" element={<LoginPage />} />
      
      {/* Protected route for Manager Dashboard */}
      <Route
        path="/manager-dashboard"
        element={
          <ProtectedRoute>
            {user?.role === 'manager' ? <ManagerDashboard /> : <Navigate to="/" />}
          </ProtectedRoute>
        }
      />
      
      {/* Protected route for Locations page */}
      <Route
        path="/locations"
        element={
          <ProtectedRoute>
            {user?.role === 'manager' ? <LocationsPage /> : <Navigate to="/" />}
          </ProtectedRoute>
        }
      />
      
      {/* Catch-all route that redirects to login if no matching route */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
};

export default AppRoutes;
