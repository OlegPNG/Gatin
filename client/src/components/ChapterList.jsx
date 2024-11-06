import React from 'react';
import ChapterCard from './ChapterCard';
import './ChapterList.css';

const chapters = [
  { title: 'Chapter 1', cardCount: 33 },
  { title: 'Chapter 2', cardCount: 45 },
  { title: 'Chapter 3', cardCount: 27 }
];

const ChapterList = () => {
  return (
    <div className="chapter-list">
      <h2>Chapters</h2>
      {chapters.map((chapter, index) => (
        <ChapterCard 
          key={index} 
          chapterTitle={chapter.title} 
          cardCount={chapter.cardCount} 
        />
      ))}
      <div className="chapter-navigation">
        <button className="nav-button">Next</button>
      </div>
    </div>
  );
};

export default ChapterList;
