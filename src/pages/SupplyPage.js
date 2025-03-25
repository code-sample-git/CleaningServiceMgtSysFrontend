import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supplyService } from "../services/mockData";
import "../styles/global.css";

function SupplyPage() {
  const [supplies, setSupplies] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [newItem, setNewItem] = useState({ name: "", quantity: "", condition: "good" });
  const navigate = useNavigate();

  useEffect(() => {
    loadSupplies();
  }, []);

  const loadSupplies = () => {
    try {
      const items = supplyService.getAll();
      setSupplies(items);
    } catch (err) {
      setError("Failed to load supplies");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddItem = (e) => {
    e.preventDefault();
    try {
      supplyService.add(newItem);
      setNewItem({ name: "", quantity: "", condition: "good" });
      loadSupplies();
    } catch (err) {
      setError("Failed to add item");
    }
  };

  const handleUpdateItem = (id, updates) => {
    try {
      supplyService.update(id, updates);
      loadSupplies();
    } catch (err) {
      setError("Failed to update item");
    }
  };

  const handleDeleteItem = (id) => {
    try {
      supplyService.delete(id);
      loadSupplies();
    } catch (err) {
      setError("Failed to delete item");
    }
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
            <button onClick={() => navigate("/home")} className="link-button">
              Back to Dashboard
            </button>
          </div>
        </div>
      </nav>

      <div className="container">
        <h1 className="page-title">Supply Management</h1>
        
        {error && <p className="error">{error}</p>}

        <div className="card">
          <h3>Add New Supply</h3>
          <form onSubmit={handleAddItem}>
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                value={newItem.name}
                onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                required
                placeholder="Supply name"
              />
            </div>
            <div className="form-group">
              <label>Quantity</label>
              <input
                type="number"
                value={newItem.quantity}
                onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value) })}
                required
                min="0"
                placeholder="Quantity"
              />
            </div>
            <div className="form-group">
              <label>Condition</label>
              <select
                value={newItem.condition}
                onChange={(e) => setNewItem({ ...newItem, condition: e.target.value })}
                required
              >
                <option value="good">Good</option>
                <option value="fair">Fair</option>
                <option value="poor">Poor</option>
                <option value="needs_replacement">Needs Replacement</option>
              </select>
            </div>
            <button type="submit">Add Supply</button>
          </form>
        </div>

        <div className="card">
          <h3>Current Supplies</h3>
          <div className="grid">
            {supplies.map((item) => (
              <div key={item.id} className="card">
                <h4>{item.name}</h4>
                <p><strong>Quantity:</strong> {item.quantity}</p>
                <p><strong>Condition:</strong> {item.condition}</p>
                <p><strong>Last Updated:</strong> {item.lastUpdated}</p>
                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                  <button
                    onClick={() => handleUpdateItem(item.id, { quantity: item.quantity + 1 })}
                  >
                    +
                  </button>
                  <button
                    onClick={() => handleUpdateItem(item.id, { quantity: Math.max(0, item.quantity - 1) })}
                  >
                    -
                  </button>
                  <select
                    value={item.condition}
                    onChange={(e) => handleUpdateItem(item.id, { condition: e.target.value })}
                    style={{ flex: 1 }}
                  >
                    <option value="good">Good</option>
                    <option value="fair">Fair</option>
                    <option value="poor">Poor</option>
                    <option value="needs_replacement">Needs Replacement</option>
                  </select>
                  <button
                    onClick={() => handleDeleteItem(item.id)}
                    style={{ backgroundColor: 'var(--danger-color)' }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SupplyPage; 