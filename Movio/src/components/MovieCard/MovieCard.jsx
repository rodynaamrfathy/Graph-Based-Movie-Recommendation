import React from 'react';
import { useNavigate } from 'react-router-dom';
import { handleImageError, getPlaceholderPoster } from '../../utils/imageUtils';
import './MovieCard.css';

const MovieCard = ({ movie, onClick }) => {
  const navigate = useNavigate();

  if (!movie) {
    return null;
  }

  const movieIdentifier = movie.imdbId || movie.id;

  const handleClick = () => {
    if (onClick) {
      onClick(movie);
      return;
    }
    if (movieIdentifier) {
      navigate(`/movie/${movieIdentifier}`);
    }
  };

  return (
    <div className="movie-card" onClick={handleClick} role="button" tabIndex={0}>
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


