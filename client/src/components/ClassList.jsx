import React from 'react';
import './ClassList.css';

const ClassList = () => {
  const students = [
    'Alice Johnson',
    'Bob Smith',
    'Catherine Lee',
    'Daniel Harris',
    'Emma Brown',
    'Fiona Green',
    'George White',
    'Hannah Black',
    'Isaac Newton', // Additional students for scrollbar
    'Jessica Adams'
  ];

  return (
    <div className="class-list">
      <h2>Class List</h2>
      <div className="students">
        {students.map((student, index) => (
          <p key={index}>{student}</p>
        ))}
      </div>
    </div>
  );
};

export default ClassList;
