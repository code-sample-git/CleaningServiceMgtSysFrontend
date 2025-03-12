import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSupplyCatalog, submitSupplyRequest } from '../../services/supplyService';

const RequestForm = () => {
  const [supplies, setSupplies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    items: [],
    location: '',
    urgency: 'normal',
    notes: ''
  });
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSupplies = async () => {
      try {
        const catalog = await getSupplyCatalog();
        setSupplies(catalog);
        setLoading(false);
      } catch (err) {
        setError('Failed to load supplies catalog');
        setLoading(false);
      }
    };
    
    fetchSupplies();
  }, []);

  const handleItemChange = (itemId, quantity) => {
    const updatedItems = [...formData.items];
    const existingItemIndex = updatedItems.findIndex(item => item.id === itemId);
    
    if (existingItemIndex >= 0) {
      if (quantity > 0) {
        updatedItems[existingItemIndex].quantity = quantity;
      } else {
        updatedItems.splice(existingItemIndex, 1);
      }
    } else if (quantity > 0) {
      updatedItems.push({ id: itemId, quantity });
    }
    
    setFormData({ ...formData, items: updatedItems });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await submitSupplyRequest(formData);
      navigate('/supply/requests', { state: { message: 'Request submitted successfully!' } });
    } catch (err) {
      setError('Failed to submit request');
    }
  };

  if (loading) return <div>Loading supplies catalog...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="request-form-container">
      <h1>Supply Request Form</h1>
      
      <form onSubmit={handleSubmit}>
        <div className="form-section">
          <label>Location</label>
          <select 
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            required
          >
            <option value="">Select Location</option>
            <option value="main-office">Main Office</option>
            <option value="north-branch">North Branch</option>
            <option value="south-branch">South Branch</option>
          </select>
        </div>
        
        <div className="form-section">
          <label>Urgency</label>
          <select 
            value={formData.urgency}
            onChange={(e) => setFormData({ ...formData, urgency: e.target.value })}
          >
            <option value="low">Low</option>
            <option value="normal">Normal</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
        </div>
        
        <div className="form-section">
          <h2>Items</h2>
          <div className="items-grid">
            {supplies.map(item => (
              <div key={item.id} className="item-card">
                <h3>{item.name}</h3>
                <p>{item.description}</p>
                <img src={item.image} alt={item.name} />
                <div className="quantity-selector">
                  <label>Quantity</label>
                  <input 
                    type="number" 
                    min="0"
                    onChange={(e) => handleItemChange(item.id, parseInt(e.target.value))}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="form-section">
          <label>Additional Notes</label>
          <textarea 
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            rows={4}
          />
        </div>
        
        <button type="submit" className="submit-btn">Submit Request</button>
      </form>
    </div>
  );
};

export default RequestForm;
