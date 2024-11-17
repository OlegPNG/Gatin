import React, { useState, useEffect } from 'react';
import Navigation from './Navigation';
import endpoints from '../services/endpoints.js';
import '../styles/Flashcards.css';
import { useLocation, useNavigate } from 'react-router-dom';

function Flashcards() {
  const [flashcards, setFlashcards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [newCard, setNewCard] = useState({ front: '', back: '' });
  const [isDetailedView, setIsDetailedView] = useState(false);
  const navigate = useNavigate();
  const { state } = useLocation();

  // Fetch flashcards
  useEffect(() => {
    const fetchFlashcards = async () => {
      try {
        const setId = state.id;
        console.log('Set ID: ' + setId);
        const response = await endpoints.getFlashcardsBySetId(setId);
        const data = await response.json();
        setFlashcards(data.flashcards);
      } catch (err) {
        console.error('Error fetching flashcards:', err);
      }
    };
    fetchFlashcards();
  }, [state.id]);

  // Navigation Handlers
  const handleFlip = () => setFlipped(!flipped);
  const handleNext = () => setCurrentIndex((currentIndex + 1) % flashcards.length);
  const handleBack = () => setCurrentIndex((currentIndex - 1 + flashcards.length) % flashcards.length);

  // View Transition
  const toggleDetailedView = () => setIsDetailedView(!isDetailedView);

  // Adding a new flashcard
  const handleAddFlashcard = async () => {
    try {
      const setId = state.id;
      const newCardData = { ...newCard };
      await endpoints.addFlashcard(setId, newCardData);
      setFlashcards([...flashcards, newCardData]);
      setNewCard({ front: '', back: '' });
    } catch (err) {
      console.error('Error adding flashcard:', err);
    }
  };

  return (
    <div className="flashcard-container">
      <Navigation />
      {isDetailedView ? (
        <div className="detailed-view">
          {/* Tabs */}
          <div className="tabs">
            <button onClick={() => setIsDetailedView(false)}>Title</button>
            <button onClick={() => navigate('/quiz', { state })}>Quiz</button>
            <button onClick={() => navigate('/match', { state })}>Match</button>
          </div>

          {/* Single Flashcard View */}
          <div className={`flashcard ${flipped ? 'flipped' : ''}`} onClick={handleFlip}>
            <div className="front"><strong>Q:</strong> {flashcards[currentIndex]?.front}</div>
            <div className="back"><strong>A:</strong> {flashcards[currentIndex]?.back}</div>
          </div>

          {/* Navigation Controls */}
          <div className="flashcard-nav">
            <button onClick={handleBack}>Back</button>
            <button onClick={handleNext}>Next</button>
          </div>
        </div>
      ) : (
        <div className="base-view">
          <h1 onClick={toggleDetailedView}>Flashcards</h1>
          <div className="flashcard-list">
            {flashcards.map((card, index) => (
              <div key={index} className="flashcard-item">
                <div><strong>Q:</strong> {card.front}</div>
                <div><strong>A:</strong> {card.back}</div>
              </div>
            ))}
          </div>

          {/* Add Flashcard Section */}
          <div className="add-flashcard">
            <input
              type="text"
              placeholder="Front (Question)"
              value={newCard.front}
              onChange={(e) => setNewCard({ ...newCard, front: e.target.value })}
            />
            <input
              type="text"
              placeholder="Back (Answer)"
              value={newCard.back}
              onChange={(e) => setNewCard({ ...newCard, back: e.target.value })}
            />
            <button onClick={handleAddFlashcard}>Add Flashcard</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Flashcards;
