import React from 'react';
import { Link } from 'react-router-dom';

const RequestCard = ({ request }) => {
  const getStatusClass = () => {
    switch (request.status) {
      case 'approved': return 'status-approved';
      case 'rejected': return 'status-rejected';
      case 'pending': return 'status-pending';
      default: return '';
    }
  };

  return (
    <div className="request-card">
      <div className="request-card-header">
        <h3>Request #{request.id}</h3>
        <span className={`request-status ${getStatusClass()}`}>
          {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
        </span>
      </div>
      
      <div className="request-card-body">
        <div className="request-info">
          <p><strong>Date:</strong> {new Date(request.dateRequested).toLocaleDateString()}</p>
          <p><strong>Location:</strong> {request.location}</p>
          <p><strong>Urgency:</strong> <span className={`urgency-${request.urgency}`}>{request.urgency}</span></p>
        </div>
        
        <div className="request-items">
          <h4>Requested Items:</h4>
          <ul>
            {request.items.map(item => (
              <li key={item.id}>
                {item.name} - {item.quantity} {item.unit}
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      <div className="request-card-footer">
        <Link to={`/supply/requests/${request.id}`} className="details-btn">View Details</Link>
        
        {request.status === 'approved' && (
          <div className="delivery-info">
            <p><strong>Estimated Delivery:</strong> {request.estimatedDelivery}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestCard;
