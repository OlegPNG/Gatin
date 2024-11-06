// Navigation.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Navigation.css';

function Navigation() {
  return (
    <nav className="navigation">
      <Link to="/">Upload</Link>
      <Link to="/flashcards">Flashcards</Link>
      <Link to="/quizzes">Quizzes</Link>
      <Link to="/matching">Matching</Link> {/* Add Matching link */}
    </nav>
  );
}

export default Navigation;

