import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Navigation.css';

export default function Navigation() {
  const navigate = useNavigate();

  return (
    <nav className="navigation">
      <button onClick={() => navigate("/sets")}>Go to Sets</button>
      <button onClick={() => navigate("/create-set")}>Create New Set</button>
    </nav>
  );
}
