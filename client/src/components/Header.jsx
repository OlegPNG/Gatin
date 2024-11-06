import React from 'react';
import './Header.css';
import { FaCog, FaUserCircle } from 'react-icons/fa';

const Header = () => {
  return (
    <header className="header">
      <h1 className="header-title">CSCI 3500</h1>
      <div className="header-icons">
        <FaCog className="settings-icon" title="Settings" />
        <FaUserCircle className="login-icon" title="Login / OAuth" />
      </div>
    </header>
  );
};

export default Header;
