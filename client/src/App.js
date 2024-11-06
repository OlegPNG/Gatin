import React from 'react';
import Header from './components/Header';
import MenuSelection from './components/MenuSelection';
import ClassList from './components/ClassList';
import ChapterList from './components/ChapterList';
import './App.css';

function App() {
  return (
    <div className="app">
      <Header />
      <div className="main-content">
        <div className="sidebar">
          <MenuSelection />
          <ClassList />
        </div>
        <div className="content-area">
          <ChapterList />
        </div>
      </div>
    </div>
  );
}

export default App;
