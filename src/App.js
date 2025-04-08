import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import RegisterPage from "./pages/RegisterPage";
import { getProfile } from './utils/api'; // Import API utility
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const restoreSession = async () => {
      const accessToken = localStorage.getItem('accessToken');
      if (accessToken) {
        try {
          const { data } = await getProfile();
          setUser({
            email: data.email,
            name: `${data.firstName} ${data.lastName}`,
            profileImage: "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg",
          });
        } catch (err) {
          // If token is invalid or expired, clear storage and redirect to login
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
        }
      }
      setLoading(false);
    };
    restoreSession();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage setUser={setUser} />} />
        <Route path="/register" element={<RegisterPage setUser={setUser} />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
        <Route
          path="/home"
          element={user ? <HomePage user={user} /> : <Navigate to="/login" />}
        />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;