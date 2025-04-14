import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { submitFeedback } from '../../utils/api';
import DashboardLayout from '../../components/layout/DashboardLayout';

const FeedbackPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    try {
      await submitFeedback({
        clientId: user.id,
        rating,
        comment,
      });
      setSuccess('Feedback submitted successfully!');
      setRating(5);
      setComment('');
    } catch (err) {
      setError('Failed to submit feedback');
    }
  };

  return (
    <DashboardLayout>
      <div className="container">
        <h1>Submit Feedback</h1>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label>Rating (1–5)</label>
            <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>{n} Star{n > 1 ? 's' : ''}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Comment</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              placeholder="Tell us how we're doing..."
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="button primary">Submit Feedback</button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default FeedbackPage;
