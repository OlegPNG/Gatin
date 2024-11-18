import React, { useState, useEffect } from 'react';
import Navigation from './Navigation';
import endpoints from '../services/endpoints.js';
import '../styles/Matching.css';
import { useLocation } from 'react-router-dom';

function Matching() {
  const [flashcards, setFlashcards] = useState([]);
  const [error, setError] = useState(null);

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);

  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [matchedPairs, setMatchedPairs] = useState([]);

  const [showModal, setShowModal] = useState(false); // Track modal visibility

  const { state } = useLocation();

  useEffect(() => {
    const fetchFlashcards = async () => {
      try {
        const setId = state.id;
        const data = await endpoints.getFlashcardsBySetId(setId);
        const object = await data.json();
        const fc = object.flashcards.map((card) => ({
          front: card.front.trim().toLowerCase(),
          back: card.back.trim().toLowerCase(),
        }));
        setFlashcards(fc);
        initializeGame(fc);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchFlashcards();
  }, [state]);

  const shuffleArray = (array) => array.sort(() => Math.random() - 0.5);

  const initializeGame = (fc) => {
    const shuffledQuestions = shuffleArray(fc.map((card) => card.front));
    const shuffledAnswers = shuffleArray(fc.map((card) => card.back));

    setQuestions(shuffledQuestions);
    setAnswers(shuffledAnswers);
    setMatchedPairs([]);
    setSelectedQuestion(null);
    setShowModal(false); // Hide the modal when resetting the game
  };

  const handleQuestionClick = (question) => {
    setSelectedQuestion(question);
  };

  const handleAnswerClick = (answer) => {
    if (selectedQuestion) {
      const matchedCard = flashcards.find(
        (card) =>
          card.front === selectedQuestion && card.back === answer
      );

      if (matchedCard) {
        setMatchedPairs((prev) => [...prev, matchedCard]);
        setQuestions((prev) => prev.filter((q) => q !== selectedQuestion));
        setAnswers((prev) => prev.filter((a) => a !== answer));

        // Check if the game is complete
        if (matchedPairs.length + 1 === flashcards.length) {
          setTimeout(() => setShowModal(true), 300); // Delay to show the modal
        }
      }
      setSelectedQuestion(null);
    }
  };

  const resetGame = () => {
    initializeGame(flashcards);
  };

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
          {questions.map((question, index) => (
            <div
              key={`question-${index}`}
              className={`matching-tile ${
                selectedQuestion === question ? 'selected' : ''
              }`}
              onClick={() => handleQuestionClick(question)}
            >
              {question}
            </div>
          ))}
          {answers.map((answer, index) => (
            <div
              key={`answer-${index}`}
              className={`matching-tile ${
                matchedPairs.some((pair) => pair.back === answer) ? 'matched' : ''
              }`}
              onClick={() => handleAnswerClick(answer)}
            >
              {answer}
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
