import React, { useState, useEffect } from 'react';
import Navigation from './Navigation';
import endpoints from '../services/endpoints.js';
import '../styles/Flashcards.css';
import { useLocation, useNavigate } from 'react-router-dom';

function Flashcards() {
  const [flashcards, setFlashcards] = useState([]);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [deleteMode, setDeleteMode] = useState(false);
  const [newCard, setNewCard] = useState({ front: '', back: '' });
  const navigate = useNavigate();
  const { state } = useLocation();

  useEffect(() => {
    const fetchFlashcards = async () => {
      try {
        const setId = state.id;
        const response = await endpoints.getFlashcardsBySetId(setId);
        const data = await response.json();
        setFlashcards(data.flashcards);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchFlashcards();
  }, [state.id]);

  const handleFlip = () => setFlipped(!flipped);
  const handleNext = () => setCurrentIndex((currentIndex + 1) % flashcards.length);
  const handleBack = () => setCurrentIndex((currentIndex - 1 + flashcards.length) % flashcards.length);

  const toggleOptions = () => setShowOptions(!showOptions);
  const navigateToMatching = () => navigate('/matching', { state });
  const navigateToQuiz = () => navigate('/quizzes', { state });
  const navigateHome = () => navigate('/sets');

  const toggleEditMode = () => setEditMode(!editMode);
  const toggleDeleteMode = () => setDeleteMode(!deleteMode);

  const handleEditFlashcard = async (index, updatedCard) => {
    try {
      const setId = state.id;
      await endpoints.editFlashcard(setId, updatedCard);
      const updatedFlashcards = [...flashcards];
      updatedFlashcards[index] = updatedCard;
      setFlashcards(updatedFlashcards);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteFlashcard = async (flashcardId) => {
    try {
      const setId = state.id;
      await endpoints.deleteFlashcard(setId, flashcardId);
      setFlashcards(flashcards.filter(card => card.id !== flashcardId));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAddFlashcard = async () => {
    try {
      const setId = state.id;
      const newCardData = { ...newCard };
      await endpoints.editFlashcard(setId, newCardData);
      setFlashcards([...flashcards, newCardData]);
      setNewCard({ front: '', back: '' });
    } catch (err) {
      setError(err.message);
    }
  };

  if (error) return <div>Error: {error}</div>;
  if (flashcards.length === 0) return <div>Loading flashcards...</div>;

  return (
    <div className="flashcard-container">
      <Navigation />
      <h1>
        Flashcards
        <button className="expand-arrow" onClick={toggleOptions}>
          ⮟
        </button>
      </h1>
      {showOptions && (
        <div className="study-options">
          <button onClick={navigateToMatching}>Matching</button>
          <button onClick={navigateToQuiz}>Quiz</button>
        </div>
      )}
      <button className="home-button" onClick={navigateHome}>Home</button>

      {/* Main Flashcard */}
      <div className={`flashcard ${flipped ? 'flipped' : ''}`} onClick={handleFlip}>
        <div className="front"><strong>Q:</strong> {flashcards[currentIndex]?.front}</div>
        <div className="back"><strong>A:</strong> {flashcards[currentIndex]?.back}</div>
      </div>

      <div className="flashcard-nav">
        <button onClick={handleBack}>Back</button>
        <button onClick={handleNext}>Next</button>
      </div>

      {/* Scrollable Flashcards Container */}
      <div className="flashcard-list">
        {flashcards.map((card, index) => (
          <div key={card.id} className="flashcard-item">
            <div className="flashcard-half"><strong>Q:</strong> {card.front}</div>
            <div className="flashcard-half"><strong>A:</strong> {card.back}</div>
            {deleteMode && <button className="delete-button" onClick={() => handleDeleteFlashcard(card.id)}>X</button>}
          </div>
        ))}
      </div>

      {/* Edit and Delete Controls */}
      <div className="edit-controls">
        <button onClick={toggleEditMode}>Edit Mode ⮟</button>
        <button className={deleteMode ? 'delete-active' : ''} onClick={toggleDeleteMode}>Delete Mode</button>
      </div>

      {/* Edit Mode Section */}
      {editMode && (
        <div className="edit-section">
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
          <button onClick={toggleEditMode}>Stop Editing</button>
        </div>
      )}
    </div>
  );
}

export default Flashcards;
