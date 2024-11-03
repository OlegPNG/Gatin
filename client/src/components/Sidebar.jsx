// Sidebar.jsx
import React, { useState } from 'react';
import MenuSelection from './MenuSelection';
import './Sidebar.css';

function Sidebar() {
    const [activeClassmate, setActiveClassmate] = useState(null);
    const classmates = [
        'Alice Johnson', 'Bob Smith', 'Catherine Lee', 'Daniel Harris', 'Emma Brown',
        'Fiona Green', 'George White', 'Hannah Black', 'Ian Grey', 'Julia Rose',
        'Kevin Young', 'Lily James', 'Michael Adams', 'Nancy King', 'Olivia Hall'
    ];

    return (
        <aside className="sidebar">
            <MenuSelection />
            <div className="divider"></div> {/* Divider added here */}
            <h3 className="title">Class List</h3>
            <ul className="classmate-list">
                {classmates.map((classmate, index) => (
                    <li
                        key={index}
                        className={`classmate-item ${activeClassmate === classmate ? 'active' : ''}`}
                        onClick={() => setActiveClassmate(classmate)}
                    >
                        {classmate}
                    </li>
                ))}
            </ul>
        </aside>
    );
}

export default Sidebar;
