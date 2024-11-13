import React, { useState, useEffect } from 'react';
import Navigation from './Navigation';
import endpoints from '../services/endpoints.js';
import '../styles/Quizzes.css';
import { useLocation } from 'react-router-dom';

function Quizzes() {
  const [quizData, setQuizData] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [feedback, setFeedback] = useState('');

  // Fetch quiz data from the backend

  const { state } = useLocation();
  /*useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const setId = state.id;
        setLoading(true);
        const response = await endpoints.generateQuiz(setId);
        if (response.status !== 401) {
          const data = await response.json();
          setQuizData(data); // Assuming the response has a 'questions' field
        } else {
          setError('Unauthorized. Please log in again.');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  });*/

  useEffect(() => {
    console.log(state.data);
    setQuizData(state.data);
    setLoading(false)
  });

  
  // Handle answer selection
  const handleAnswerClick = (answer) => {
    const currentQuestion = quizData[currentQuestionIndex];
    if (answer === currentQuestion.correct) {
      setFeedback('Correct!');
    } else {
      setFeedback(`Incorrect. The correct answer was: ${currentQuestion.correct}`);
    }
    setSelectedAnswer(answer);
  };

  // Move to the next question
  const handleNextQuestion = () => {
    setSelectedAnswer(null);
    setFeedback('');
    setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
  };

  if (loading) return <p>Loading quiz...</p>;
  if (error) return <p>Error: {error}</p>;
  if (quizData.length === 0) return <p>No quiz data available.</p>;

  const currentQuestion = quizData[currentQuestionIndex];
  //const answerOptions = [ currentQuestion.correct, currentQuestion.option2, currentQuestion.option3, currentQuestion.option4 ]
  const answerOptions = [ currentQuestion.correct, currentQuestion.option2,
    currentQuestion.option3, currentQuestion.option4 ].sort(() => Math.random() - 0.5); // Shuffle the answer options

  return (
    <div className="quiz-container">
      <Navigation />
      <h1>Quiz</h1>
      <div className="question-container">
        <h2>{currentQuestion.question}</h2>
        <div className="answers-container">
          {answerOptions.map((answer, index) => (
            <button
              key={index}
              className={`answer-button ${
                selectedAnswer === answer
                  ? answer === currentQuestion.correct
                    ? 'correct'
                    : 'incorrect'
                  : ''
              }`}
              onClick={() => handleAnswerClick(answer)}
              disabled={selectedAnswer !== null}
            >
              {answer}
            </button>
          ))}
        </div>
        {feedback && <p className="feedback">{feedback}</p>}
        {selectedAnswer && currentQuestionIndex < quizData.length - 1 && (
          <button onClick={handleNextQuestion}>Next Question</button>
        )}
        {currentQuestionIndex === quizData.length - 1 && selectedAnswer && (
          <p>Quiz completed! Great job!</p>
        )}
      </div>
    </div>
  );

}

export default Quizzes;
