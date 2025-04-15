import axios from 'axios';

const API_URL = 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const { data } = await axios.post(`${API_URL}/auth/refresh-token`, { refreshToken });
        const newAccessToken = data.accessToken;
        localStorage.setItem('accessToken', newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

// Auth-related API calls
export const register = (userData) => api.post('/auth/register', userData);
export const login = (credentials) => api.post('/auth/login', credentials);
export const forgotPassword = (email) => api.post('/auth/forgot-password', { email });
export const resetPassword = (token, newPassword) => api.post(`/auth/reset-password/${token}`, { newPassword });
export const getProfile = () => api.get('/auth/profile');

// New API calls for locations and staff

export const getStaff = () => api.get('/staff');
export const assignStaffToLocation = (staffId, locationId) =>
  api.post('/assign-staff', { staffId, locationId });
export const getAssignedStaffForLocation = (locationId) =>
  api.get(`/locations/${locationId}/assigned-staff`);

// New API call for client service requests
export const createService = (data) => api.post('/service', data);
export const getService = () => api.get('/service');
export const getServiceById = (id) => api.get(`/service/${id}`);
export const updateService = (id, data) => api.put(`/service/${id}`, data);
export const deleteService = (id) => api.delete(`/service/${id}`);

// New API call for proposal generator
export const createProposal = (data) => api.post('/proposals', data);
export const getProposalsByClient = (clientId) => api.get(`/proposals/client/${clientId}`);
export const getProposalById = (id) => api.get(`/proposals/${id}`);
export const updateProposal = (id, data) => api.put(`/proposals/${id}`, data);
export const deleteProposal = (id) => api.delete(`/proposals/${id}`);
export const updateProposalStatus = (id, status) => api.patch(`/proposals/${id}/status`, { status });
export const sendProposalEmail = (id) => api.post(`/proposals/${id}/email`);

// Clients
export const getAllUsers = () => api.get('/auth');
export const getClientById = (id) => api.get(`/auth/${id}`);

// Locations
export const createLocation = (data) => api.post('/locations', data);
export const getLocations = () => api.get('/locations');
export const getLocationsByClientId = (clientId) => api.get(`/locations/client/${clientId}`);
export const getLocationById = (id) => api.get(`/locations/${id}`);

// Tasks
export const getAllTasks = () => api.get('/tasks');
export const getTaskById = (id) => api.get(`/tasks/${id}`);
export const createTask = (data) => api.post('/tasks', data);

// Client feedback
export const submitFeedback = (data) => api.post('/feedback', data);
export const getFeedbackByProposalId = (proposalId) => api.get(`/feedback/proposal/${proposalId}`);

export default api;