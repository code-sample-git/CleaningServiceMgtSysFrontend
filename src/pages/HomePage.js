import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { inventoryService, supplyService } from "../services/mockData";
import "../styles/global.css";

function HomePage() {
  const [userData, setUserData] = useState(null);
  const [inventory, setInventory] = useState([]);
  const [supplies, setSupplies] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    const loadData = () => {
      try {
        setUserData(user);
        setInventory(inventoryService.getAll());
        setSupplies(supplyService.getAll());
      } catch (err) {
        setError("Failed to load data");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [user]);

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
            <h3>Inventory Overview</h3>
            <p><strong>Total Items:</strong> {inventory.length}</p>
            <p><strong>Low Stock Items:</strong> {inventory.filter(item => item.quantity < 5).length}</p>
            <button onClick={() => navigate("/inventory")}>Manage Inventory</button>
          </div>

          <div className="card">
            <h3>Supplies Overview</h3>
            <p><strong>Total Items:</strong> {supplies.length}</p>
            <p><strong>Items Needing Maintenance:</strong> {supplies.filter(item => item.condition !== 'good').length}</p>
            <button onClick={() => navigate("/supply")}>Manage Supplies</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
