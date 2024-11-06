// src/components/MenuSelection.jsx
import React from 'react';
import './MenuSelection.css';

function MenuSelection() {
  return (
    <div className="menu-selection">
      <h3>Menu Selection</h3>
      <ul>
        <li><a href="#flashcards">Flashcards</a></li>
        <li><a href="#matching">Matching</a></li>
        <li><a href="#quizzes">Quizzes</a></li>
        <li><a href="#classroom">Classroom</a></li>
      </ul>
    </div>
  );
}

export default MenuSelection;
