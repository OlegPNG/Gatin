// LoadingOverlay.jsx
import React from 'react';
import '../styles/LoadingOverlay.css';

export default function LoadingOverlay({ message }) {
  return (
    <div className="loading-overlay">
      <div className="loading-content">
        <div className="spinner"></div>
        <h2>{message}</h2>
      </div>
    </div>
  );
}
