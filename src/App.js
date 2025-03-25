import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { RoleProvider } from "./context/RoleContext";
import ProtectedRoute from "./components/ProtectedRoute";

// Auth Pages
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";

// Main Pages
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

const AppRoutes = () => {
  return (
    <Routes>
      {/* Auth Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      {/* Protected Routes */}
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />

      {/* Inventory Routes */}
      <Route
        path="/inventory"
        element={
          <ProtectedRoute>
            <InventoryPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/supply"
        element={
          <ProtectedRoute>
            <SupplyPage />
          </ProtectedRoute>
        }
      />

      {/* Location Routes */}
      <Route
        path="/locations"
        element={
          <ProtectedRoute>
            <LocationsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/locations/:id"
        element={
          <ProtectedRoute>
            <LocationDetailsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/locations/add"
        element={
          <ProtectedRoute>
            <AddLocationPage />
          </ProtectedRoute>
        }
      />

      {/* Task Routes */}
      <Route
        path="/tasks"
        element={
          <ProtectedRoute>
            <TasksPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/tasks/:id"
        element={
          <ProtectedRoute>
            <TaskDetailsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/tasks/add"
        element={
          <ProtectedRoute>
            <AddTaskPage />
          </ProtectedRoute>
        }
      />

      {/* QA Report Routes */}
      <Route
        path="/reports"
        element={
          <ProtectedRoute>
            <QAReportsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/reports/create"
        element={
          <ProtectedRoute>
            <CreateQAReportPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/reports/:id"
        element={
          <ProtectedRoute>
            <ReportDetailsPage />
          </ProtectedRoute>
        }
      />

      {/* Staff Routes */}
      <Route
        path="/staff"
        element={
          <ProtectedRoute>
            <StaffPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/staff/:id"
        element={
          <ProtectedRoute>
            <StaffDetailsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/staff/:id/time-entries"
        element={
          <ProtectedRoute>
            <TimeEntriesPage />
          </ProtectedRoute>
        }
      />

      {/* Client Routes */}
      <Route
        path="/clients"
        element={
          <ProtectedRoute>
            <ClientsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/clients/:id"
        element={
          <ProtectedRoute>
            <ClientDetailsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/clients/:id/proposals"
        element={
          <ProtectedRoute>
            <ProposalsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/clients/:id/proposals/create"
        element={
          <ProtectedRoute>
            <CreateProposalPage />
          </ProtectedRoute>
        }
      />

      {/* Default Route */}
      <Route path="/" element={<Navigate to="/home" />} />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <RoleProvider>
        <Router>
          <AppRoutes />
        </Router>
      </RoleProvider>
    </AuthProvider>
  );
};

export default App;
