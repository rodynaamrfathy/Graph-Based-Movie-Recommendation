import React from 'react';
import { useNavigate } from 'react-router-dom';
import { handleImageError, getPlaceholderPoster } from '../../utils/imageUtils';
import './MovieCard.css';

const MovieCard = ({ movie, onClick }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick(movie);
    } else {
      navigate(`/movie/${movie.id}`);
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

