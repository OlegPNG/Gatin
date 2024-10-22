import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import Flashcard from './components/Flashcard';
import LoginForm from './components/LoginForm';
import './App.css';
import Flashcard from './Flashcard';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    // Check if a token exists in localStorage when the app loads
    if (localStorage.getItem('token')) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  return (
    <div className="app-container">
      <TopBar
        isAuthenticated={isAuthenticated}
        onLogout={handleLogout}
        onLoginClick={() => setShowLogin(!showLogin)}
      />

      <div className="main-content">
        {isAuthenticated && <Sidebar />}

        <div className="flashcard-area">
          <Flashcard />
        </div>
      </div>

      {/* Conditionally render login form at the top-right */}
      {!isAuthenticated && showLogin && (
        <div className="login-form-wrapper">
          <LoginForm setIsAuthenticated={setIsAuthenticated} />
        </div>
      )}
    </div>
  );
}

export default App;