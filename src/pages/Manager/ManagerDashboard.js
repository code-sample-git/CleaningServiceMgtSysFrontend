import React, { useState, useEffect } from 'react';
import { getLocations, getStaff, assignStaffToLocation } from '../../services/api';

const ManagerDashboard = () => {
  const [locations, setLocations] = useState([]);
  const [staff, setStaff] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [assignedStaff, setAssignedStaff] = useState([]);

  // Fetch locations and staff data when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const locationsData = await getLocations();
        const staffData = await getStaff();
        setLocations(locationsData.data);
        setStaff(staffData.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  // Fetch assigned staff for a location whenever a location is selected
  useEffect(() => {
    const fetchAssignedStaff = async () => {
      if (selectedLocation) {
        try {
          // Assuming the API returns an array of assigned staff IDs for a location
          const assignedData = await getAssignedStaffForLocation(selectedLocation._id);
          setAssignedStaff(assignedData.data);
        } catch (error) {
          console.error('Error fetching assigned staff:', error);
        }
      }
    };

    fetchAssignedStaff();
  }, [selectedLocation]);

  const handleAssignStaff = async (staffId) => {
    if (selectedLocation) {
      try {
        await assignStaffToLocation(selectedLocation._id, staffId);

        // After assigning, re-fetch the updated list of assigned staff for the selected location
        const updatedAssignedStaff = await getAssignedStaffForLocation(selectedLocation._id);
        setAssignedStaff(updatedAssignedStaff.data);
      } catch (error) {
        console.error('Error assigning staff:', error);
      }
    }
  };

  return (
    <div>
      <h1>Manager Dashboard</h1>

      <div>
        <h2>Locations</h2>
        <ul>
          {locations.map((location) => (
            <li key={location._id}>
              {location.name} - {location.status}
              <button onClick={() => setSelectedLocation(location)}>View Staff</button>
            </li>
          ))}
        </ul>
      </div>

      {selectedLocation && (
        <div>
          <h3>Assign Staff to {selectedLocation.name}</h3>
          
          {/* Assigned Staff */}
          <div>
            <h4>Assigned Staff</h4>
            <ul>
              {assignedStaff.map((staffId) => {
                const staffMember = staff.find((s) => s._id === staffId);
                return <li key={staffMember._id}>{staffMember.first_name} {staffMember.last_name}</li>;
              })}
            </ul>
          </div>

          {/* Available Staff */}
          <div>
            <h4>Available Staff</h4>
            <ul>
              {staff
                .filter((staffMember) => !assignedStaff.includes(staffMember._id)) // Show only available staff
                .map((staffMember) => (
                  <li key={staffMember._id}>
                    {staffMember.first_name} {staffMember.last_name}
                    <button onClick={() => handleAssignStaff(staffMember._id)}>Assign</button>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagerDashboard;
