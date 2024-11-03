// MenuSelection.jsx
import React from 'react';
import './MenuSelection.css';

function MenuSelection() {
    const menuItems = [
        { name: 'Flashcards' },
        { name: 'Matching' },
        { name: 'Quizzes' },
        { name: 'Classroom' },
    ];

    return (
        <div className="menu-selection">
            <h3 className="menu-title">Menu Selection</h3>
            <ul className="menu-list">
                {menuItems.map((item, index) => (
                    <li key={index} className="menu-item">
                        <span className="menu-icon">➤</span>
                        {item.name}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default MenuSelection;
