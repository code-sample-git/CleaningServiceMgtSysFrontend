import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { RoleProvider } from "./context/RoleContext";
import ProtectedRoute from "./components/ProtectedRoute";

import './App.css';

// Auth Pages
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";

// Main Pages
import HomePage from "./pages/HomePage";
import DashboardPage from "./pages/DashboardPage";
import InventoryPage from "./pages/InventoryPage";
import SupplyPage from "./pages/SupplyPage";

// Location Management
import LocationsPage from "./pages/locations/LocationsPage";
import LocationDetailsPage from "./pages/locations/LocationDetailsPage";
import AddLocationPage from "./pages/locations/AddLocationPage";

// Task Management
import TasksPage from "./pages/tasks/TasksPage";
import TaskDetailsPage from "./pages/tasks/TaskDetailsPage";
import AddTaskPage from "./pages/tasks/AddTaskPage";

// QA Reports
import QAReportsPage from "./pages/reports/QAReportsPage";
import CreateQAReportPage from "./pages/reports/CreateQAReportPage";
import ReportDetailsPage from "./pages/reports/ReportDetailsPage";

// Staff Management
import StaffPage from "./pages/staff/StaffPage";
import StaffDetailsPage from "./pages/staff/StaffDetailsPage";
import TimeEntriesPage from "./pages/staff/TimeEntriesPage";

// Client Management
import ClientsPage from "./pages/clients/ClientsPage";
import ClientDetailsPage from "./pages/clients/ClientDetailsPage";
import ProposalsPage from "./pages/clients/ProposalsPage";
import CreateProposalPage from "./pages/clients/CreateProposalPage";

// Client Service Request
import ServicePage from "./pages/service/ServicePage";
import AddServicePage from "./pages/service/AddServicePage";
import ServiceDetailsPage from "./pages/service/ServiceDetailsPage";
import EditServicePage from "./pages/service/EditServicePage";

// Feedback
import FeedbackPage from "./pages/feedback/FeedbackPage";

// Manager Dashboard Page 
import ManagerDashboardPage from "./pages/Manager/ManagerDashboardPage"; 

const AppRoutes = () => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading session...</div>;

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

      {/* Protected Routes */}
      <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
      <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      <Route path="/inventory" element={<ProtectedRoute><InventoryPage /></ProtectedRoute>} />
      <Route path="/supply" element={<ProtectedRoute><SupplyPage /></ProtectedRoute>} />

      <Route path="/locations" element={<ProtectedRoute><LocationsPage /></ProtectedRoute>} />
      <Route path="/locations/:id" element={<ProtectedRoute><LocationDetailsPage /></ProtectedRoute>} />
      <Route path="/locations/add" element={<ProtectedRoute><AddLocationPage /></ProtectedRoute>} />

      <Route path="/tasks" element={<ProtectedRoute><TasksPage /></ProtectedRoute>} />
      <Route path="/tasks/:id" element={<ProtectedRoute><TaskDetailsPage /></ProtectedRoute>} />
      <Route path="/tasks/add" element={<ProtectedRoute><AddTaskPage /></ProtectedRoute>} />

      <Route path="/reports" element={<ProtectedRoute><QAReportsPage /></ProtectedRoute>} />
      <Route path="/reports/create" element={<ProtectedRoute><CreateQAReportPage /></ProtectedRoute>} />
      <Route path="/reports/:id" element={<ProtectedRoute><ReportDetailsPage /></ProtectedRoute>} />

      <Route path="/staff" element={<ProtectedRoute><StaffPage /></ProtectedRoute>} />
      <Route path="/staff/:id" element={<ProtectedRoute><StaffDetailsPage /></ProtectedRoute>} />
      <Route path="/staff/:id/time-entries" element={<ProtectedRoute><TimeEntriesPage /></ProtectedRoute>} />

      <Route path="/clients" element={<ProtectedRoute><ClientsPage /></ProtectedRoute>} />
      <Route path="/clients/:id" element={<ProtectedRoute><ClientDetailsPage /></ProtectedRoute>} />
      <Route path="/clients/:id/proposals" element={<ProtectedRoute><ProposalsPage /></ProtectedRoute>} />
      <Route path="/clients/:id/proposals/create" element={<ProtectedRoute><CreateProposalPage /></ProtectedRoute>} />

      <Route path="/service" element={<ProtectedRoute><ServicePage /></ProtectedRoute>} />
      <Route path="/service/add" element={<ProtectedRoute><AddServicePage /></ProtectedRoute>} />
      <Route path="/service/:id" element={<ProtectedRoute><ServiceDetailsPage /></ProtectedRoute>} />
      <Route path="/service/:id/edit" element={<ProtectedRoute><EditServicePage /></ProtectedRoute>} />

      <Route path="/feedback" element={<ProtectedRoute><FeedbackPage /></ProtectedRoute>} />
      
      {/* Manager Dashboard (Protected Route) */}
      <Route
        path="/manager-dashboard"
        element={
          <ProtectedRoute>
            {user?.role === 'manager' ? <ManagerDashboardPage /> : <Navigate to="/dashboard" />}
          </ProtectedRoute>
        }
      />

      {/* Redirects */}
      <Route path="/" element={<Navigate to="/home" />} />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <RoleProvider>
        <Router>
          <AppRoutes />
        </Router>
      </RoleProvider>
    </AuthProvider>
  );
}

export default App;
