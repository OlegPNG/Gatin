import React from 'react';
import './Header.css';
import { FaCog, FaUserCircle } from 'react-icons/fa';

const Header = ({ onLoginClick, isLoggedIn, userEmail }) => {
  return (
    <header className="header">
      <h1 className="header-title">CSCI 3500</h1>
      <div className="header-icons">
        <FaCog className="settings-icon" title="Settings" />
        {isLoggedIn ? (
          <span className="user-welcome">Welcome, {userEmail}</span>
        ) : (
          <FaUserCircle
            className="login-icon"
            title="Login / OAuth"
            onClick={onLoginClick} // Trigger login modal on click
            style={{ cursor: 'pointer' }}
          />
        )}
      </div>
    </header>
  );
};

export default Header;
