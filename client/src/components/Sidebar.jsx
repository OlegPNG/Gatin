import React from 'react';
import { FaAngleRight } from 'react-icons/fa'; // Import an arrow icon from react-icons
import './Sidebar.css';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h2>Menu Selection</h2>
      <ul className="menu-selection">
        <li><FaAngleRight className="icon" /> Flashcards</li>
        <li><FaAngleRight className="icon" /> Matching</li>
        <li><FaAngleRight className="icon" /> Quizzes</li>
        <li><FaAngleRight className="icon" /> Classroom</li>
      </ul>
    </div>
  );
};

export default Sidebar;
