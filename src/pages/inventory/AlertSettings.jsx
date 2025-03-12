import React, { useState, useEffect } from 'react';
import { 
  getAlertSettings, 
  getLocations, 
  getInventoryItems,
  updateAlertSettings 
} from '../../services/inventoryService';

const AlertSettings = () => {
  const [settings, setSettings] = useState([]);
  const [locations, setLocations] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [currentLocation, setCurrentLocation] = useState('');
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [settingsData, locationsData, itemsData] = await Promise.all([
          getAlertSettings(),
          getLocations(),
          getInventoryItems()
        ]);
        
        setSettings(settingsData);
        setLocations(locationsData);
        setItems(itemsData);
        
        if (locationsData.length > 0) {
          setCurrentLocation(locationsData[0].id);
        }
        
        setLoading(false);
      } catch (err) {
        setError('Failed to load alert settings');
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const handleThresholdChange = (itemId, value) => {
    const newSettings = [...settings];
    const settingIndex = newSettings.findIndex(
      s => s.locationId === currentLocation && s.itemId === itemId
    );
    
    if (settingIndex >= 0) {
      newSettings[settingIndex] = {
        ...newSettings[settingIndex],
        threshold: value
      };
    } else {
      newSettings.push({
        locationId: currentLocation,
        itemId: itemId,
        threshold: value
      });
    }
    
    setSettings(newSettings);
  };

  const getThreshold = (itemId) => {
    const setting = settings.find(
      s => s.locationId === currentLocation && s.itemId === itemId
    );
    return setting ? setting.threshold : 0;
  };

  const handleSaveSettings = async () => {
    try {
      await updateAlertSettings(
        settings.filter(s => s.locationId === currentLocation)
      );
      setSuccess('Alert settings updated successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Failed to save alert settings');
      setTimeout(() => setError(null), 3000);
    }
  };

  if (loading) return <div>Loading alert settings...</div>;
  if (error) return <div className="error-message">{error}</div>;

  const locationName = locations.find(l => l.id === currentLocation)?.name || '';

  return (
    <div className="alert-settings">
      <h1>Low Stock Alert Settings</h1>
      
      {success && <div className="success-message">{success}</div>}
      {error && <div className="error-message">{error}</div>}
      
      <div className="location-selector">
        <label>Select Location:</label>
        <select 
          value={currentLocation}
          onChange={(e) => setCurrentLocation(e.target.value)}
        >
          {locations.map(location => (
            <option key={location.id} value={location.id}>
              {location.name}
            </option>
          ))}
        </select>
      </div>
      
      <div className="settings-description">
        <p>
          Set minimum inventory thresholds for <strong>{locationName}</strong>. 
          When stock falls below these levels, alerts will be triggered.
        </p>
      </div>
      
      <div className="threshold-settings">
        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>Unit</th>
              <th>Threshold</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.unit}</td>
                <td>
                  <input
                    type="number"
                    min="0"
                    value={getThreshold(item.id)}
                    onChange={(e) => handleThresholdChange(item.id, parseInt(e.target.value))}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="actions">
        <button className="save-btn" onClick={handleSaveSettings}>
          Save Settings
        </button>
      </div>
    </div>
  );
};

export default AlertSettings;
