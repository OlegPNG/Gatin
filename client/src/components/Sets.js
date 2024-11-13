import React, { useState, useEffect } from 'react';
import endpoints from '../services/endpoints';
import '../styles/Sets.css';
import { useNavigate } from 'react-router-dom';

export default function Sets() {
  const [sets, setSets] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchSets() {
      try {
        const response = await endpoints.getUserSets();
        if(response.status !== 401) {
          const data = await response.json()
          setSets(data.sets);
        } else {
          navigate('/')
        }
      } catch (error) {
        alert('Failed to load sets. ' + error);
      }
    }
    fetchSets();
  }, []);

  const handleGenerate = (type, setId) => {
    if (type === 'flashcards') {
      navigate(`/flashcards`,{ state: { id: setId } });
    } else if (type === 'quizzes') {
      navigate(`/quizzes`, { state: { id: setId  } });
    } else if (type === 'matching') {
      navigate(`/matching`, { state: { id: setId } });
    }
  };

  if(sets !== null) {
    //console.log("Number of sets: " + sets.length)
    /*if(sets[0] !== undefined) {
      console.log("Set Id: " + sets[0].id)
    }*/
    return (
      <div className="sets-page">
        <h2>Your Sets</h2>
        <button onClick={() => navigate('/create-set')}>Create New Set</button>
        <div className="sets-list">
          {sets.map((set) => (
            <div key={set.id} className="set-item">
              <h3>{set.title}</h3>
              <p>{set.description}</p>
              <button onClick={() => handleGenerate('flashcards', set.id)}>View Flashcards</button>
              <button onClick={() => handleGenerate('quizzes', set.id)}>Generate Quiz</button>
              <button onClick={() => handleGenerate('matching', set.id)}>Generate Matching</button>
            </div>
          ))}
        </div>
      </div>
    );
  } else {
    return (
      <div className="sets-page">
        <h2>Your Sets</h2>
        <button onClick={() => navigate('/create-set')}>Create New Set</button>
        <div className="sets-list">
        </div>
      </div>
    );
  }
}
