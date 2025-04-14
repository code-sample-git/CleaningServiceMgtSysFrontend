import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { proposalService, locationService, taskService, authService } from '../../services/mockData';
import { Table, Card } from '../../components/common';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { createProposal, getClientById, getLocationsByClientId, getAllTasks, getTaskById } from '../../utils/api';

const CreateProposalPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState(null);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [locationTasks, setLocationTasks] = useState({});
  const [frequency, setFrequency] = useState('weekly');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadClientDetails();
  }, [id]);
  const [allTasks, setAllTasks] = useState([]);
  const [locations, setLocations] = useState([]);

  const loadClientDetails = async () => {
    try {
      const { data: clientData } = await getClientById(id);
      if (clientData.role !== 'client') {
        navigate('/clients');
        return;
      }
      setClient(clientData);
  
      const locs = locationService.getAll();
      const tasks = taskService.getAll();
      
      setLocations(locs);
      setAllTasks(tasks);
      setLoading(false);
    } catch {
      navigate('/clients');
    }
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
    return Object.entries(locationTasks).reduce((total, [locationId, tasks]) => {
      return total + tasks.reduce((sum, taskId) => {
        const task = allTasks.find(t => t.id === taskId);
        return sum + (task?.price || 0);
      }, 0);
    }, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const proposal = {
      clientId: id,
      locations: selectedLocations.map(locId => ({
        locationId: `00000000000000000000000${locId}`, // force ObjectId-like string
        tasks: (locationTasks[locId] || []).map(taskId => `00000000000000000000000${taskId}`)
      })),
      frequency,
      notes,
      totalAmount: calculateTotal(),
      status: 'pending'
    };
  
    try {
      await createProposal(proposal);
      navigate(`/clients/${id}/proposals`);
    } catch (err) {
      console.error(err);
      alert('Failed to create proposal.');
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
    const selectedTasks = locationTasks[locationId] || [];
  
    return (
      <div className="task-list">
        {allTasks.map(task => (
          <div key={task.id} className="task-item">
            <input
              type="checkbox"
              checked={selectedTasks.includes(task.id)}
              onChange={() => handleTaskSelect(locationId, task.id)}
            />
            <span>{task.name}</span>
            <span className="task-price">${task.price}</span>
          </div>
        ))}
      </div>
    );
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <DashboardLayout>
      <div className="container">
        <div className="page-header">
          <h1>Create Proposal - {client?.firstName} {client?.lastName}</h1>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="section">
            <h2>Select Locations</h2>
            <Table
              columns={locationColumns}
              data={locations}
            />
          </div>

          {selectedLocations.length > 0 && (
            <div className="section">
              <h2>Select Tasks for Each Location</h2>
              {selectedLocations.map(locationId => {
                const location = locationService.getById(locationId);
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
              <label>Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                placeholder="Enter any additional notes or special requirements..."
              />
            </div>
          </div>

          <Card
            title="Total Amount"
            value={`$${calculateTotal()}`}
          />

          <div className="form-actions">
            <button
              type="button"
              className="button"
              onClick={() => navigate(`/clients/${id}/proposals`)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="button primary"
              disabled={selectedLocations.length === 0}
            >
              Create Proposal
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default CreateProposalPage; 