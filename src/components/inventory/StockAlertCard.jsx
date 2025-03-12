import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { resolveStockAlert } from '../../services/inventoryService';

const StockAlertCard = ({ alert }) => {
  const [isResolving, setIsResolving] = useState(false);
  const [resolution, setResolution] = useState('');
  const [error, setError] = useState(null);
  const [resolved, setResolved] = useState(false);

  const getUrgencyClass = () => {
    switch (alert.urgency) {
      case 'critical': return 'urgency-critical';
      case 'high': return 'urgency-high';
      case 'medium': return 'urgency-medium';
      case 'low': return 'urgency-low';
      default: return '';
    }
  };

  const getDaysAgo = () => {
    const alertDate = new Date(alert.detectedAt);
    const today = new Date();
    const diffTime = Math.abs(today - alertDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleResolve = async () => {
    try {
      await resolveStockAlert(alert.id, resolution);
      setResolved(true);
      setIsResolving(false);
    } catch (err) {
      setError('Failed to resolve alert');
    }
  };

  if (resolved) {
    return (
      <div className="stock-alert-card resolved">
        <div className="alert-header">
          <h3>{alert.item.name} - Resolved</h3>
        </div>
        <p>This alert has been resolved.</p>
      </div>
    );
  }

  return (
    <div className={`stock-alert-card ${getUrgencyClass()}`}>
      <div className="alert-header">
        <h3>{alert.item.name}</h3>
        <span className={`urgency-badge ${getUrgencyClass()}`}>
          {alert.urgency.toUpperCase()}
        </span>
      </div>
      
      <div className="alert-body">
        <div className="alert-info">
          <p><strong>Location:</strong> {alert.location}</p>
          <p><strong>Current Stock:</strong> {alert.currentStock} {alert.item.unit}</p>
          <p><strong>Threshold:</strong> {alert.threshold} {alert.item.unit}</p>
          <p><strong>Detected:</strong> {getDaysAgo()} days ago</p>
        </div>
        
        {error && <p className="error-message">{error}</p>}
        
        {isResolving ? (
          <div className="resolution-form">
            <textarea
              value={resolution}
              onChange={(e) => setResolution(e.target.value)}
              placeholder="Describe how this alert was resolved (e.g., ordered more supplies)"
              rows={3}
              required
            />
            <div className="resolution-buttons">
              <button 
                className="cancel-btn"
                onClick={() => setIsResolving(false)}
              >
                Cancel
              </button>
              <button 
                className="resolve-btn"
                onClick={handleResolve}
                disabled={!resolution.trim()}
              >
                Confirm Resolution
              </button>
            </div>
          </div>
        ) : (
          <div className="alert-actions">
            <button
              className="order-btn"
              onClick={() => window.location.href = `/supply/new?itemId=${alert.item.id}`}
            >
              Order Supplies
            </button>
            <button 
              className="resolve-btn"
              onClick={() => setIsResolving(true)}
            >
              Mark as Resolved
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default StockAlertCard;