// ChapterList.jsx
import React from 'react';
import './ChapterList.css';

function ChapterCard({ chapter, cardCount }) {
    return (
        <div className="card">
            <h2 className="chapter-title">{chapter}</h2>
            <p className="card-count">{cardCount} Cards</p>
            <div className="actions">
                <button className="button">All Flashcards</button>
                <button className="button">Next</button>
                <button className="button">Discussion Board</button>
            </div>
        </div>
    );
}

function ChapterList() {
    const chapters = [
        { chapter: 'Chapter 1', cardCount: 33 },
        { chapter: 'Chapter 2', cardCount: 45 },
        { chapter: 'Chapter 3', cardCount: 27 },
    ];

    return (
        <section className="chapter-list">
            {chapters.map((ch, index) => (
                <ChapterCard key={index} chapter={ch.chapter} cardCount={ch.cardCount} />
            ))}
        </section>
    );
}

export default ChapterList;
