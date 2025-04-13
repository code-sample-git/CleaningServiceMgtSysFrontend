import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { proposalService, locationService, taskService, authService } from '../../services/mockData';
import { Table, Card } from '../../components/common';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useRole } from '../../context/RoleContext';

const EditProposalPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { checkPermission } = useRole();
  const [proposal, setProposal] = useState(null);
  const [client, setClient] = useState(null);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [locationTasks, setLocationTasks] = useState({});
  const [frequency, setFrequency] = useState('weekly');
  const [notes, setNotes] = useState('');
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!checkPermission('canManageProposals')) {
      navigate('/proposals');
      return;
    }
    loadProposalDetails();
  }, [id]);

  const loadProposalDetails = () => {
    const proposalData = proposalService.getById(Number(id));
    if (!proposalData) {
      navigate('/proposals');
      return;
    }

    const clientData = authService.getAll().find(user => user.id === proposalData.clientId);
    if (!clientData || clientData.role !== 'client') {
      navigate('/proposals');
      return;
    }

    setProposal(proposalData);
    setClient(clientData);
    setSelectedLocations(proposalData.locations.map(loc => loc.id));
    setLocationTasks(proposalData.locations.reduce((acc, loc) => {
      acc[loc.id] = loc.tasks;
      return acc;
    }, {}));
    setFrequency(proposalData.frequency);
    setNotes(proposalData.notes || '');
    setTotalAmount(proposalData.totalAmount);
    setLoading(false);
  };

  const handleLocationSelect = (locationId) => {
    const isSelected = selectedLocations.includes(locationId);
    if (isSelected) {
      setSelectedLocations(selectedLocations.filter(id => id !== locationId));
      const newLocationTasks = { ...locationTasks };
      delete newLocationTasks[locationId];
      setLocationTasks(newLocationTasks);
    } else {
      setSelectedLocations([...selectedLocations, locationId]);
      setLocationTasks({
        ...locationTasks,
        [locationId]: []
      });
    }
  };

  const handleTaskSelect = (locationId, taskId) => {
    const tasks = locationTasks[locationId] || [];
    const isSelected = tasks.includes(taskId);
    
    setLocationTasks({
      ...locationTasks,
      [locationId]: isSelected
        ? tasks.filter(id => id !== taskId)
        : [...tasks, taskId]
    });
  };

  const calculateTotal = () => {
    if (!locationTasks || Object.keys(locationTasks).length === 0) return 0;
    
    return Object.entries(locationTasks).reduce((total, [locationId, tasks]) => {
      if (!tasks || !Array.isArray(tasks)) return total;
      
      return total + tasks.reduce((sum, taskId) => {
        const task = taskService.getById(taskId);
        return sum + (task?.price || 0);
      }, 0);
    }, 0);
  };

  useEffect(() => {
    if (selectedLocations.length > 0 && locationTasks) {
      setTotalAmount(calculateTotal());
    } else {
      setTotalAmount(0);
    }
  }, [locationTasks, selectedLocations]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const updatedProposal = {
      ...proposal,
      locations: selectedLocations.map(locId => ({
        id: locId,
        tasks: locationTasks[locId]
      })),
      frequency,
      notes,
      totalAmount: Number(totalAmount)
    };

    try {
      proposalService.update(Number(id), updatedProposal);
      navigate(`/proposals/${id}`);
    } catch (err) {
      setError('Failed to update proposal. Please try again.');
    }
  };

  const locationColumns = [
    {
      key: 'select',
      label: '',
      render: (row) => (
        <input
          type="checkbox"
          checked={selectedLocations.includes(row.id)}
          onChange={() => handleLocationSelect(row.id)}
        />
      )
    },
    { key: 'name', label: 'Location' },
    { key: 'address', label: 'Address' }
  ];

  const renderLocationTasks = (locationId) => {
    const location = locationService.getById(locationId);
    if (!location) return null;

    const tasks = taskService.getByLocation(locationId);
    if (!tasks || tasks.length === 0) return <div>No tasks available for this location</div>;

    return (
      <div className="task-list">
        {tasks.map(task => (
          <div key={task.id} className="task-item">
            <input
              type="checkbox"
              checked={locationTasks[locationId]?.includes(task.id)}
              onChange={() => handleTaskSelect(locationId, task.id)}
            />
            <span>{task.name}</span>
            <span className="price">${task.price}</span>
          </div>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="loading">Loading proposal details...</div>
      </DashboardLayout>
    );
  }

  if (!proposal || !client) {
    return (
      <DashboardLayout>
        <div className="error">Proposal not found</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="page-content">
        <div className="page-header">
          <h1>Edit Proposal</h1>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="section">
            <h2>Select Locations</h2>
            <Table
              columns={locationColumns}
              data={locationService.getByClient(client.id) || []}
            />
          </div>

          {selectedLocations.length > 0 && (
            <div className="section">
              <h2>Select Tasks for Each Location</h2>
              {selectedLocations.map(locationId => {
                const location = locationService.getById(locationId);
                if (!location) return null;
                
                return (
                  <div key={locationId} className="location-tasks card">
                    <h3>{location.name}</h3>
                    {renderLocationTasks(locationId)}
                  </div>
                );
              })}
            </div>
          )}

          <div className="section">
            <h2>Proposal Details</h2>
            <div className="form-group">
              <label>Frequency</label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                required
              >
                <option value="weekly">Weekly</option>
                <option value="bi-weekly">Bi-Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>

            <div className="form-group">
              <label>Total Amount ($)</label>
              <input
                type="number"
                value={totalAmount}
                onChange={(e) => setTotalAmount(e.target.value)}
                min="0"
                step="0.01"
                required
              />
            </div>

            <div className="form-group">
              <label>Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                placeholder="Enter any additional notes or special requirements..."
              />
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={() => navigate(`/proposals/${id}`)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={selectedLocations.length === 0}
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default EditProposalPage; 