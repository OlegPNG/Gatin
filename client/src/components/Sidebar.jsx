import React, { useState } from 'react';
import './Sidebar.css';

const Sidebar = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in both fields.');
    } else {
      setError('');
      onLogin(); // Call parent function to handle successful login
    }
  };

  return (
    <div className="sidebar">
      <h2 className="sidebar-title">Menu Selection</h2>
      <ul className="sidebar-menu">
        <li className="menu-item">Flashcards</li>
        <li className="menu-item">Matching</li>
        <li className="menu-item">Quizzes</li>
        <li className="menu-item">Classroom</li>
      </ul>

      <div className="auth-container">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Login</button>
          {error && <div className="error">{error}</div>}
        </form>
      </div>
    </div>
  );
};

export default Sidebar;
