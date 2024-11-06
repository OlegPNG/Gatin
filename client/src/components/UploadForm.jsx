import React, { useState } from 'react';
import Navigation from './Navigation';
import endpoints from '../services/endpoints.js'; // Ensure the correct import path
import '../styles/UploadForm.css';

function UploadForm() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setStatus('Please select a file first.');
      return;
    }

    // Check for valid file types (Markdown and Text)
    const validTypes = ['text/markdown', 'text/plain'];
    if (!validTypes.includes(file.type)) {
      setStatus('Invalid file type. Please upload a Markdown (.md) or Text (.txt) file.');
      return;
    }

    // Read the file content
    const reader = new FileReader();
    reader.onload = async () => {
      const fileContent = reader.result;  // The content of the file as a string

      try {
        setStatus('Uploading...');
        const response = await endpoints.generateFlashcards({ text: fileContent }); // Send text content to the backend
        setStatus('File uploaded successfully! Flashcards generated.');
      } catch (error) {
        setStatus(`Error: ${error.message}`);
      }
    };
    reader.onerror = () => {
      setStatus('Error reading the file.');
    };

    reader.readAsText(file);  // Read the file as text
  };

  return (
    <div>
      <Navigation />
      <h1>Upload File to Generate Flashcards</h1>
      <form onSubmit={handleUpload}>
        <input type="file" onChange={handleFileChange} />
        <button type="submit">Upload</button>
      </form>
      <p>{status}</p>
    </div>
  );
}

export default UploadForm;
