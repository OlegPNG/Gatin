import React, { useState, useEffect } from 'react';
import Navigation from './Navigation';
import endpoints from '../services/endpoints.js';
import '../styles/Matching.css';
import { useLocation } from 'react-router-dom';

function Matching() {
  const [fullFlashcards, setFullFlashcards] = useState([]); // All flashcards
  const [flashcards, setFlashcards] = useState([]); // Current 10 flashcards in play
  const [shuffledCards, setShuffledCards] = useState([]); // Combined and shuffled
  const [selectedCard, setSelectedCard] = useState(null); // Track selected question or answer
  const [matchedPairs, setMatchedPairs] = useState([]); // Successfully matched pairs
  const [error, setError] = useState(null); // Error handling
  const [showModal, setShowModal] = useState(false); // Track modal visibility

  const { state } = useLocation();

  // Fetch flashcards from the API and store the full dataset
  useEffect(() => {
    const fetchFlashcards = async () => {
      try {
        const setId = state.id;
        const data = await endpoints.getFlashcardsBySetId(setId);
        const object = await data.json();
        const allFlashcards = object.flashcards.map((card) => ({
          front: card.front.trim(),
          back: card.back.trim(),
        }));
        setFullFlashcards(allFlashcards); // Store the full set of flashcards
        selectRandomFlashcards(allFlashcards); // Select the initial 10 flashcards
      } catch (err) {
        setError(err.message);
      }
    };
    fetchFlashcards();
  }, [state]);

  // Helper function to shuffle an array
  const shuffleArray = (array) => {
    return [...array].sort(() => Math.random() - 0.5);
  };

  // Helper function for double shuffle to avoid adjacency
  const enhancedShuffle = (array) => {
    let shuffled = shuffleArray(array);

    // Perform another pass to further randomize pair positions
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled;
  };

  // Select 10 random flashcards from the full dataset
  const selectRandomFlashcards = (allFlashcards) => {
    const selected = shuffleArray(allFlashcards).slice(0, 10); // Pick a random 10
    setFlashcards(selected); // Set the current flashcards
    initializeGame(selected); // Initialize the game with these cards
  };

  // Initialize the game with the provided flashcards
  const initializeGame = (fc) => {
    const combined = fc
      .map((card) => [
        { text: card.front, type: 'question' },
        { text: card.back, type: 'answer' },
      ])
      .flat();
    const shuffled = enhancedShuffle(combined); // Use enhanced shuffle

    setShuffledCards(shuffled);
    setMatchedPairs([]); // Reset matched pairs
    setSelectedCard(null); // Reset selected card
    setShowModal(false); // Hide modal on game start/reset
  };

  // Handle clicking a card
  const handleCardClick = (card) => {
    if (!selectedCard) {
      // No card selected, select this card
      setSelectedCard(card);
    } else if (selectedCard && selectedCard.type !== card.type) {
      // If the selected card and clicked card are of different types
      const matchedCard = flashcards.find(
        (fc) =>
          (fc.front === selectedCard.text && fc.back === card.text) ||
          (fc.back === selectedCard.text && fc.front === card.text)
      );

      if (matchedCard) {
        // Add the matched pair
        setMatchedPairs((prev) => [...prev, matchedCard]);
        // Remove matched cards from the grid
        setShuffledCards((prev) =>
          prev.filter((c) => c.text !== selectedCard.text && c.text !== card.text)
        );

        // Check if the game is complete
        if (matchedPairs.length + 1 === flashcards.length) {
          setTimeout(() => setShowModal(true), 300); // Delay modal display
        }
      }
      setSelectedCard(null); // Reset selection after a match attempt
    } else {
      // Same type selected, reset the selection
      setSelectedCard(null);
    }
  };

  // Reset the game with a new random selection of flashcards
  const resetGame = () => {
    selectRandomFlashcards(fullFlashcards); // Pick new random cards and reset
  };

  // Error rendering
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="matching-page">
      {/* Navigation */}
      <Navigation />

      {/* Header */}
      <header className="matching-header">
        <h1>Gatin</h1>
      </header>

      {/* Matching Game Container */}
      <div className="matching-container">
        <div className="matching-grid">
          {shuffledCards.map((card, index) => (
            <div
              key={index}
              className={`matching-tile ${
                selectedCard?.text === card.text ? 'selected' : ''
              } ${
                matchedPairs.some(
                  (pair) =>
                    pair.front === card.text || pair.back === card.text
                )
                  ? 'matched'
                  : ''
              }`}
              onClick={() => handleCardClick(card)}
            >
              {card.text}
            </div>
          ))}
        </div>
        <div className="matching-pairs">
          <h2>Matched Pairs</h2>
          {matchedPairs.map((pair, index) => (
            <div key={index} className="matching-pair">
              <strong>Q:</strong> {pair.front} - <strong>A:</strong> {pair.back}
            </div>
          ))}
        </div>
      </div>

      {/* Popup Modal */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Congratulations!</h2>
            <p>You matched all pairs. Would you like to play again?</p>
            <button onClick={resetGame} className="modal-button">Yes</button>
            <button onClick={() => setShowModal(false)} className="modal-button">No</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Matching;
