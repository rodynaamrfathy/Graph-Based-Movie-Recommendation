import React from 'react';
import { useNavigate } from 'react-router-dom';
import { handleImageError, getPlaceholderPoster } from '../../utils/imageUtils';
import { searchMovie } from '../../services/movieService';
import './MovieCard.css';

const MovieCard = ({ movie, onClick }) => {
  const navigate = useNavigate();

  const handleClick = async () => {
    if (onClick) {
      onClick(movie);
    } else {
      // If movie has imdb_id, navigate directly
      if (movie.imdb_id) {
        navigate(`/movie/${encodeURIComponent(movie.imdb_id)}`);
      } else if (movie.title) {
        // If no imdb_id, search by title first to get the imdb_id
        try {
          const movieData = await searchMovie(movie.title);
          if (movieData && movieData.imdb_id) {
            navigate(`/movie/${encodeURIComponent(movieData.imdb_id)}`);
          } else {
            // Fallback: try to navigate with title (may not work)
            console.warn('Could not find imdb_id for movie:', movie.title);
            navigate(`/movie/${encodeURIComponent(movie.title)}`);
          }
        } catch (error) {
          console.error('Error searching for movie:', error);
          // Fallback: try to navigate with title
          navigate(`/movie/${encodeURIComponent(movie.title)}`);
        }
      } else {
        // Fallback: use id if available
        const movieId = movie.id;
        if (movieId) {
          navigate(`/movie/${encodeURIComponent(movieId)}`);
        }
      }
    }
  };

  return (
    <div className="movie-card" onClick={handleClick}>
      <div className="movie-poster-container">
        <img
          src={movie.poster || getPlaceholderPoster()}
          alt={movie.title}
          className="movie-poster"
          onError={handleImageError}
        />
      </div>
      <div className="movie-info">
        <h3 className="movie-title">{movie.title}</h3>
        {movie.year && <p className="movie-year">{movie.year}</p>}
        {movie.rating && (
          <div className="movie-rating">
            <span className="star">⭐</span>
            <span>{movie.rating}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieCard;

