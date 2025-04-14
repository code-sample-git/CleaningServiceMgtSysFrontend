import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { getServiceById, deleteService } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

function ServiceDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [request, setRequest] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const res = await getServiceById(id);
        setRequest(res.data);
      } catch (err) {
        setError('Failed to load service request');
      } finally {
        setLoading(false);
      }
    };
    fetchRequest();
  }, [id]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="loading">Loading request...</div>
      </DashboardLayout>
    );
  }

  if (error || !request) {
    return (
      <DashboardLayout>
        <div className="error-message">{error || 'Request not found'}</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="page-content">
        <div className="page-header">
          <h1>Request Details</h1>
          <button className="btn-secondary" onClick={() => navigate('/service')}>
            Back to List
          </button>
        </div>

        <div className="details-card">
          <p><strong>Client Name:</strong> {request.clientName}</p>
          <p><strong>Description:</strong> {request.description}</p>
          <p><strong>Status:</strong> {request.status}</p>
          <p><strong>Submitted On:</strong> {new Date(request.createdAt).toLocaleString()}</p>
        </div>
        {['manager', 'admin'].includes(localStorage.getItem('userRole') || user?.role) && (
        <div className="form-actions" style={{ marginTop: '1rem' }}>
          <button className="btn-secondary" onClick={() => navigate(`/service/${id}/edit`)}>
            Edit
          </button>
          <button
            className="btn-danger"
            onClick={async () => {
              if (window.confirm('Are you sure you want to delete this request?')) {
                try {
                  await deleteService(id);
                  navigate('/service');
                } catch (err) {
                  alert('Failed to delete request');
                }
              }
            }}
          >
            Delete
          </button>
        </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default ServiceDetailsPage;
