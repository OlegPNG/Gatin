import React, { useState, useEffect } from 'react';

function Flashcard() {
  const [flashcards, setFlashcards] = useState([]);
  const [error, setError] = useState(null);

  // Fetch the data from the API when the component mounts
  useEffect(() => {
    fetch('/api/flashcard')  // This URL will be proxied to https://www.gatin.dev/api/flashcard
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch flashcards');
        }
        return response.json();
      })
      .then(data => setFlashcards(data))  // Store the fetched flashcards in state
      .catch(err => setError(err.message));
  }, []);

  // Handle errors, if any
  if (error) {
    return <div>Error: {error}</div>;
  }

  // Render the flashcards in a list
  return (
    <div>
      <h1>Flashcards</h1>
      <ul>
        {flashcards.map((flashcard) => (
          <li key={flashcard.id}>
            <strong>Q:</strong> {flashcard.front}<br />
            <strong>A:</strong> {flashcard.back}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Flashcard;