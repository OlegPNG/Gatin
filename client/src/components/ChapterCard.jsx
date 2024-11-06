import React from 'react';
import './ChapterCard.css';
import { FaPlus, FaBars, FaCommentDots } from 'react-icons/fa';

const ChapterCard = ({ chapterTitle, cardCount }) => {
  return (
    <div className="chapter-card">
      <div className="chapter-header">
        <div className="chapter-info">
          <span className="chapter-title">{chapterTitle}</span>
          <span className="card-count">{cardCount} cards</span>
        </div>
        <FaBars className="options-icon" />
      </div>
      <div className="chapter-actions">
        <button className="action-button">
          <FaPlus /> Add
        </button>
        <button className="action-button">
          <FaCommentDots /> Discussion
        </button>
      </div>
    </div>
  );
};

export default ChapterCard;
