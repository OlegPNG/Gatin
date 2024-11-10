import React, { useState } from 'react';
import endpoints from '../services/endpoints';
import '../styles/CreateSet.css';
import { useNavigate } from 'react-router-dom';

export default function CreateSet() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  const handleFileUpload = (e) => {
    setFile(e.target.files[0]);
  };

  const handleCreateSet = async () => {
    if (!file) {
      alert('Please upload a file.');
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('file', file);

    const response = await endpoints.generateFlashcards(formData);
    if (response.success) {
      alert('Flashcards generated successfully!');
      navigate('/sets');
    } else {
      alert('Failed to generate flashcards.');
    }
  };

  return (
    <div className="create-set-page">
      <h2>Create New Set</h2>
      <input
        type="text"
        placeholder="Set Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <textarea
        placeholder="Set Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <input type="file" accept=".md,.txt" onChange={handleFileUpload} />
      <button onClick={handleCreateSet}>Create Set</button>
    </div>
  );
}
