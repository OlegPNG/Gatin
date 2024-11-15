import React, { useState, useEffect } from 'react';
import Navigation from './Navigation';
import endpoints from '../services/endpoints.js';
import '../styles/Matching.css';
import { useLocation, useNavigate } from 'react-router-dom';

function Matching() {
  const [flashcards, setFlashcards] = useState([]);
  const [error, setError] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [showOptions, setShowOptions] = useState(false);
  const navigate = useNavigate();
  const { state } = useLocation();

  useEffect(() => {
    const fetchFlashcards = async () => {
      try {
        const setId = state.id;
        const data = await endpoints.getFlashcardsBySetId(setId);
        const fc = await data.json().flashcards;
        setFlashcards(fc);
        setQuestions(fc.map(card => card.front));
        setAnswers(fc.map(card => card.back));
      } catch (err) {
        setError(err.message);
      }
    };
    fetchFlashcards();
  }, [state.id]);

  const toggleOptions = () => setShowOptions(!showOptions);
  const navigateToFlashcards = () => navigate('/flashcards', { state });
  const navigateToQuiz = () => navigate('/quizzes', { state });
  const navigateHome = () => navigate('/sets');

  if (error) return <div>Error: {error}</div>;

  return (
    <div className="matching-container">
      <Navigation />
      <h1>
        Matching Game
        <button className="expand-arrow" onClick={toggleOptions}>
          ⮟
        </button>
      </h1>
      {showOptions && (
        <div className="study-options">
          <button onClick={navigateToFlashcards}>Flashcards</button>
          <button onClick={navigateToQuiz}>Quiz</button>
        </div>
      )}
      <button className="home-button" onClick={navigateHome}>Home</button>
    </div>
  );
}

export default Matching;
