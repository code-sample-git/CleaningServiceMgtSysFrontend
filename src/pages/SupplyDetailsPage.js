import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../components/layout/DashboardLayout";
import { supplyService } from "../services/mockData";

function SupplyDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [supply, setSupply] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSupplyDetails();
  }, [id]);

  const loadSupplyDetails = async () => {
    try {
      const supplyId = parseInt(id, 10);
      const result = await supplyService.getById(supplyId);
      if (result) {
        setSupply(result);
      } else {
        setError('Supply not found');
      }
    } catch (err) {
      setError('Failed to load supply details');
    } finally {
      setIsLoading(false);
    }
  };

  const getConditionClass = (condition) => {
    switch (condition.toLowerCase()) {
      case "good":
        return "status-success";
      case "needs maintenance":
        return "status-warning";
      case "needs replacement":
      case "broken":
        return "status-danger";
      default:
        return "status-default";
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="loading">Loading supply details...</div>
      </DashboardLayout>
    );
  }

  if (!supply) {
    return (
      <DashboardLayout>
        <div className="error-message">Supply not found</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="page-content">
        <div className="page-header">
          <h1>Supply Details</h1>
          <button className="btn-secondary" onClick={() => navigate("/supply")}>
            Back to Supplies
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="card">
          <div className="details-grid">
            <div className="detail-item">
              <label>Equipment Name:</label>
              <span>{supply.name}</span>
            </div>
            <div className="detail-item">
              <label>Condition:</label>
              <span className={`status-tag ${getConditionClass(supply.condition)}`}>
                {supply.condition}
              </span>
            </div>
            <div className="detail-item">
              <label>Assigned To:</label>
              <span>{supply.assignedTo || "Not assigned"}</span>
            </div>
            <div className="detail-item">
              <label>Notes:</label>
              <span>{supply.notes || "No notes available"}</span>
            </div>
          </div>

          <div className="form-actions">
            <button
              className="btn-primary"
              onClick={() => navigate(`/supply/edit/${supply.id}`)}
            >
              Edit Supply
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default SupplyDetailsPage; 