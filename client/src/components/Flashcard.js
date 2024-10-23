import React, { useState, useEffect } from 'react';
import './Flashcard.css'; // Ensure the CSS is imported

function Flashcard() {
  const [flashcards, setFlashcards] = useState([]);
  const [error, setError] = useState(null);
  const [flippedIndex, setFlippedIndex] = useState(null); // To track which card is flipped

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

  // Function to handle flipping the card
  const handleFlip = (index) => {
    // If clicked again, it flips back (toggle)
    setFlippedIndex(flippedIndex === index ? null : index);
  };

  // Render the flashcards in a list
  return (
    <div className="flashcard-container">
      <h1>Flashcards</h1>
      <ul>
        {flashcards.map((flashcard, index) => (
          <li
            key={flashcard.id}
            className={`flashcard ${flippedIndex === index ? 'flipped' : ''}`}
            onClick={() => handleFlip(index)} // Flip the card on click
          >
            <div className="front">
              <strong>Q:</strong> {flashcard.front}
            </div>
            <div className="back">
              <strong>A:</strong> {flashcard.back}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Flashcard;