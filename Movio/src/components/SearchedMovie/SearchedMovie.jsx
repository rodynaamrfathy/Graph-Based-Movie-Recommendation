import React from 'react';
import { useNavigate } from 'react-router-dom';
import { handleImageError, getPlaceholderPoster } from '../../utils/imageUtils';
import './SearchedMovie.css';

const SearchedMovie = ({ movie }) => {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    // Use imdb_id for navigation
    const movieId = movie.imdb_id || movie.id;
    navigate(`/movie/${encodeURIComponent(movieId)}`);
  };

  const handleViewIMDb = () => {
    if (movie.imdbUrl) {
      window.open(movie.imdbUrl, '_blank');
    }
  };

  if (!movie) return null;

  return (
    <div className="searched-movie-card">
      <div className="searched-movie-content">
        <div className="searched-movie-poster">
          <img
            src={movie.poster || getPlaceholderPoster()}
            alt={movie.title}
            onError={handleImageError}
          />
        </div>
        <div className="searched-movie-details">
          <h2 className="searched-movie-title">
            {movie.title}
            {movie.year && <span className="searched-movie-year"> ({movie.year})</span>}
          </h2>
          {movie.rating && (
            <div className="searched-movie-rating">
              <span className="star">⭐</span>
              <span>{movie.rating}</span>
            </div>
          )}
          {movie.genres && movie.genres.length > 0 && (
            <div className="searched-movie-genres">
              {movie.genres.map((genre, index) => (
                <span key={index} className="genre-tag">
                  {genre}
                </span>
              ))}
            </div>
          )}
          {movie.overview && (
            <p className="searched-movie-overview">{movie.overview}</p>
          )}
          <div className="searched-movie-actions">
            <button className="view-details-button" onClick={handleViewDetails}>
              View Full Details
            </button>
            {movie.imdbUrl && (
              <a
                href={movie.imdbUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="imdb-link"
                onClick={(e) => {
                  e.preventDefault();
                  handleViewIMDb();
                }}
              >
                View on IMDb
                <span className="external-icon">↗</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchedMovie;

