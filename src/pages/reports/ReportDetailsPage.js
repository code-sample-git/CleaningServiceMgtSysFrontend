import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { qaReportService as qaService, locationService } from '../../services/mockData';
import { Loading } from '../../components/common';

const ReportDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReportDetails();
  }, [id]);

  const loadReportDetails = () => {
    const reports = qaService.getAll();
    const reportData = reports.find(r => r.id === Number(id));
    
    if (!reportData) {
      navigate('/qa-reports');
      return;
    }

    const locationData = locationService.getById(reportData.locationId);
    setReport(reportData);
    setLocation(locationData);
    setLoading(false);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <Loading />
      </DashboardLayout>
    );
  }

  if (!report || !location) {
    return (
      <DashboardLayout>
        <div className="container">
          <h1>Report not found</h1>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container">
        <div className="page-header">
          <h1>QA Report Details</h1>
        </div>

        <div className="card">
          <h2>Report Overview</h2>
          <div className="details-grid">
            <div className="detail-item">
              <label>Location:</label>
              <p>{location.name}</p>
            </div>
            <div className="detail-item">
              <label>Date:</label>
              <p>{report.date}</p>
            </div>
            <div className="detail-item">
              <label>Overall Rating:</label>
              <p>{report.rating}/5</p>
            </div>
            <div className="detail-item">
              <label>General Comments:</label>
              <p>{report.comments}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <h2>Category Ratings</h2>
          <div className="category-ratings">
            {report.items.map((item, index) => (
              <div key={index} className="category-rating">
                <h3>{item.category}</h3>
                <div className="rating-details">
                  <div className="rating-value">
                    Rating: {item.rating}/5
                  </div>
                  {item.comment && (
                    <div className="rating-comment">
                      <label>Comments:</label>
                      <p>{item.comment}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="form-actions">
          <button
            className="button"
            onClick={() => navigate('/reports')}
          >
            Back to Reports
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ReportDetailsPage; 