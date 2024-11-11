// src/pages/Matching.js
import React, { useState, useEffect } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Modal from '../components/Modal'; // Import Modal component
import './Matching.css';

const matchingData = [
  { id: 1, term: "React", definition: "A JavaScript library for building user interfaces" },
  { id: 2, term: "Component", definition: "A reusable piece of code that represents part of a UI" },
  { id: 3, term: "JSX", definition: "A syntax extension for JavaScript that looks similar to XML or HTML" },
];

const Matching = () => {
  const [matchedPairs, setMatchedPairs] = useState([]); // Tracks IDs of matched pairs
  const [showCompletionModal, setShowCompletionModal] = useState(false); // Show modal on completion

  // Check if all pairs are matched and show the modal
  useEffect(() => {
    if (matchedPairs.length === matchingData.length) {
      setShowCompletionModal(true); // Display modal if all pairs are matched
    }
  }, [matchedPairs]);

  // Reset the game
  const resetGame = () => {
    setMatchedPairs([]);
    setShowCompletionModal(false);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="matching-page">
        <h2>Matching Game</h2>
        <div className="matching-container">
          <div className="terms-column">
            <h3>Terms</h3>
            {matchingData.map((item) => (
              <DraggableTerm
                key={item.id}
                item={item}
                isMatched={matchedPairs.includes(item.id)}
              />
            ))}
          </div>
          <div className="definitions-column">
            <h3>Definitions</h3>
            {matchingData.map((item) => (
              <DroppableDefinition
                key={item.id}
                item={item}
                isMatched={matchedPairs.includes(item.id)}
                onMatch={(id) => setMatchedPairs((prev) => [...prev, id])}
              />
            ))}
          </div>
        </div>
        
        {/* Show the modal when all pairs are matched */}
        {showCompletionModal && (
          <Modal
            message="🎉 Congratulations! You matched all pairs! Would you like to play again?"
            onConfirm={resetGame} // Reset game if confirmed
            onCancel={() => setShowCompletionModal(false)} // Close modal if canceled
          />
        )}
      </div>
    </DndProvider>
  );
};

// DraggableTerm component
const DraggableTerm = ({ item, isMatched }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'TERM',
    item: { id: item.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }), [item.id]);

  return (
    <div
      ref={drag}
      className={`term-item ${isMatched ? 'matched' : ''}`}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      {item.term}
    </div>
  );
};

// DroppableDefinition component
const DroppableDefinition = ({ item, isMatched, onMatch }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'TERM',
    drop: (draggedItem) => {
      if (draggedItem.id === item.id && !isMatched) { // Only match if not already matched
        onMatch(item.id); // Correct match
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }), [item.id, isMatched]);

  return (
    <div
      ref={drop}
      className={`definition-item ${isMatched ? 'matched' : ''} ${isOver && !isMatched ? 'hovered' : ''}`}
    >
      {isMatched ? <s>{item.definition}</s> : item.definition}
    </div>
  );
};

export default Matching;
