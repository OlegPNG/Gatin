import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import Sets from './components/Sets';
import CreateSet from './components/CreateSet';
import Flashcards from './components/Flashcards';
import Quizzes from './components/Quizzes';
import Matching from './components/Matching';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/sets" element={<Sets />} />
        <Route path="/create-set" element={<CreateSet />} />
        <Route path="/flashcards" element={<Flashcards />} />
        <Route path="/quizzes" element={<Quizzes />} />
        <Route path="/matching" element={<Matching />} />
      </Routes>
    </Router>
  );
}

