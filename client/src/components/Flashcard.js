import React, { useState } from 'react';
import './Flashcard.css';

const Flashcard = () => {
  const flashcards = [
    { question: 'What is the course number?', answer: '3300' },
    { question: 'Who is the professor?', answer: 'Porter' },
    { question: 'What is the name of the app?', answer: 'Gatin' }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => setIsFlipped(!isFlipped);
  const handleNext = () => setCurrentIndex((prev) => (prev + 1) % flashcards.length);
  const handleBack = () => setCurrentIndex((prev) => (prev === 0 ? flashcards.length - 1 : prev - 1));

  return (
    <div className="flashcard-container">
      <div className={`flashcard ${isFlipped ? 'flipped' : ''}`} onClick={handleFlip}>
        <div className="front">
          <p>{flashcards[currentIndex].question}</p>
        </div>
        <div className="back">
          <p>{flashcards[currentIndex].answer}</p>
        </div>
      </div>
      <div className="flashcard-nav">
        <button onClick={handleBack}>Back</button>
        <button onClick={handleNext}>Next</button>
      </div>
    </div>
  );
};

export default Flashcard;
