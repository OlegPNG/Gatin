import React, { useState } from 'react';
import '../styles/RegisterForm.css';
import { useNavigate } from 'react-router-dom';
import endpoints from '../services/endpoints';

export default function RegisterForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await endpoints.registerUser({ email, password });
      alert('Registration successful! Please log in.');
      navigate('/');
    } catch (error) {
      alert('Registration failed. Please try again: ' + error);
    }
  };

  return (
    <div className="register-page">
      <h1>Gatin</h1>
      <div className="register-form">
        <h2>Register</h2>
        <form onSubmit={handleRegister}>
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
          <button type="submit">Register</button>
        </form>
      </div>
    </div>
  );
}
