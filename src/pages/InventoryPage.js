import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/layout/DashboardLayout";
import { inventoryService } from "../services/mockData";
import { useRole } from "../context/RoleContext";
import "../styles/global.css";

function InventoryPage() {
  const [inventory, setInventory] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { checkPermission } = useRole();

  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = async () => {
    try {
      const result = await inventoryService.getAll();
      setInventory(result);
    } catch (err) {
      setError("Failed to load inventory");
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewItem = (id) => {
    navigate(`/inventory/${id}`);
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="loading">Loading inventory...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="page-content">
        <div className="page-header">
          <h1>Inventory</h1>
          {checkPermission('canManageInventory') && (
            <button 
              className="btn-primary"
              onClick={() => navigate('/inventory/add')}
            >
              Add Item
            </button>
          )}
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="stats-row">
          <div className="stat-card">
            <h3>Total Items</h3>
            <div className="stat-value">{inventory.length}</div>
          </div>
          <div className="stat-card">
            <h3>Low Stock Items</h3>
            <div className="stat-value">
              {inventory.filter(item => item.quantity <= item.minQuantity).length}
            </div>
          </div>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Item Name</th>
                <th>Category</th>
                <th>Quantity</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {inventory.map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{item.category}</td>
                  <td>{item.quantity} {item.unit}</td>
                  <td>
                    <span className={`status-tag ${item.quantity <= item.minQuantity ? 'status-warning' : 'status-success'}`}>
                      {item.quantity <= item.minQuantity ? 'Low Stock' : 'In Stock'}
                    </span>
                  </td>
                  <td>
                    <button className="btn-view" onClick={() => handleViewItem(item.id)}>
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default InventoryPage; 