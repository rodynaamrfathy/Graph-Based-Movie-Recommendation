import React, { useState, useEffect } from 'react';
import Header from '../../components/Header/Header.jsx';
import SearchBar from '../../components/SearchBar/SearchBar.jsx';
import SearchedMovie from '../../components/SearchedMovie/SearchedMovie.jsx';
import RecommendationSection from '../../components/RecommendationSection/RecommendationSection.jsx';
import HelpIcon from '../../components/HelpIcon/HelpIcon.jsx';
import { fetchPopularMovies, searchMovie } from '../../services/movieService';
import './SearchPage.css';

const SearchPage = () => {
  const [searchedMovie, setSearchedMovie] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [popularMovies, setPopularMovies] = useState([]);
  const [popularError, setPopularError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const loadPopularMovies = async () => {
      try {
        const movies = await fetchPopularMovies();
        if (isMounted) {
          setPopularMovies(movies);
          setPopularError(null);
        }
      } catch (err) {
        console.error('Failed to load popular movies', err);
        if (isMounted) {
          setPopularError('Unable to load popular movies right now.');
        }
      }
    };

    loadPopularMovies();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSearch = async (query) => {
    setIsLoading(true);
    setError(null);
    setSearchedMovie(null);

    try {
      // Search for the movie (always returns mock data if API fails)
      const movieData = await searchMovie(query);
      
      if (movieData) {
        setSearchedMovie(movieData);
        setError(null); // Clear any previous errors
      } else {
        setError('Movie not found. Please try another search.');
      }
    } catch (err) {
      // This should rarely happen now since searchMovie always falls back to mock data
      console.error('Unexpected search error:', err);
      setError('An unexpected error occurred. Please try again.');
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

        {!searchedMovie && !isLoading && (
          <>
            {popularError && (
              <div className="error-message">{popularError}</div>
            )}
            {popularMovies.length > 0 && (
              <RecommendationSection
                title="Popular Movies"
                subtitle="Discover trending movies"
                movies={popularMovies}
              />
            )}
          </>
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

