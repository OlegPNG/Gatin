import React from 'react';
import './TopBar.css';

const TopBar = ({ isAuthenticated, onLoginClick }) => {
  return (
    <div className="top-bar">
      <div className="course-name">COURSE</div>
      <div className="auth-info">
        {isAuthenticated ? (
          <button className="auth-button">Logout</button>
        ) : (
          <button className="auth-button" onClick={onLoginClick}>Login</button>
        )}
      </div>
    </div>
  );
};

export default TopBar;
