import React, { useState, useEffect } from 'react';
import endpoints from '../services/endpoints';
import '../styles/Sets.css';
import { useNavigate } from 'react-router-dom';
import LoadingOverlay from './LoadingOverlay';

export default function Sets() {
  const [sets, setSets] = useState([]);
  const [hoveredSet, setHoveredSet] = useState(null);
  const [enlargedSet, setEnlargedSet] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // Track if in edit mode
  const navigate = useNavigate();

  const setsPerPage = currentPage === 0 ? 3 : 4; // 3 sets on the first page, 4 on subsequent pages

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

  const handleGenerateQuiz = async (setId) => {
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
    } catch (error) {
      setLoading(false);
      alert('Failed to generate quiz. ' + error.message);
    }
  };

  const handleGenerate = (type, setId) => {
    if (type === 'flashcards') {
      navigate('/flashcards', { state: { id: setId } });
    } else if (type === 'quizzes') {
      handleGenerateQuiz(setId);
    } else if (type === 'matching') {
      navigate('/matching', { state: { id: setId } });
    }
  };

  const handleEnlarge = (setId) => {
    setEnlargedSet(enlargedSet === setId ? null : setId);
  };

  // New Delete Set Functionality
  const handleDeleteSet = async (setId) => {
    try {
      const response = await endpoints.deleteSet(setId);
      if (response.status === 200) {
        setSets(sets.filter((set) => set.id !== setId)); // Remove the deleted set from the state
      } else {
        alert('Failed to delete set.');
      }
    } catch (error) {
      alert('Error deleting set: ' + error.message);
    }
  };

  const startIndex = currentPage === 0 ? 0 : (currentPage - 1) * 4 + 3;
  const paginatedSets = sets.slice(startIndex, startIndex + setsPerPage);

  const nextPage = () => {
    if (startIndex + setsPerPage < sets.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const toggleEditMode = () => {
    setIsEditing(!isEditing);
  };

  return (
    <div className="sets-page">
      {loading && <LoadingOverlay message="Loading Quiz..." />}
      <h2>Gatin</h2>
      <div className="sets-list">
        {currentPage === 0 && (
          <div className="set-item static-card" onClick={() => navigate('/create-set')}>
            <h3>Create New Set</h3>
            <p>+</p>
          </div>
        )}
        {paginatedSets.map((set) => (
          <div
            key={set.id}
            className={`set-item ${enlargedSet === set.id ? 'enlarged' : ''}`}
            onMouseEnter={() => setHoveredSet(set.id)}
            onMouseLeave={() => setHoveredSet(null)}
            onClick={() => handleEnlarge(set.id)}
          >
            <h3>{set.title}</h3>
            <p>{set.description}</p>
            {isEditing && (
              <button
                className="delete-button"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent the item click
                  handleDeleteSet(set.id);
                }}
              >
                X
              </button>
            )}
            {hoveredSet === set.id && !isEditing && (
              <div className="set-buttons">
                <button onClick={() => handleGenerate('flashcards', set.id)}>View Flashcards</button>
                <button onClick={() => handleGenerate('quizzes', set.id)}>Generate Quiz</button>
                <button onClick={() => handleGenerate('matching', set.id)}>Generate Matching</button>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="pagination-buttons">
        <button onClick={prevPage} disabled={currentPage === 0}>
          Back
        </button>
        <button onClick={nextPage} disabled={startIndex + setsPerPage >= sets.length}>
          Next
        </button>
      </div>
      <button className="edit-button" onClick={toggleEditMode}>
        {isEditing ? 'Stop Editing' : 'Edit Sets'}
      </button>
    </div>
  );
}
