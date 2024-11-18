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
  const [isEditing, setIsEditing] = useState(false);

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
  const toggleEditMode = () => setIsEditing(!isEditing);

  return (
    <div className="flashcard-container">
      <Navigation />
      <h1>Flashcards</h1>

      {/* Main Flashcard Display */}
      {flashcards[currentIndex] ? (
        <div className={`flashcard ${flipped ? 'flipped' : ''}`} onClick={handleFlip}>
          <div className="front">{flashcards[currentIndex].front}</div>
          <div className="back">{flashcards[currentIndex].back}</div>
        </div>
      ) : (
        <div className="flashcard-placeholder">No flashcard available</div>
      )}

      <div className="flashcard-nav">
        <button onClick={handleBack}>Back</button>
        <button onClick={handleNext}>Next</button>
      </div>

      {/* Divider Line */}
      <hr className="divider-line" />

      {/* Edit Button Aligned with Home Button */}
      <div className="edit-button-container">
        <button className="edit-button" onClick={toggleEditMode}>
          {isEditing ? 'Stop Editing' : 'Edit'}
        </button>
      </div>

      {/* Centered Scrollable Flashcard List */}
      <div className="scrollable-flashcards-container">
        <div className="scrollable-flashcards">
          {flashcards.map((card, index) => (
            <div key={index} className="scrollable-flashcard">
              <div className="scrollable-front">{card.front}</div>
              <div className="scrollable-back">{card.back}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Flashcards;
