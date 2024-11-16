import React, { useState } from 'react';
import endpoints from '../services/endpoints';
import '../styles/LoginForm.css';
import { useNavigate } from 'react-router-dom';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault(); 
    try {
      const response = await endpoints.signInUser({ email, password });
      if (response.ok) {
        navigate('/sets'); 
      } else {
        alert('Login failed. Please check your credentials.');
      }
    } catch (error) {
      alert('Login failed. ' + error);
    }
  };

  return (
    <div className="login-page">
      <h1>Gatin</h1>
      <div className="login-form">
        <h2>Sign In</h2>
        <form onSubmit={handleSignIn}>
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
        </form>
        <p className="register-link">
          or <a href="/register">register</a>
        </p>
      </div>
    </div>
  );
}
