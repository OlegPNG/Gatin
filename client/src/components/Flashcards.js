import React, { useState, useEffect } from 'react';
import Navigation from './Navigation';
import endpoints from '../services/endpoints.js';
import '../styles/Flashcards.css';
import { useLocation } from 'react-router-dom';

function Flashcards() {
  const [flashcards, setFlashcards] = useState([]);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const { state } = useLocation();

  // Fetch flashcards when the component mounts
  useEffect(() => {
    const fetchFlashcards = async () => {
      try {
        const setId = state.id;
        const response = await endpoints.getFlashcardsBySetId(setId);
        if (response.status !== 401) {
          const data = await response.json();
          setFlashcards(data.flashcards);
        }
      } catch (err) {
        setError(err.message);
      }
    };
    fetchFlashcards();
  }, []);

  if (error) return <div>Error: {error}</div>;

  const handleFlip = () => setFlipped(!flipped);
  const handleNext = () => setCurrentIndex((currentIndex + 1) % flashcards.length);
  const handleBack = () => setCurrentIndex((currentIndex - 1 + flashcards.length) % flashcards.length);

  return (
    <div className="flashcards-page">
      <Navigation />
      <h1>Flashcards</h1>

      {/* Main Flashcard Display */}
      <div className="flashcard-container">
        {flashcards[currentIndex] ? (
          <div className={`flashcard ${flipped ? 'flipped' : ''}`} onClick={handleFlip}>
            <div className="flashcard-inner">
              <div className="flashcard-front">{flashcards[currentIndex].front}</div>
              <div className="flashcard-back">{flashcards[currentIndex].back}</div>
            </div>
          </div>
        ) : (
          <div className="flashcard-placeholder">No flashcard available</div>
        )}
        <div className="flashcard-nav">
          <button onClick={handleBack}>Back</button>
          <button onClick={handleNext}>Next</button>
        </div>
      </div>

      {/* Divider Line */}
      <hr className="divider-line" />

      {/* Scrollable List of Flashcards */}
      <div className="scrollable-flashcards-container">
        <div className="scrollable-flashcards">
          {flashcards.map((card, index) => (
            <div key={index} className="scrollable-flashcard">
              <div className="scrollable-term">{card.front}</div>
              <div className="scrollable-answer">{card.back}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Flashcards;
