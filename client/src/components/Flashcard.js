import React, { useState, useEffect } from 'react';
import './Flashcard.css'; // Ensure the CSS is imported

function Flashcard() {
  const [flashcards, setFlashcards] = useState([]);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0); // To track which card is currently shown
  const [flipped, setFlipped] = useState(false); // To track the flip state

  // Fetch the data from the API when the component mounts
  useEffect(() => {
    fetch('/api/flashcard')  // This URL will be proxied to https://www.gatin.dev/api/flashcard
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch flashcards');
        }
        return response.json();
      })
      .then(data => setFlashcards(data))  // Store the fetched flashcards in state
      .catch(err => setError(err.message));
  }, []);

  // Handle errors, if any
  if (error) {
    return <div>Error: {error}</div>;
  }

  // If no flashcards are loaded yet, show a loading message
  if (flashcards.length === 0) {
    return <div>Loading flashcards...</div>;
  }

  // Function to handle flipping the card
  const handleFlip = () => {
    setFlipped(!flipped); // Toggle the flip state
  };

  // Function to go to the next flashcard
  const handleNext = () => {
    setFlipped(false); // Reset flip state when moving to the next card
    setCurrentIndex((prevIndex) => (prevIndex + 1) % flashcards.length); // Loop to the beginning when reaching the end
  };

  // Function to go to the previous flashcard
  const handleBack = () => {
    setFlipped(false); // Reset flip state when moving to the previous card
    setCurrentIndex((prevIndex) => (prevIndex - 1 + flashcards.length) % flashcards.length); // Loop to the end when going back from the first card
  };

  // Get the current flashcard
  const currentFlashcard = flashcards[currentIndex];

  return (
    <div className="flashcard-container">
      <h1>Flashcards</h1>
      <div
        className={`flashcard ${flipped ? 'flipped' : ''}`}
        onClick={handleFlip} // Flip the card on click
      >
        <div className="front">
          <strong>Q:</strong> {currentFlashcard.front}
        </div>
        <div className="back">
          <strong>A:</strong> {currentFlashcard.back}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flashcard-nav">
        <button onClick={handleBack}>Back</button>
        <button onClick={handleNext}>Next</button>
      </div>
    </div>
  );
}

export default Flashcard;