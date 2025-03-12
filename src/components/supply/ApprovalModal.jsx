import React, { useState } from 'react';

const ApprovalModal = ({ request, onClose, onApprove, onReject }) => {
  const [comments, setComments] = useState('');

  return (
    <div className="modal-overlay">
      <div className="approval-modal">
        <div className="modal-header">
          <h2>Review Request #{request.id}</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        
        <div className="modal-body">
          <div className="request-info">
            <p><strong>Requester:</strong> {request.requesterName}</p>
            <p><strong>Department:</strong> {request.department}</p>
            <p><strong>Location:</strong> {request.location}</p>
            <p><strong>Date Requested:</strong> {new Date(request.dateRequested).toLocaleString()}</p>
            <p><strong>Urgency:</strong> <span className={`urgency-${request.urgency}`}>{request.urgency}</span></p>
          </div>
          
          <div className="request-items">
            <h3>Requested Items</h3>
            <table>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Quantity</th>
                  <th>Unit Price</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {request.items.map(item => (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>{item.quantity} {item.unit}</td>
                    <td>${item.price}</td>
                    <td>${(item.quantity * item.price).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="3"><strong>Total</strong></td>
                  <td>
                    <strong>
                      ${request.items.reduce((sum, item) => sum + (item.quantity * item.price), 0).toFixed(2)}
                    </strong>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
          
          {request.notes && (
            <div className="request-notes">
              <h3>Notes</h3>
              <p>{request.notes}</p>
            </div>
          )}
          
          <div className="comments-section">
            <h3>Approval Comments</h3>
            <textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Add comments about this request (optional)"
              rows={4}
            />
          </div>
        </div>
        
        <div className="modal-footer">
          <button className="reject-btn" onClick={() => onReject(comments)}>
            Reject Request
          </button>
          <button className="approve-btn" onClick={() => onApprove(comments)}>
            Approve Request
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApprovalModal;
