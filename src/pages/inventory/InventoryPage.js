import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { inventoryService } from '../../services/mockData';
import { Table, Card, StatusTag } from '../../components/common';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useRole } from '../../context/RoleContext';

const InventoryPage = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { checkPermission } = useRole();

  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = () => {
    const inventoryData = inventoryService.getAll();
    setInventory(inventoryData);
    setLoading(false);
  };

  const columns = [
    { key: 'name', label: 'Item Name' },
    { key: 'category', label: 'Category' },
    {
      key: 'quantity',
      label: 'Quantity',
      render: (row) => `${row.quantity} ${row.unit}`
    },
    {
      key: 'minQuantity',
      label: 'Min Quantity',
      render: (row) => `${row.minQuantity} ${row.unit}`
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => {
        const status = row.quantity <= row.minQuantity ? 'low' : 'in-stock';
        return <StatusTag status={status} />;
      }
    }
  ];

  const actions = [
    {
      label: 'View',
      className: 'btn-view',
      onClick: (row) => navigate(`/inventory/${row.id}`)
    }
  ];

  const stats = [
    {
      title: 'Total Items',
      value: inventory.length
    },
    {
      title: 'Low Stock',
      value: inventory.filter(item => item.quantity <= item.minQuantity).length
    },
    {
      title: 'In Stock',
      value: inventory.filter(item => item.quantity > item.minQuantity).length
    },
    {
      title: 'Categories',
      value: new Set(inventory.map(item => item.category)).size
    }
  ];

  if (loading) {
    return (
      <DashboardLayout>
        <div className="loading">Loading inventory...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="page-content">
        <div className="page-header">
          <h1>Inventory Management</h1>
          {checkPermission('canManageInventory') && (
            <button
              className="btn-primary"
              onClick={() => navigate('/inventory/add')}
            >
              Add Item
            </button>
          )}
        </div>

        <div className="stats-row">
          {stats.map((stat, index) => (
            <Card
              key={index}
              title={stat.title}
              value={stat.value}
            />
          ))}
        </div>

        <div className="table-container">
          <Table
            columns={columns}
            data={inventory}
            actions={actions}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default InventoryPage; 