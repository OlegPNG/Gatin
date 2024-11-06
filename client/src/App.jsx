import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Add Router here
import Navigation from './components/Navigation';
import UploadForm from './components/UploadForm';
import Flashcards from './components/Flashcards';
import Quizzes from './components/Quizzes';
import Matching from './components/Matching'; // Import Matching component
import './styles/App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navigation />
        <Routes>
          <Route path="/" element={<UploadForm />} />
          <Route path="/flashcards" element={<Flashcards />} />
          <Route path="/quizzes" element={<Quizzes />} />
          <Route path="/matching" element={<Matching />} /> {/* Add Matching route */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
