import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getLowStockAlerts } from '../../services/inventoryService';
import StockAlertCard from '../../components/inventory/StockAlertCard';

const LowStockAlerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterLocation, setFilterLocation] = useState('all');
  const [filterUrgency, setFilterUrgency] = useState('all');
  
  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const data = await getLowStockAlerts();
        setAlerts(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load low stock alerts');
        setLoading(false);
      }
    };
    
    fetchAlerts();
  }, []);

  // Get unique locations
  const locations = ['all', ...new Set(alerts.map(alert => alert.location))];
  
  // Filter alerts based on selected filters
  const filteredAlerts = alerts.filter(alert => {
    const locationMatch = filterLocation === 'all' || alert.location === filterLocation;
    const urgencyMatch = filterUrgency === 'all' || alert.urgency === filterUrgency;
    return locationMatch && urgencyMatch;
  });

  if (loading) return <div>Loading stock alerts...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="low-stock-alerts">
      <div className="header-section">
        <h1>Low Stock Alerts</h1>
        <Link to="/inventory/settings" className="settings-btn">Alert Settings</Link>
      </div>
      
      <div className="filters-section">
        <div className="filter-group">
          <label>Location:</label>
          <select 
            value={filterLocation} 
            onChange={(e) => setFilterLocation(e.target.value)}
          >
            {locations.map(loc => (
              <option key={loc} value={loc}>
                {loc === 'all' ? 'All Locations' : loc}
              </option>
            ))}
          </select>
        </div>
        
        <div className="filter-group">
          <label>Urgency:</label>
          <select 
            value={filterUrgency} 
            onChange={(e) => setFilterUrgency(e.target.value)}
          >
            <option value="all">All Urgency Levels</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>
      
      <div className="alerts-summary">
        <div className="summary-card critical">
          <h3>Critical</h3>
          <p>{alerts.filter(a => a.urgency === 'critical').length}</p>
        </div>
        <div className="summary-card high">
          <h3>High</h3>
          <p>{alerts.filter(a => a.urgency === 'high').length}</p>
        </div>
        <div className="summary-card medium">
          <h3>Medium</h3>
          <p>{alerts.filter(a => a.urgency === 'medium').length}</p>
        </div>
        <div className="summary-card low">
          <h3>Low</h3>
          <p>{alerts.filter(a => a.urgency === 'low').length}</p>
        </div>
      </div>
      
      <div className="alerts-container">
        {filteredAlerts.length === 0 ? (
          <p className="no-alerts">No alerts match your filters.</p>
        ) : (
          filteredAlerts.map(alert => (
            <StockAlertCard key={alert.id} alert={alert} />
          ))
        )}
      </div>
    </div>
  );
};

export default LowStockAlerts;
