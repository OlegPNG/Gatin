import React, { useState, useEffect } from 'react';
import Navigation from './Navigation';
import endpoints from '../services/endpoints.js';
import '../styles/Quizzes.css';
import { useLocation, useNavigate } from 'react-router-dom';

function Quizzes() {
  const [quizData, setQuizData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showOptions, setShowOptions] = useState(false);
  const navigate = useNavigate();
  const { state } = useLocation();

  useEffect(() => {
    setQuizData(state.data);
    setLoading(false);
  }, [state.data]);

  const toggleOptions = () => setShowOptions(!showOptions);
  const navigateToFlashcards = () => navigate('/flashcards', { state });
  const navigateToMatching = () => navigate('/matching', { state });
  const navigateHome = () => navigate('/sets');

  if (error) return <div>Error: {error}</div>;
  if (loading) return <div>Loading quiz...</div>;

  return (
    <div className="quiz-container">
      <Navigation />
      <h1>
        Quiz
        <button className="expand-arrow" onClick={toggleOptions}>
          ⮟
        </button>
      </h1>
      {showOptions && (
        <div className="study-options">
          <button onClick={navigateToFlashcards}>Flashcards</button>
          <button onClick={navigateToMatching}>Matching</button>
        </div>
      )}
      <button className="home-button" onClick={navigateHome}>Home</button>
    </div>
  );
}

export default Quizzes;
