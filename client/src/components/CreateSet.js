import React, { useState } from 'react';
import endpoints from '../services/endpoints';
import '../styles/CreateSet.css';
import { useNavigate } from 'react-router-dom';

export default function CreateSet() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  const handleFileUpload = (e) => {
    var file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (foo) => {
      setFile(foo.target.result);
    };
    //setFile(e.target.files[0]);
    reader.readAsText(file);
    console.log('File Content: ' + file)
  };

  const handleCreateSet = async () => {
    if (!file) {
      alert('Please upload a file.');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('notes', file);

    try {
      const response = await endpoints.generateFlashcards(formData);
      if (response.status !== 401) {
        alert('Flashcards generated successfully!');
        navigate('/sets');
      } else {
        navigate('/');
      };
    } catch(error) {
      alert('Failed to generate flashcards. ' + error);
    }
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
      <button onClick={handleCreateSet}>Create Set</button>
    </div>
  );
}
