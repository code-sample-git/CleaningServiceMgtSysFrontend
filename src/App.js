import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage"; // Add forgot password
import RegisterPage from "./pages/RegisterPage"; // Import Register Page

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/register" element={<RegisterPage />} /> {/* Register Route */}
        <Route path="*" element={<LoginPage />} /> {/* Default to Login */}
      </Routes>
    </Router>
  );
};

export default App;
