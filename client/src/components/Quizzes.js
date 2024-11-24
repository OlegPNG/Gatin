import React, { useState, useEffect } from 'react';
import '../styles/Quizzes.css';
import { useLocation } from 'react-router-dom';

const APP_NAME = 'Gatin';

function Quizzes() {
  const [quizData, setQuizData] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [answerOptions, setAnswerOptions] = useState([]);

  const { state } = useLocation();

  useEffect(() => {
    if (state && state.data) {
      setQuizData(state.data);
      setCurrentQuestion(state.data[0]);

      const opts = [
        state.data[0].correct,
        state.data[0].option2,
        state.data[0].option3,
        state.data[0].option4,
      ].sort(() => Math.random() - 0.5);
      setAnswerOptions(opts);
    }
    setLoading(false);
  }, [state]);

  const handleAnswerClick = (answer) => {
    if (answer === currentQuestion.correct) {
      setFeedback('Correct!');
    } else {
      setFeedback(`Incorrect. The correct answer was: ${currentQuestion.correct}`);
    }
    setSelectedAnswer(answer);
  };

  const handleNextQuestion = () => {
    const nextIndex = currentQuestionIndex + 1;
    if (nextIndex < quizData.length) {
      setCurrentQuestionIndex(nextIndex);
      setCurrentQuestion(quizData[nextIndex]);

      const opts = [
        quizData[nextIndex].correct,
        quizData[nextIndex].option2,
        quizData[nextIndex].option3,
        quizData[nextIndex].option4,
      ].sort(() => Math.random() - 0.5);
      setAnswerOptions(opts);

      setFeedback('');
      setSelectedAnswer(null);
    }
  };

  if (loading) return <p>Loading quiz...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!quizData || quizData.length === 0) return <p>No quiz data available.</p>;

  return (
    <div className="quiz-container">
      {/* Updated Header */}
      <header className="header">
        <button className="home-button" onClick={() => window.location.href = '/'}>
          Home
        </button>
        <h1 className="header-title">{APP_NAME}</h1>
      </header>

      {/* Quiz content */}
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
        {selectedAnswer && currentQuestionIndex === quizData.length - 1 && (
          <p className="quiz-completion">Quiz completed! Great job!</p>
        )}
      </div>
    </div>
  );
}

export default Quizzes;
