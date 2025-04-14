import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getServiceById, updateService } from '../../utils/api';
import DashboardLayout from '../../components/layout/DashboardLayout';

function EditServicePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ clientName: '', description: '', status: 'pending' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadRequest = async () => {
      try {
        const res = await getServiceById(id);
        setFormData(res.data);
      } catch (err) {
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    loadRequest();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateService(id, formData);
      navigate(`/service/${id}`);
    } catch (err) {
      alert('Failed to update');
    }
  };

  return (
    <DashboardLayout>
      <div className="page-content">
        <div className="page-header">
          <h1>Edit Service Request</h1>
        </div>
        {error && <div className="error-message">{error}</div>}
        {!loading && (
          <form onSubmit={handleSubmit} className="form">
            <div className="form-group">
              <label>Client Name</label>
              <input name="clientName" value={formData.clientName} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea name="description" value={formData.description} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Status</label>
              <select name="status" value={formData.status} onChange={handleChange}>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <button type="submit" className="btn-primary">Update</button>
          </form>
        )}
      </div>
    </DashboardLayout>
  );
}

export default EditServicePage;
