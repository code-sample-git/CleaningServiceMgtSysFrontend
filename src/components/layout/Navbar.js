import React from 'react';

const Navbar = ({ user, onLogout }) => {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <h1>Cleaning Service</h1>
      </div>
      <div className="navbar-menu">
        <div className="navbar-end">
          <div className="navbar-item">
            <span className="welcome-text">Welcome, {user?.firstName || 'User'}</span>
          </div>
          <div className="navbar-item">
            <button className="button" onClick={onLogout}>
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 