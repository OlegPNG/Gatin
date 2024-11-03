import React from 'react';
import './ClassList.css'; // Ensure this CSS file is present

const classes = [
  'Class 1',
  'Class 2',
  'Class 3',
  'Class 4',
  'Class 5',
  'Class 6',
];

const ClassList = () => {
  return (
    <div className="class-list-container">
      <h2 className="class-list-title">Class List</h2>
      {classes.map((className, index) => (
        <div key={index} className="class-item">
          {className}
        </div>
      ))}
    </div>
  );
};

export default ClassList;
