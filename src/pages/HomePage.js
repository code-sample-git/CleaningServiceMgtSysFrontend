import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getProfile } from '../utils/api';
import { inventoryService, supplyService } from "../services/mockData";
import "../styles/global.css";

function HomePage() {
  const navigate = useNavigate();
  const { user: contextUser, logout } = useAuth();

  const [profile, setProfile] = useState(null);
  const [inventory, setInventory] = useState([]);
  const [supplies, setSupplies] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const { data } = await getProfile(); // API profile fetch
        setProfile(data);
        setInventory(inventoryService.getAll());
        setSupplies(supplyService.getAll());
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("Failed to load profile.");
        if (err.response?.status === 401) {
          logout(); // uses context-based logout logic
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboard();
  }, [navigate]);

  const handleLogout = () => {
    logout(); // Uses context logout
    navigate("/login");
  };

  if (isLoading || !profile) {
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
          <a href="/home" className="navbar-brand">Cleaning Service Management</a>
          <div className="navbar-menu">
            <span className="navbar-link">Welcome, {profile.firstName}</span>
            <button onClick={handleLogout} className="link-button">Logout</button>
          </div>
        </div>
      </nav>

      <div className="container">
        <h1 className="page-title">Dashboard</h1>
        {error && <p className="error">{error}</p>}

        <div className="grid">
          <div className="card">
            <h3>Profile Information</h3>
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg"
              alt="Profile"
              className="profile-image"
              style={{ width: "80px", borderRadius: "50%", marginBottom: "10px" }}
            />
            <p><strong>Name:</strong> {profile.firstName} {profile.lastName}</p>
            <p><strong>Email:</strong> {profile.email}</p>
            <p><strong>Phone:</strong> {profile.phoneNumber || 'Not provided'}</p>
            <p><strong>Role:</strong> {profile.role}</p>
          </div>

          <div className="card">
            <h3>Inventory Overview</h3>
            <p><strong>Total Items:</strong> {inventory.length}</p>
            <p><strong>Low Stock Items:</strong> {inventory.filter(item => item.quantity < 5).length}</p>
            <button onClick={() => navigate("/inventory")}>Manage Inventory</button>
          </div>

          <div className="card">
            <h3>Supplies Overview</h3>
            <p><strong>Total Items:</strong> {supplies.length}</p>
            <p><strong>Needs Maintenance:</strong> {supplies.filter(item => item.condition !== 'good').length}</p>
            <button onClick={() => navigate("/supply")}>Manage Supplies</button>
          </div>
        </div>

        <div style={{ marginTop: "2rem" }}>
          <button onClick={() => navigate("/dashboard")}>View Full Dashboard</button>
          <button onClick={() => navigate("/locations")}>Go to Locations</button>
          <button onClick={() => navigate("/reports")}>View QA Reports</button>
          <button onClick={() => navigate("/settings")}>Settings</button>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
