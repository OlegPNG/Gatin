import React, { useState, useEffect } from 'react';
import Navigation from './Navigation';
import endpoints from '../services/endpoints.js'; // Default import of endpoints
import '../styles/Quizzes.css';

function Quizzes({ setId }) {
  const [quizData, setQuizData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        setLoading(true);
        const data = await endpoints.generateQuiz(setId); // Access generateQuiz via endpoints
        setQuizData(data); // Assuming data contains questions/answers
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [setId]);

  if (loading) return <p>Loading quiz...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>Quiz</h1>
      {/* Render quizData here */}
    </div>
  );
}

export default Quizzes;

