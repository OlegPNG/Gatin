import React, { useState, useEffect } from 'react';
import Navigation from './Navigation';
import endpoints from '../services/endpoints.js'; // Use default import
import '../styles/Flashcards.css';
import { useLocation } from 'react-router-dom';

function Flashcards() {
  const [flashcards, setFlashcards] = useState([]);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  // Fetch flashcards when the component mounts

  const { state } = useLocation();
  useEffect(() => {
    const fetchFlashcards = async () => {
      try {
        const setId = state.id; // Replace with actual set ID
        const data = await endpoints.getFlashcardsBySetId(setId); // Use default import
        setFlashcards(data.flashcards);
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

  //console.log("# Of Flashcards: " + flashcards.length)
  console.log(flashcards)
  if (flashcards !== null) {
    if (flashcards.length === 0) return <div>Loading flashcards...</div>;
    return (
      <div className="flashcard-container">
        <Navigation />
        <h1>Flashcards</h1>
        {flashcards[currentIndex] ? (
          <div className={`flashcard ${flipped ? 'flipped' : ''}`} onClick={handleFlip}>
            <div className="front"><strong>Q:</strong> {flashcards[currentIndex].front}</div>
            <div className="back"><strong>A:</strong> {flashcards[currentIndex].back}</div>
          </div>
        ) : (
            <div className="flashcard-placeholder">No flashcard available</div>
          )}      <div className="flashcard-nav">
          <button onClick={handleBack}>Back</button>
          <button onClick={handleNext}>Next</button>
        </div>
      </div>
    );
  } else {
    return (
      <div className="flashcard-container">
        <Navigation />
        <h1>Flashcards</h1>
        <div className="flashcard-placeholder">No flashcard available</div>
      </div>
    );
  }
}

export default Flashcards;
