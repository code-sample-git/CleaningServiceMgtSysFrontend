import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

// Fetch all low stock alerts
export const getLowStockAlerts = async () => {
  try {
    const response = await axios.get(`${API_URL}/inventory/alerts`);
    return response.data;
  } catch (error) {
    console.error('Error fetching low stock alerts:', error);
    throw error;
  }
};

// Get all locations where inventory is stored
export const getLocations = async () => {
  try {
    const response = await axios.get(`${API_URL}/inventory/locations`);
    return response.data;
  } catch (error) {
    console.error('Error fetching locations:', error);
    throw error;
  }
};

// Get all inventory items
export const getInventoryItems = async () => {
  try {
    const response = await axios.get(`${API_URL}/inventory/items`);
    return response.data;
  } catch (error) {
    console.error('Error fetching inventory items:', error);
    throw error;
  }
};

// Get current inventory levels by location
export const getInventoryLevels = async (locationId) => {
  try {
    const response = await axios.get(`${API_URL}/inventory/levels/${locationId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching inventory levels for location ${locationId}:`, error);
    throw error;
  }
};

// Get alert threshold settings
export const getAlertSettings = async () => {
  try {
    const response = await axios.get(`${API_URL}/inventory/settings/alerts`);
    return response.data;
  } catch (error) {
    console.error('Error fetching alert settings:', error);
    throw error;
  }
};

// Update alert threshold settings
export const updateAlertSettings = async (settings) => {
  try {
    const response = await axios.put(`${API_URL}/inventory/settings/alerts`, settings);
    return response.data;
  } catch (error) {
    console.error('Error updating alert settings:', error);
    throw error;
  }
};

// Resolve a stock alert
export const resolveStockAlert = async (alertId, resolution) => {
  try {
    const response = await axios.patch(`${API_URL}/inventory/alerts/${alertId}`, {
      status: 'resolved',
      resolution,
      resolvedAt: new Date().toISOString()
    });
    return response.data;
  } catch (error) {
    console.error(`Error resolving alert ${alertId}:`, error);
    throw error;
  }
};
