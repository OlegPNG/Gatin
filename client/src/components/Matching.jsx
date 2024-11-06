import React, { useState, useEffect } from 'react';
import Navigation from './Navigation';
import endpoints from '../services/endpoints.js'; // Default import of endpoints
import '../styles/Matching.css';

function Matching() {
  const [flashcards, setFlashcards] = useState([]);
  const [error, setError] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [matchedPairs, setMatchedPairs] = useState([]);

  useEffect(() => {
    const fetchFlashcards = async () => {
      try {
        const setId = 'YOUR_SET_ID'; // Replace with actual set ID
        const data = await endpoints.getFlashcardsBySetId(setId); // Use default import
        setFlashcards(data);
        setQuestions(shuffleArray(data.map(card => card.front)));
        setAnswers(shuffleArray(data.map(card => card.back)));
      } catch (err) {
        setError(err.message);
      }
    };
    fetchFlashcards();
  }, []);

  const shuffleArray = (array) => array.sort(() => Math.random() - 0.5);

  const handleQuestionClick = (question) => setSelectedQuestion(question);

  const handleAnswerClick = (answer) => {
    if (selectedQuestion) {
      const matchedCard = flashcards.find(card => card.front === selectedQuestion && card.back === answer);
      if (matchedCard) {
        setMatchedPairs((prev) => [...prev, matchedCard]);
        setQuestions((prev) => prev.filter((q) => q !== selectedQuestion));
        setAnswers((prev) => prev.filter((a) => a !== answer));
      }
      setSelectedQuestion(null);
    }
  };

  if (error) return <div>Error: {error}</div>;

  return (
    <div className="matching-container">
      <Navigation />
      <h1>Matching Game</h1>
      <div className="matching-grid">
        <div className="questions">
          <h2>Questions</h2>
          {questions.map((question, index) => (
            <div
              key={index}
              className={`question-item ${selectedQuestion === question ? 'selected' : ''}`}
              onClick={() => handleQuestionClick(question)}
            >
              {question}
            </div>
          ))}
        </div>
        <div className="answers">
          <h2>Answers</h2>
          {answers.map((answer, index) => (
            <div key={index} className="answer-item" onClick={() => handleAnswerClick(answer)}>
              {answer}
            </div>
          ))}
        </div>
      </div>
      <div className="matched-pairs">
        <h2>Matched Pairs</h2>
        {matchedPairs.map((pair, index) => (
          <div key={index} className="matched-pair">
            <strong>Q:</strong> {pair.front} - <strong>A:</strong> {pair.back}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Matching;
