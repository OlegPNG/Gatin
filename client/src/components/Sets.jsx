import React, { useState, useEffect } from 'react';
import endpoints from '../services/endpoints';
import '../styles/Sets.css';
import { useNavigate } from 'react-router-dom';

export default function Sets() {
  const [sets, setSets] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchSets() {
      const response = await endpoints.getUserSets();
      if (response.success) {
        setSets(response.data);
      } else {
        alert('Failed to load sets.');
      }
    }
    fetchSets();
  }, []);

  const handleGenerate = (type, setId) => {
    if (type === 'flashcards') {
      navigate(`/flashcards/${setId}`);
    } else if (type === 'quizzes') {
      navigate(`/quizzes/${setId}`);
    } else if (type === 'matching') {
      navigate(`/matching/${setId}`);
    }
  };

  return (
    <div className="sets-page">
      <h2>Your Sets</h2>
      <button onClick={() => navigate('/create-set')}>Create New Set</button>
      <div className="sets-list">
        {sets.map((set) => (
          <div key={set.id} className="set-item">
            <h3>{set.name}</h3>
            <p>{set.description}</p>
            <button onClick={() => handleGenerate('flashcards', set.id)}>Generate Flashcards</button>
            <button onClick={() => handleGenerate('quizzes', set.id)}>Generate Quiz</button>
            <button onClick={() => handleGenerate('matching', set.id)}>Generate Matching</button>
          </div>
        ))}
      </div>
    </div>
  );
}
