import React, { useEffect, useState } from 'react';
import { getLocations, getStaff, assignStaffToLocation, getAssignedStaffForLocation } from '../../utils/api';

const ManagerDashboard = () => {
  const [locations, setLocations] = useState([]);
  const [staff, setStaff] = useState([]);
  const [assignedStaff, setAssignedStaff] = useState([]);

  useEffect(() => {
    // Fetch locations, staff, and assigned staff when the component mounts
    const fetchData = async () => {
      try {
        const locationId = 1; // this is just to make it work, we need to adjust once we have location DB set up
        const locationsData = await getLocations();
        const staffData = await getStaff();
        const assignedStaffData = await getAssignedStaffForLocation(locationId);

        setLocations(locationsData.data);
        setStaff(staffData.data);
        setAssignedStaff(assignedStaffData.data);
      } catch (error) {
        console.error('Error fetching data', error);
      }
    };

    fetchData();
  }, []); // You can add dependencies if needed

  return (
    <div>
      {/* Render your data here */}
    </div>
  );
};

export default ManagerDashboard;
