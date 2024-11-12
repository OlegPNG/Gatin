import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import endpoints from '../services/endpoints';
import '../styles/CreateSet.css';

export default function CreateSet() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [flashcardType, setFlashcardType] = useState('regular'); // Define flashcardType state
  const navigate = useNavigate();

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (foo) => {
      setFile(foo.target.result);
    };
    reader.readAsText(file);
    console.log('File Content: ' + file);
  };

  const handleCreateSet = async () => {
    if (!file) {
      alert('Please upload a file.');
      return;
    }

    // Create a simple JavaScript object with the required data
    const requestData = {
      title,
      description,
      notes: file,
      flashcardType,
    };

    try {
      const response = await endpoints.generateFlashcards(requestData);
      if (response.status !== 401) {
        alert('Flashcards generated successfully!');
        navigate('/sets');
      } else {
        navigate('/');
      }
    } catch (error) {
      alert('Failed to generate flashcards. ' + error);
    }
  };

  const handleToggle = () => {
    // Toggle between 'regular' and 'qa' types
    setFlashcardType((prevType) => (prevType === 'regular' ? 'qa' : 'regular'));
  };

  return (
    <div className="create-set-page">
      <h2>Create New Set</h2>
      <input
        type="text"
        placeholder="Set Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        placeholder="Set Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <input type="file" accept=".md,.txt" onChange={handleFileUpload} />
      <button onClick={handleToggle}>
        Toggle Flashcard Type: {flashcardType === 'regular' ? 'Regular' : 'Question & Answer'}
      </button>
      <button onClick={handleCreateSet}>Create Set</button>
    </div>
  );
}
