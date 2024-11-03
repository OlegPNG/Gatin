import React, { useState } from 'react';
import './App.css';
import Sidebar from './components/Sidebar';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
    // You could also save a token or redirect the user upon login
  };

  return (
    <div className="app-container">
      {isAuthenticated ? (
        <Sidebar onLogin={handleLogin} />
      ) : (
        <div className="login-prompt">
          <h2>Please log in to access the menu.</h2>
        </div>
      )}
    </div>
  );
}

export default App;
