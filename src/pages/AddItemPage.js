import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { inventoryService } from '../services/mockData';
import DashboardLayout from '../components/layout/DashboardLayout';
import { useRole } from '../context/RoleContext';

const AddItemPage = () => {
  const navigate = useNavigate();
  const { checkPermission } = useRole();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    quantity: 0,
    unit: '',
    category: '',
    status: 'active'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    inventoryService.create(formData);
    navigate('/inventory');
  };

  if (!checkPermission('canManageInventory')) {
    navigate('/inventory');
    return null;
  }

  return (
    <DashboardLayout>
      <div className="container">
        <div className="page-header">
          <h1>Add New Inventory Item</h1>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Item Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="quantity">Quantity</label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              min="0"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="unit">Unit</label>
            <input
              type="text"
              id="unit"
              name="unit"
              value={formData.unit}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">Select a category</option>
              <option value="cleaning">Cleaning Supplies</option>
              <option value="equipment">Equipment</option>
              <option value="safety">Safety Gear</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="button"
              onClick={() => navigate('/inventory')}
            >
              Cancel
            </button>
            <button type="submit" className="button is-primary">
              Add Item
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default AddItemPage; 