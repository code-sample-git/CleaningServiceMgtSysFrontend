import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { authService } from '../../services/mockData';
import { Table, Card } from '../../components/common';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { getService } from '../../utils/api';

function ServicePage() {
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadServiceRequests();
  }, []);

  const loadServiceRequests = async () => {
    try {
      const res = await getService();
      setRequests(res.data || []);
    } catch (err) {
      setError('Failed to load service requests');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddRequest = () => {
    navigate('/service/add');
  };

  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'status-success';
      case 'pending':
        return 'status-warning';
      case 'rejected':
        return 'status-error';
      default:
        return 'status-default';
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="loading">Loading service requests...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="page-content">
        <div className="page-header">
          <h1>Service Requests</h1>
          <button className="btn-primary" onClick={handleAddRequest}>
            Add New Request
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="stats-container">
          <div className="stat-card">
            <h3>Total Requests</h3>
            <p>{requests.length}</p>
          </div>
          <div className="stat-card">
            <h3>Pending</h3>
            <p>{requests.filter(r => r.status.toLowerCase() === 'pending').length}</p>
          </div>
          <div className="stat-card">
            <h3>Approved</h3>
            <p>{requests.filter(r => r.status.toLowerCase() === 'approved').length}</p>
          </div>
          <div className="stat-card">
            <h3>Rejected</h3>
            <p>{requests.filter(r => r.status.toLowerCase() === 'rejected').length}</p>
          </div>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Client</th>
                <th>Description</th>
                <th>Status</th>
                <th>Submitted</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req) => (
                <tr key={req._id}>
                  <td>{req.clientName}</td>
                  <td>{req.description}</td>
                  <td>
                    <span className={`status-tag ${getStatusClass(req.status)}`}>
                      {req.status}
                    </span>
                  </td>
                  <td>{new Date(req.createdAt).toLocaleString()}</td>
                  <td>
                    <button
                      className="btn-secondary"
                      onClick={() => navigate(`/service/${req._id}`)}
                    >
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

export default ServicePage;