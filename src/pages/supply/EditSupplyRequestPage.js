import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const EditSupplyRequestPage = () => {
  const navigate = useNavigate();

  return (
    <div>
      {/* ... existing code ... */}
      <button
        className="button"
        onClick={() => navigate('/supply')}
      >
        Cancel
      </button>
      {/* ... existing code ... */}
    </div>
  );
};

export default EditSupplyRequestPage; 