import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { locationService, qaReportService as qaService } from '../../services/mockData';
import { Form, FormSelect, FormInput, FormTextarea } from '../../components/common';

const CreateQAReportPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    locationId: '',
    rating: '',
    comments: '',
    date: new Date().toISOString().split('T')[0],
    items: [
      { category: 'Cleanliness', rating: '', comment: '' },
      { category: 'Organization', rating: '', comment: '' },
      { category: 'Supply Management', rating: '', comment: '' },
      { category: 'Task Completion', rating: '', comment: '' }
    ]
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleItemChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.locationId || !formData.rating) {
      setError('Please fill in all required fields');
      return;
    }

    const invalidItems = formData.items.some(item => !item.rating);
    if (invalidItems) {
      setError('Please rate all categories');
      return;
    }

    try {
      const reportData = {
        ...formData,
        locationId: Number(formData.locationId),
        rating: Number(formData.rating),
        items: formData.items.map(item => ({
          ...item,
          rating: Number(item.rating)
        }))
      };
      qaService.create(reportData);
      navigate('/reports');
    } catch (err) {
      console.error('Error creating report:', err);
      setError('Failed to create report. Please try again.');
    }
  };

  const locations = locationService.getAll();
  const locationOptions = locations.map(loc => ({
    value: loc.id.toString(),
    label: loc.name
  }));

  const ratingOptions = [
    { value: '1', label: '1 - Poor' },
    { value: '2', label: '2 - Below Average' },
    { value: '3', label: '3 - Average' },
    { value: '4', label: '4 - Good' },
    { value: '5', label: '5 - Excellent' }
  ];

  return (
    <DashboardLayout>
      <div className="container">
        <div className="page-header">
          <h1>Create QA Report</h1>
        </div>

        <div className="card">
          <Form onSubmit={handleSubmit}>
            {error && <div className="error">{error}</div>}

            <FormSelect
              label="Location"
              name="locationId"
              value={formData.locationId}
              onChange={handleChange}
              options={locationOptions}
              required
            />

            <FormSelect
              label="Overall Rating"
              name="rating"
              value={formData.rating}
              onChange={handleChange}
              options={ratingOptions}
              required
            />

            <FormTextarea
              label="General Comments"
              name="comments"
              value={formData.comments}
              onChange={handleChange}
            />

            <h3>Category Ratings</h3>
            {formData.items.map((item, index) => (
              <div key={item.category} className="category-rating">
                <h4>{item.category}</h4>
                <FormSelect
                  label="Rating"
                  value={item.rating}
                  onChange={(e) => handleItemChange(index, 'rating', e.target.value)}
                  options={ratingOptions}
                  required
                />
                <FormTextarea
                  label="Comments"
                  value={item.comment}
                  onChange={(e) => handleItemChange(index, 'comment', e.target.value)}
                />
              </div>
            ))}

            <div className="form-actions">
              <button
                type="button"
                className="button"
                onClick={() => navigate('/qa-reports')}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="button is-primary"
              >
                Create Report
              </button>
            </div>
          </Form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CreateQAReportPage; 