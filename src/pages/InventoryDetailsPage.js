import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../components/layout/DashboardLayout";
import { inventoryService } from "../services/mockData";
import { useRole } from "../context/RoleContext";

function InventoryDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { checkPermission } = useRole();
  const [item, setItem] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadItemDetails();
  }, [id]);

  const loadItemDetails = async () => {
    try {
      const itemId = parseInt(id, 10);
      const result = await inventoryService.getById(itemId);
      if (result) {
        setItem(result);
      } else {
        setError("Inventory item not found");
      }
    } catch (err) {
      setError("Failed to load inventory item details");
    } finally {
      setIsLoading(false);
    }
  };

  const getStockStatus = (quantity, minQuantity) => {
    if (quantity <= 0) return "Out of Stock";
    if (quantity <= minQuantity) return "Low Stock";
    return "In Stock";
  };

  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case "out of stock":
        return "status-danger";
      case "low stock":
        return "status-warning";
      case "in stock":
        return "status-success";
      default:
        return "status-default";
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="loading">Loading inventory details...</div>
      </DashboardLayout>
    );
  }

  if (!item) {
    return (
      <DashboardLayout>
        <div className="error-message">{error}</div>
        <button className="button" onClick={() => navigate("/inventory")}>
          Back to Inventory
        </button>
      </DashboardLayout>
    );
  }

  const stockStatus = getStockStatus(item.quantity, item.minQuantity);

  return (
    <DashboardLayout>
      <div className="page-content">
        <div className="page-header">
          <h1>Inventory Details</h1>
          <button className="button" onClick={() => navigate("/inventory")}>
            Back to Inventory
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="card">
          <div className="details-grid">
            <div className="detail-item">
              <label>Item Name:</label>
              <span>{item.name}</span>
            </div>
            <div className="detail-item">
              <label>Category:</label>
              <span>{item.category}</span>
            </div>
            <div className="detail-item">
              <label>Current Quantity:</label>
              <span>{item.quantity}</span>
            </div>
            <div className="detail-item">
              <label>Minimum Quantity:</label>
              <span>{item.minQuantity}</span>
            </div>
            <div className="detail-item">
              <label>Unit:</label>
              <span>{item.unit}</span>
            </div>
            <div className="detail-item">
              <label>Status:</label>
              <span className={`status-tag ${getStatusClass(stockStatus)}`}>
                {stockStatus}
              </span>
            </div>
          </div>

          <div className="form-actions">
            {checkPermission('canManageInventory') && (
              <button
                className="btn-primary"
                onClick={() => navigate(`/inventory/${item.id}/edit`)}
              >
                Edit Item
              </button>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default InventoryDetailsPage; 