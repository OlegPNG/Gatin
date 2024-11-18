import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Navigation.css';

export default function Navigation() {
  const navigate = useNavigate();

  return (
    <nav className="navigation">
      <button className="home-button" onClick={() => navigate("/sets")}>Home</button>
    </nav>
  );
}
