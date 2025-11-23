import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SearchPage from './pages/SearchPage/SearchPage.jsx';
import MovieDetailsPage from './pages/MovieDetailsPage/MovieDetailsPage.jsx';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SearchPage />} />
        <Route path="/movie/:id" element={<MovieDetailsPage />} />
      </Routes>
    </Router>
  );
}

export default App;

