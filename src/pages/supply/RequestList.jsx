import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getSupplyRequests } from '../../services/supplyService';
import RequestCard from '../../components/supply/RequestCard';

const RequestList = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const location = useLocation();
  const message = location.state?.message;

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const data = await getSupplyRequests();
        setRequests(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load supply requests');
        setLoading(false);
      }
    };
    
    fetchRequests();
  }, []);

  const filteredRequests = filter === 'all' 
    ? requests 
    : requests.filter(request => request.status === filter);

  if (loading) return <div>Loading requests...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="request-list-container">
      <div className="header-section">
        <h1>Supply Requests</h1>
        <Link to="/supply/new" className="create-request-btn">New Request</Link>
      </div>
      
      {message && <div className="success-message">{message}</div>}
      
      <div className="filters">
        <button 
          className={filter === 'all' ? 'active' : ''} 
          onClick={() => setFilter('all')}
        >
          All
        </button>
        <button 
          className={filter === 'pending' ? 'active' : ''} 
          onClick={() => setFilter('pending')}
        >
          Pending
        </button>
        <button 
          className={filter === 'approved' ? 'active' : ''} 
          onClick={() => setFilter('approved')}
        >
          Approved
        </button>
        <button 
          className={filter === 'rejected' ? 'active' : ''} 
          onClick={() => setFilter('rejected')}
        >
          Rejected
        </button>
      </div>
      
      <div className="requests-container">
        {filteredRequests.length === 0 ? (
          <p>No requests found.</p>
        ) : (
          filteredRequests.map(request => (
            <RequestCard key={request.id} request={request} />
          ))
        )}
      </div>
    </div>
  );
};

export default RequestList;
