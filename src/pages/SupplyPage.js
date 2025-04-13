import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/layout/DashboardLayout";
import { supplyService } from "../services/mockData";
import "../styles/global.css";

function SupplyPage() {
  const navigate = useNavigate();
  const [supplies, setSupplies] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSupplies();
  }, []);

  const loadSupplies = async () => {
    try {
      const result = await supplyService.getAll();
      setSupplies(result);
    } catch (err) {
      setError("Failed to load supplies");
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewSupply = (id) => {
    navigate(`/supply/${id}`);
  };

  const handleAddSupply = () => {
    navigate('/supply/add');
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
        <div className="loading">Loading supplies...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="page-content">
        <div className="page-header">
          <h1>Supplies</h1>
          <button className="btn-primary" onClick={handleAddSupply}>
            Add Supply
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="stats-row">
          <div className="stat-card">
            <h3>Total Equipment</h3>
            <div className="stat-value">{supplies.length}</div>
          </div>
          <div className="stat-card">
            <h3>Good Condition</h3>
            <div className="stat-value">
              {supplies.filter(supply => supply.condition.toLowerCase() === 'good').length}
            </div>
          </div>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Equipment Name</th>
                <th>Condition</th>
                <th>Assigned To</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {supplies.map((supply) => (
                <tr key={supply.id}>
                  <td>{supply.name}</td>
                  <td>
                    <span className={`status-tag ${getConditionClass(supply.condition)}`}>
                      {supply.condition}
                    </span>
                  </td>
                  <td>{supply.assignedTo}</td>
                  <td>
                    <button className="btn-view" onClick={() => handleViewSupply(supply.id)}>
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

export default SupplyPage; 