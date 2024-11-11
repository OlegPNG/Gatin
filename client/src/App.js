// src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import MenuSelection from './components/MenuSelection';
import ClassList from './components/ClassList';
import ChapterList from './components/ChapterList';
import Quizzes from './pages/Quizzes'; 
import Flashcards from './pages/Flashcards';
import Matching from './pages/Matching';
import LoginForm from './components/LoginForm';
import './App.css';

function App() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  const handleLoginClick = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleLogin = (email, password) => {
    if (email === 'test@example.com' && password === 'password') {
      setLoggedIn(true);
      setUserEmail(email);
      setModalOpen(false);
    } else {
      alert('Invalid login credentials');
    }
  };

  return (
    <Router>
      <div className="app">
        <Header 
          onLoginClick={handleLoginClick} 
          isLoggedIn={isLoggedIn} 
          userEmail={userEmail} 
        />
        <div className="main-content">
          <div className="sidebar">
            <MenuSelection />
            <ClassList />
          </div>
          <div className="content-area">
            <Routes>
              <Route path="/" element={<ChapterList />} /> {/* Default homepage */}
              <Route path="/quizzes" element={<Quizzes />} /> {/* Quizzes page */}
              <Route path="/flashcards" element={<Flashcards />} />
              <Route path="/matching" element={<Matching />} />
            </Routes>
          </div>
        </div>
        <LoginForm show={isModalOpen} onClose={handleCloseModal} onLogin={handleLogin} />
      </div>
    </Router>
  );
}

export default App;
