import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { inventoryService } from "../services/mockData";
import "../styles/global.css";

function InventoryPage() {
  const [inventory, setInventory] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [newItem, setNewItem] = useState({ name: "", quantity: "", unit: "" });
  const navigate = useNavigate();

  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = () => {
    try {
      const items = inventoryService.getAll();
      setInventory(items);
    } catch (err) {
      setError("Failed to load inventory");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddItem = (e) => {
    e.preventDefault();
    try {
      inventoryService.add(newItem);
      setNewItem({ name: "", quantity: "", unit: "" });
      loadInventory();
    } catch (err) {
      setError("Failed to add item");
    }
  };

  const handleUpdateItem = (id, updates) => {
    try {
      inventoryService.update(id, updates);
      loadInventory();
    } catch (err) {
      setError("Failed to update item");
    }
  };

  const handleDeleteItem = (id) => {
    try {
      inventoryService.delete(id);
      loadInventory();
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
        <h1 className="page-title">Inventory Management</h1>
        
        {error && <p className="error">{error}</p>}

        <div className="card">
          <h3>Add New Item</h3>
          <form onSubmit={handleAddItem}>
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                value={newItem.name}
                onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                required
                placeholder="Item name"
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
              <label>Unit</label>
              <input
                type="text"
                value={newItem.unit}
                onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
                required
                placeholder="Unit (e.g., liters, pieces)"
              />
            </div>
            <button type="submit">Add Item</button>
          </form>
        </div>

        <div className="card">
          <h3>Current Inventory</h3>
          <div className="grid">
            {inventory.map((item) => (
              <div key={item.id} className="card">
                <h4>{item.name}</h4>
                <p><strong>Quantity:</strong> {item.quantity} {item.unit}</p>
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

export default InventoryPage; 