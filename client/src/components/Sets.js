import React, { useState, useEffect } from 'react';
import endpoints from '../services/endpoints';
import '../styles/Sets.css';
import { useNavigate } from 'react-router-dom';
import LoadingOverlay from './LoadingOverlay';

export default function Sets() {
  const [sets, setSets] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [hoveredSet, setHoveredSet] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const setsPerPage = 4;

  useEffect(() => {
    async function fetchSets() {
      try {
        const response = await endpoints.getUserSets();
        if (response.status !== 401) {
          const data = await response.json();
          setSets(data.sets);
        } else {
          navigate('/');
        }
      } catch (error) {
        alert('Failed to load sets. ' + error);
      }
    }
    fetchSets();
  }, [navigate]);

  const handleGenerate = async (type, setId) => {
    if (type === 'quizzes') {
      setLoading(true);
      try {
        const response = await endpoints.generateQuiz(setId);
        setLoading(false);
        if (response.status !== 401) {
          const data = await response.json();
          navigate('/quizzes', { state: { data } });
        } else {
          navigate('/');
        }
      } catch (err) {
        setLoading(false);
        alert(err);
      }
    } else if (type === 'flashcards') {
      navigate(`/flashcards`, { state: { id: setId } });
    } else if (type === 'matching') {
      navigate(`/matching`, { state: { id: setId } });
    }
  };

  return (
    <div className="sets-page">
      {loading && <LoadingOverlay message="Generating Quiz" />}
      <h2>Your Sets</h2>
      <div className="sets-list">
        {sets.map((set) => (
          <div
            key={set.id}
            className="set-item"
            onMouseEnter={() => setHoveredSet(set.id)}
            onMouseLeave={() => setHoveredSet(null)}
          >
            <h3>{set.title}</h3>
            <div className="action-buttons">
              <button onClick={() => handleGenerate('quizzes', set.id)}>Quiz</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
