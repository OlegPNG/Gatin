import React from 'react';
import { Link } from 'react-router-dom';
import './MenuSelection.css';

const MenuSelection = () => {
  const menuItems = [
    { name: 'Flashcards', path: '/' },
    { name: 'Matching', path: '/matching' },
    { name: 'Quizzes', path: '/quizzes' },
    { name: 'Classroom', path: '/classroom' }
  ];

  return (
    <div className="menu-selection">
      <ul className="menu-list">
        {menuItems.map((item, index) => (
          <li key={index} className="menu-item">
            <Link to={item.path} style={{ color: 'inherit', textDecoration: 'none' }}>
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MenuSelection;
