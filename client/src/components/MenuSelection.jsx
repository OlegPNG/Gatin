// src/components/MenuSelection.jsx
import React from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation
import './MenuSelection.css';

function MenuSelection() {
  return (
    <div className="menu-selection">
      <h3>Menu Selection</h3>
      <ul>
        <li><Link to="/flashcards">Flashcards</Link></li>
        <li><Link to="/matching">Matching</Link></li>
        <li><Link to="/quizzes">Quizzes</Link></li> {/* Link to the Quizzes page */}
      </ul>
    </div>
  );
}

export default MenuSelection;
