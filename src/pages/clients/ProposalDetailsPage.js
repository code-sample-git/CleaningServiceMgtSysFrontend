import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { proposalService, locationService, taskService } from '../../services/mockData';
import { Table, Card, StatusTag } from '../../components/common';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { getProposalById, updateProposalStatus, getLocationById, getAllTasks } from '../../utils/api';

const ProposalDetailsPage = () => {
  const { id, proposalId } = useParams();
  const navigate = useNavigate();
  const [proposal, setProposal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [locationDetails, setLocationDetails] = useState([]);
  const [taskList, setTaskList] = useState([]);

  useEffect(() => {
    loadProposalDetails();
  }, [id, proposalId]);

  const loadProposalDetails = async () => {
    try {
      const { data: prop } = await getProposalById(proposalId);
      setProposal(prop);
  
      const locationsFetched = await Promise.all(
        prop.locations.map(async (entry) => {
          const { data: locationData } = await getLocationById(entry.locationId);
          return {
            ...locationData,
            tasks: entry.tasks
          };
        })
      );
  
      const { data: allTasks } = await getAllTasks();
      setLocationDetails(locationsFetched);
      setTaskList(allTasks);
      setLoading(false);
    } catch (err) {
      navigate(`/clients/${id}/proposals`);
    }
  };

  const locationColumns = [
    { key: 'name', label: 'Location' },
    { key: 'address', label: 'Address' },
    {
      key: 'tasks',
      label: 'Tasks',
      render: (row) => row.tasks.length
    },
    {
      key: 'subtotal',
      label: 'Subtotal',
      render: (row) => `$${calculateLocationSubtotal(row)}`
    }
  ];

  const calculateLocationSubtotal = (location) => {
    return location.tasks.reduce((sum, taskId) => {
      const task = taskList.find(t => t._id === taskId);
      return sum + (task?.price || 0);
    }, 0);
  };

  const stats = [
    {
      title: 'Total Amount',
      value: `$${proposal?.totalAmount}`
    },
    {
      title: 'Locations',
      value: proposal?.locations.length
    },
    {
      title: 'Status',
      value: <StatusTag status={proposal?.status} />
    },
    {
      title: 'Frequency',
      value: proposal?.frequency
    }
  ];

  const handleApprove = async () => {
    await updateProposalStatus(proposalId, 'approved');
    loadProposalDetails();
  };
  
  const handleReject = async () => {
    await updateProposalStatus(proposalId, 'rejected');
    loadProposalDetails();
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <DashboardLayout>
      <div className="container">
        <div className="page-header">
          <h1>Proposal Details</h1>
          {proposal.status === 'pending' && (
            <div className="button-group">
              <button
                className="button success"
                onClick={handleApprove}
              >
                Approve
              </button>
              <button
                className="button danger"
                onClick={handleReject}
              >
                Reject
              </button>
            </div>
          )}
        </div>

        <div className="stats-grid">
          {stats.map((stat, index) => (
            <Card
              key={index}
              title={stat.title}
              value={stat.value}
            />
          ))}
        </div>

        <div className="section">
          <h2>Locations and Services</h2>
          <Table columns={locationColumns} data={locationDetails} />
        </div>

        <div className="section">
          <h2>Notes</h2>
          <div className="card">
            <p>{proposal.notes || 'No notes provided'}</p>
          </div>
        </div>

        <div className="form-actions">
          <button
            className="button"
            onClick={() => navigate(`/clients/${id}/proposals`)}
          >
            Back to Proposals
          </button>
          {proposal.status === 'pending' && (
            <button
              className="button primary"
              onClick={() => navigate(`/clients/${id}/proposals/${proposalId}/edit`)}
            >
              Edit Proposal
            </button>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProposalDetailsPage; 