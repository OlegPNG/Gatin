import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import endpoints from '../services/endpoints';
import '../styles/CreateSet.css';
import LoadingOverlay from './LoadingOverlay';

export default function CreateSet() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [course, setCourse] = useState('');
  const [unit, setUnit] = useState('');
  const [terms, setTerms] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      setFile(event.target.result);
    };
    reader.readAsText(uploadedFile);
  };

  const handleToggleFlashcardType = () => {
    setTerms(!terms);
  };

  const handleCreateSet = async () => {
    if (!file) {
      alert('Please upload a file.');
      return;
    }

    setLoading(true);

    const requestData = {
      notes: file,
      preferences: {
        terms: terms,
        course: course,
        unit: unit,
      },
      title: title,
      description: description,
    };

    try {
      const response = await endpoints.generateFlashcards(requestData);
      setLoading(false);
      if (response.status !== 401) {
        alert('Flashcards generated successfully!');
        navigate('/sets');
      } else {
        navigate('/');
      }
    } catch (error) {
      setLoading(false);
      alert('Failed to generate flashcards. ' + error.message);
    }
  };

  return (
    <div className="create-set-page">
      {loading && <LoadingOverlay message="Generating Set" />}
      <h2>Create New Set</h2>
      <input type="text" placeholder="Set Title" value={title} onChange={(e) => setTitle(e.target.value)} />
      <textarea placeholder="Set Description" value={description} onChange={(e) => setDescription(e.target.value)} />
      <input type="text" placeholder="Course" value={course} onChange={(e) => setCourse(e.target.value)} />
      <input type="text" placeholder="Unit" value={unit} onChange={(e) => setUnit(e.target.value)} />
      <div className="toggle-container">
        <label>Flashcard Type:</label>
        <button onClick={handleToggleFlashcardType}>
          {terms ? 'Regular Flashcards' : 'Q&A Flashcards'}
        </button>
      </div>
      <input type="file" accept=".md,.txt" onChange={handleFileUpload} />
      <button onClick={handleCreateSet}>Create Set</button>
    </div>
  );
}
