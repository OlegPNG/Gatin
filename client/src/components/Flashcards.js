import React, { useState, useEffect, useRef } from 'react';
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
  const scrollRef = useRef();

  const { state } = useLocation();

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

  const handleFlip = () => setFlipped(!flipped);
  const handleNext = () => setCurrentIndex((currentIndex + 1) % flashcards.length);
  const handleBack = () => setCurrentIndex((currentIndex - 1 + flashcards.length) % flashcards.length);

  const handleEditToggle = () => setIsEditing(!isEditing);

  const handleAddFlashcard = () => {
    const newFlashcard = { front: '', back: '' };
    setFlashcards((prev) => [...prev, newFlashcard]);
    setTimeout(() => {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }, 100);
  };

  const handleDeleteFlashcard = async (index) => {
    try {
      const setId = state.id;
      const flashcardToDelete = flashcards[index];
      if (flashcardToDelete.id) {
        await endpoints.deleteFlashcard(setId, flashcardToDelete.id);
      }
      setFlashcards((prev) => prev.filter((_, i) => i !== index));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEditFlashcard = async (index, field, value) => {
    const updatedFlashcards = [...flashcards];
    updatedFlashcards[index][field] = value;
    setFlashcards(updatedFlashcards);

    /*try {
      const setId = state.id;
      const updatedCard = updatedFlashcards[index];
      await endpoints.editFlashcard(setId, updatedCard);
    } catch (err) {
      setError(err.message);
    }*/
  };

  const handleSaveFlashcard = async (index) => {
    try {
      const updatedCard = flashcards[index];
      await endpoints.editFlashcard(state.id, updatedCard);
    } catch (err) {
      setError(err.message);
    }
  }

  if (error) return <div>Error: {error}</div>;

  return (
    <div className="flashcards-page">
      <Navigation />
      <h1>Flashcards</h1>

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

      <div className="scrollable-section">
        <hr className="divider-line" />
        <div className="edit-toggle-container">
          <button onClick={handleEditToggle}>
            {isEditing ? 'Stop Editing' : 'Edit Flashcards'}
          </button>
        </div>
        <div className="scrollable-flashcards-container" ref={scrollRef}>
          <div className="scrollable-flashcards">
            {flashcards.map((card, index) => (
              <div key={index} className="scrollable-flashcard">
                {isEditing && (
                  <button
                    className="delete-button"
                    onClick={() => handleDeleteFlashcard(index)}
                  >Delete</button>
                )}
                {isEditing ? (
                  <>
                    <input
                      type="text"
                      value={card.front}
                      onChange={(e) => handleEditFlashcard(index, 'front', e.target.value)}
                      placeholder="Front"
                    />
                    <input
                      type="text"
                      value={card.back}
                      onChange={(e) => handleEditFlashcard(index, 'back', e.target.value)}
                      placeholder="Back"
                    />
                    <button
                      onClick={() => handleSaveFlashcard(index)}
                    >Save</button>
                  </>
                ) : (
                  <>
                    <div className="scrollable-term">{card.front}</div>
                    <div className="scrollable-answer">{card.back}</div>
                  </>
                )}
              </div>
            ))}
            {isEditing && (
              <button className="add-flashcard-button" onClick={handleAddFlashcard}>
                + Add Flashcard
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Flashcards;
