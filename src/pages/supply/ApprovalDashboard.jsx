import React, { useState, useEffect } from 'react';
import { getPendingRequests, updateRequestStatus } from '../../services/supplyService';
import ApprovalModal from '../../components/supply/ApprovalModal';

const ApprovalDashboard = () => {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchPendingRequests = async () => {
    try {
      const data = await getPendingRequests();
      setPendingRequests(data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load pending requests');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingRequests();
  }, []);

  const handleRequestAction = async (requestId, status, comments) => {
    try {
      await updateRequestStatus(requestId, status, comments);
      // Remove the processed request from the list
      setPendingRequests(pendingRequests.filter(req => req.id !== requestId));
      setModalOpen(false);
    } catch (err) {
      setError(`Failed to ${status} request`);
    }
  };

  const openApprovalModal = (request) => {
    setSelectedRequest(request);
    setModalOpen(true);
  };

  if (loading) return <div>Loading pending requests...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="approval-dashboard">
      <h1>Supply Request Approvals</h1>
      
      {pendingRequests.length === 0 ? (
        <div className="no-requests">
          <p>No pending requests to approve.</p>
        </div>
      ) : (
        <div className="pending-requests-container">
          {pendingRequests.map(request => (
            <div key={request.id} className="request-approval-card">
              <div className="request-header">
                <h3>Request #{request.id}</h3>
                <span className={`urgency ${request.urgency}`}>{request.urgency}</span>
              </div>
              
              <div className="request-details">
                <p><strong>Requested by:</strong> {request.requesterName}</p>
                <p><strong>Location:</strong> {request.location}</p>
                <p><strong>Date:</strong> {new Date(request.dateRequested).toLocaleDateString()}</p>
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
              
              {request.notes && (
                <div className="request-notes">
                  <h4>Notes:</h4>
                  <p>{request.notes}</p>
                </div>
              )}
              
              <div className="action-buttons">
                <button 
                  className="view-details-btn"
                  onClick={() => openApprovalModal(request)}
                >
                  Review Request
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {modalOpen && selectedRequest && (
        <ApprovalModal
          request={selectedRequest}
          onClose={() => setModalOpen(false)}
          onApprove={(comments) => handleRequestAction(selectedRequest.id, 'approved', comments)}
          onReject={(comments) => handleRequestAction(selectedRequest.id, 'rejected', comments)}
        />
      )}
    </div>
  );
};

export default ApprovalDashboard;
