import React from 'react';

const Card = ({ title, value, icon, className }) => {
  return (
    <div className={`stat-card ${className || ''}`}>
      {icon && <div className="card-icon">{icon}</div>}
      <h3>{title}</h3>
      <div className="value">{value}</div>
    </div>
  );
};

export default Card; 