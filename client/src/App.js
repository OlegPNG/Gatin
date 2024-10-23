import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import TopBar from './components/TopBar';
import Sidebar from './components/Sidebar';
import Flashcard from './components/Flashcard';
import LoginForm from './components/LoginForm';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  return (
    <div className="app-container">
      {/* Top bar with login button */}
      <TopBar 
        isAuthenticated={isAuthenticated} 
        onLoginClick={() => setShowLogin(!showLogin)} 
        onLogout={() => setIsAuthenticated(false)}
      />

      {/* Sidebar */}
      <Sidebar />

      {/* Main content area */}
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Flashcard />} />
        </Routes>
      </div>

      {/* Login form in the top right */}
      {!isAuthenticated && showLogin && (
        <div className="login-form-wrapper">
          <LoginForm setIsAuthenticated={setIsAuthenticated} />
        </div>
      )}
    </div>
  );
}

export default App;
