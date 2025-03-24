import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "../styles/global.css";

function HomePage() {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get("http://localhost:5000/api/users/profile", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUserData(response.data);
      } catch (err) {
        setError("Failed to load user data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (isLoading) {
    return (
      <div className="container">
        <div className="card">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <nav className="navbar">
        <div className="navbar-content">
          <a href="/home" className="navbar-brand">
            Cleaning Service Management
          </a>
          <div className="navbar-menu">
            <span className="navbar-link">Welcome, {userData?.firstName}</span>
            <button onClick={handleLogout} className="link-button">
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="container">
        <h1 className="page-title">Dashboard</h1>
        
        {error && <p className="error">{error}</p>}
        
        <div className="grid">
          <div className="card">
            <h3>Profile Information</h3>
            <p><strong>Name:</strong> {userData?.firstName} {userData?.lastName}</p>
            <p><strong>Email:</strong> {userData?.email}</p>
            <p><strong>Role:</strong> {userData?.role}</p>
          </div>

          <div className="card">
            <h3>Quick Actions</h3>
            <button onClick={() => navigate("/inventory")}>Manage Inventory</button>
            <button onClick={() => navigate("/supply")}>Manage Supplies</button>
          </div>

          <div className="card">
            <h3>Recent Activity</h3>
            <p>No recent activity to display</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
