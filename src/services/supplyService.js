import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

// Fetch all supply requests
export const getSupplyRequests = async () => {
  try {
    const response = await axios.get(`${API_URL}/supply/requests`);
    return response.data;
  } catch (error) {
    console.error('Error fetching supply requests:', error);
    throw error;
  }
};

// Get details for a specific supply request
export const getSupplyRequest = async (requestId) => {
  try {
    const response = await axios.get(`${API_URL}/supply/requests/${requestId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching request ${requestId}:`, error);
    throw error;
  }
};

// Get available supplies catalog
export const getSupplyCatalog = async () => {
  try {
    const response = await axios.get(`${API_URL}/supply/catalog`);
    return response.data;
  } catch (error) {
    console.error('Error fetching supply catalog:', error);
    throw error;
  }
};

// Submit a new supply request
export const submitSupplyRequest = async (requestData) => {
  try {
    const response = await axios.post(`${API_URL}/supply/requests`, requestData);
    return response.data;
  } catch (error) {
    console.error('Error submitting supply request:', error);
    throw error;
  }
};

// Get pending requests for approval
export const getPendingRequests = async () => {
  try {
    const response = await axios.get(`${API_URL}/supply/requests/pending`);
    return response.data;
  } catch (error) {
    console.error('Error fetching pending requests:', error);
    throw error;
  }
};

// Update request status (approve/reject)
export const updateRequestStatus = async (requestId, status, comments) => {
  try {
    const response = await axios.patch(`${API_URL}/supply/requests/${requestId}`, {
      status,
      comments,
      updatedAt: new Date().toISOString()
    });
    return response.data;
  } catch (error) {
    console.error(`Error updating request ${requestId}:`, error);
    throw error;
  }
};

// Delete a supply request
export const deleteSupplyRequest = async (requestId) => {
  try {
    await axios.delete(`${API_URL}/supply/requests/${requestId}`);
    return true;
  } catch (error) {
    console.error(`Error deleting request ${requestId}:`, error);
    throw error;
  }
};
