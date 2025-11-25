import React, { useState, useEffect } from 'react';
import Header from '../../components/Header/Header.jsx';
import SearchBar from '../../components/SearchBar/SearchBar.jsx';
import SearchedMovie from '../../components/SearchedMovie/SearchedMovie.jsx';
import RecommendationSection from '../../components/RecommendationSection/RecommendationSection.jsx';
import HelpIcon from '../../components/HelpIcon/HelpIcon.jsx';
import { searchMovie, getAllMovies } from '../../services/movieService';
import './SearchPage.css';

const SearchPage = () => {
  const [searchedMovie, setSearchedMovie] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [allMovies, setAllMovies] = useState([]);

  // Load all movies on component mount
  useEffect(() => {
    const loadAllMovies = async () => {
      try {
        const movies = await getAllMovies();
        setAllMovies(movies);
      } catch (err) {
        console.error('Failed to load movies:', err);
        // Set empty array on error
        setAllMovies([]);
      }
    };
    loadAllMovies();
  }, []);

  const handleSearch = async (query) => {
    setIsLoading(true);
    setError(null);
    setSearchedMovie(null);

    try {
      const movieData = await searchMovie(query);
      
      if (movieData) {
        setSearchedMovie(movieData);
        setError(null); // Clear any previous errors
      } else {
        setError('Movie not found. Please try another search.');
      }
    } catch (err) {
      console.error('Search error:', err);
      setError(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="search-page">
      <Header />
      <div className="search-page-content">
        <SearchBar onSearch={handleSearch} isLoading={isLoading} />
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {!searchedMovie && !isLoading && !error && allMovies.length > 0 && (
          <RecommendationSection
            title="All Movies"
            subtitle="Browse our complete movie collection"
            movies={allMovies}
          />
        )}

        {searchedMovie && (
          <SearchedMovie movie={searchedMovie} />
        )}
      </div>
      <HelpIcon />
    </div>
  );
};

export default SearchPage;

