import React from 'react';
import './App.css'; // Ensure to use the main CSS for consistent styling

const chapters = [
  { title: 'Chapter 1', cards: 33 },
  { title: 'Chapter 2', cards: 45 },
  { title: 'Chapter 3', cards: 27 },
];

const ChapterList = () => {
  return (
    <div className="chapter-list">
      {chapters.map((chapter, index) => (
        <div key={index} className="chapter-card">
          <div className="chapter-title">{chapter.title}</div>
          <div className="chapter-cards">{chapter.cards} Cards</div>
          <div className="chapter-buttons">
            <button className="chapter-button">Flashcards</button>
            <button className="chapter-button">Notes</button>
            <button className="chapter-button">Discussion</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChapterList;
