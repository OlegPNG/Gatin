// src/pages/Flashcards.js
import React, { useState } from 'react';
import './Flashcards.css';

const flashcardsData = [
  { id: 1, question: "What is React?", answer: "A JavaScript library for building user interfaces." },
  { id: 2, question: "What is a component?", answer: "A reusable piece of code that represents part of a UI." },
  { id: 3, question: "What is JSX?", answer: "A syntax extension for JavaScript that looks similar to XML or HTML." },
];

const Flashcards = () => {
  return (
    <div className="flashcards-page">
      <h2>Flashcards</h2>
      <div className="flashcards-container">
        {flashcardsData.map(card => (
          <Flashcard key={card.id} question={card.question} answer={card.answer} />
        ))}
      </div>
    </div>
  );
};

const Flashcard = ({ question, answer }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className={`flashcard ${isFlipped ? 'flipped' : ''}`} onClick={handleFlip}>
      <div className="flashcard-inner">
        <div className="flashcard-front">
          <p>{question}</p>
        </div>
        <div className="flashcard-back">
          <p>{answer}</p>
        </div>
      </div>
    </div>
  );
};

export default Flashcards;
