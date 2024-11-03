import React from 'react';
import './NavigationButtons.css';

const NavigationButtons = ({ onNext, onBack }) => {
  return (
    <div className="navigation-buttons">
      <button className="nav-button" onClick={onBack}>Back</button>
      <button className="nav-button" onClick={onNext}>Next</button>
    </div>
  );
};

export default NavigationButtons;
