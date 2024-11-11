// src/pages/Quizzes.jsx
import React from 'react';
import './Quizzes.css'; // Create a CSS file for custom styles if needed

const Quizzes = () => {
  return (
    <div className="quizzes-page">
      <h2>Quizzes</h2>
      <p>Welcome to the Quizzes page! Here you can find various quizzes to test your knowledge.</p>

      {/* Example list of quizzes */}
      <div className="quiz-list">
        <div className="quiz-item">
          <h3>Quiz 1: Introduction to Programming</h3>
          <button>Start Quiz</button>
        </div>
        <div className="quiz-item">
          <h3>Quiz 2: Data Structures</h3>
          <button>Start Quiz</button>
        </div>
        <div className="quiz-item">
          <h3>Quiz 3: Algorithms</h3>
          <button>Start Quiz</button>
        </div>
        {/* Add more quizzes as needed */}
      </div>
    </div>
  );
};

export default Quizzes;
