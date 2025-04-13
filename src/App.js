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
import InventoryDetailsPage from "./pages/InventoryDetailsPage";
import AddItemPage from "./pages/AddItemPage";
import EditItemPage from "./pages/EditItemPage";
import SupplyPage from "./pages/SupplyPage";

// Location Management
import LocationsPage from "./pages/locations/LocationsPage";
import LocationDetailsPage from "./pages/locations/LocationDetailsPage";
import AddLocationPage from "./pages/locations/AddLocationPage";
import EditLocationPage from "./pages/locations/EditLocationPage";

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
import AddStaffPage from "./pages/staff/AddStaffPage";
import EditStaffPage from "./pages/staff/EditStaffPage";
import ClockInPage from './pages/staff/ClockInPage';
import TimeEntryDetailsPage from './pages/staff/TimeEntryDetailsPage';

// Client Management
import ClientsPage from "./pages/clients/ClientsPage";
import ClientDetailsPage from "./pages/clients/ClientDetailsPage";
import AddClientPage from "./pages/clients/AddClientPage";
import ProposalsPage from "./pages/clients/ProposalsPage";
import CreateProposalPage from "./pages/clients/CreateProposalPage";
import ProposalDetailsPage from "./pages/clients/ProposalDetailsPage";
import EditProposalPage from "./pages/clients/EditProposalPage";

// Supply Management
import AddSupplyPage from "./pages/AddSupplyPage";
import SupplyDetailsPage from "./pages/SupplyDetailsPage";
import EditSupplyPage from "./pages/EditSupplyPage";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      {/* Protected Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Navigate to="/home" replace />
          </ProtectedRoute>
        }
      />

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
      <Route
        path="/supply/add"
        element={
          <ProtectedRoute>
            <AddSupplyPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/supply/:id"
        element={
          <ProtectedRoute>
            <SupplyDetailsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/supply/edit/:id"
        element={
          <ProtectedRoute>
            <EditSupplyPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/inventory/:id"
        element={
          <ProtectedRoute>
            <InventoryDetailsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/inventory/add"
        element={
          <ProtectedRoute>
            <AddItemPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/inventory/:id/edit"
        element={
          <ProtectedRoute>
            <EditItemPage />
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
        path="/locations/add"
        element={
          <ProtectedRoute>
            <AddLocationPage />
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
        path="/locations/:id/edit"
        element={
          <ProtectedRoute>
            <EditLocationPage />
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
        path="/tasks/add"
        element={
          <ProtectedRoute>
            <AddTaskPage />
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
        path="/staff/add"
        element={
          <ProtectedRoute>
            <AddStaffPage />
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
        path="/staff/:id/edit"
        element={
          <ProtectedRoute>
            <EditStaffPage />
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

      {/* Time Entry Routes */}
      <Route
        path="/time-entries"
        element={
          <ProtectedRoute>
            <TimeEntriesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/time-entries/clock-in"
        element={
          <ProtectedRoute>
            <ClockInPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/time-entries/:id"
        element={
          <ProtectedRoute>
            <TimeEntryDetailsPage />
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
        path="/clients/add"
        element={
          <ProtectedRoute>
            <AddClientPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/proposals"
        element={
          <ProtectedRoute>
            <ProposalsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/proposals/create"
        element={
          <ProtectedRoute>
            <CreateProposalPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/proposals/:id"
        element={
          <ProtectedRoute>
            <ProposalDetailsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/proposals/:id/edit"
        element={
          <ProtectedRoute>
            <EditProposalPage />
          </ProtectedRoute>
        }
      />

      {/* Catch all route - redirect to home if authenticated, login if not */}
      <Route
        path="*"
        element={
          <ProtectedRoute>
            <Navigate to="/home" replace />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <RoleProvider>
          <AppRoutes />
        </RoleProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
