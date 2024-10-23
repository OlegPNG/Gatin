import React from 'react';
import './TopBar.css';

const TopBar = ({ isAuthenticated, onLogout, onLoginClick }) => {
  return (
    <div className="top-bar">
      <div className="menu-selection">Menu Selection</div>
      <div className="login-section">
        {isAuthenticated ? (
          <button className="login-button" onClick={onLogout}>
            Logout
          </button>
        ) : (
          <button className="login-button" onClick={onLoginClick}>
            Login
          </button>
        )}
      </div>
    </div>
  );
};

export default TopBar;
