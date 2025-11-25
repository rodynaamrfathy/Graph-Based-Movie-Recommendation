import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMovieDetails, getRecommendations } from '../../services/movieService';
import { handleImageError, getPlaceholderPoster } from '../../utils/imageUtils';
import RecommendationSection from '../../components/RecommendationSection/RecommendationSection.jsx';
import './MovieDetailsPage.css';

const MovieDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actorRecommendations, setActorRecommendations] = useState([]);
  const [genreRecommendations, setGenreRecommendations] = useState([]);
  const [contentRecommendations, setContentRecommendations] = useState([]);

  useEffect(() => {
    let isMounted = true;

    const fetchMovieDetails = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const movieData = await getMovieDetails(id);
        if (!isMounted) return;

        setMovie(movieData);

        if (movieData?.imdbId || movieData?.id || movieData?.title) {
          const recs = await getRecommendations(
            movieData.imdbId || movieData.id,
            movieData.title,
          );
          if (isMounted) {
            setActorRecommendations(recs.byActors || []);
            setGenreRecommendations(recs.byGenre || []);
            setContentRecommendations(recs.byContent || []);
          }
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Failed to load movie details. Please try again.');
        }
        console.error('Movie details error:', err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    if (id) {
      fetchMovieDetails();
    }

    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleBackToSearch = () => {
    navigate('/');
  };

  const handleViewIMDb = () => {
    if (movie?.imdbUrl) {
      window.open(movie.imdbUrl, '_blank');
    }
  };

  if (isLoading) {
    return (
      <div className="movie-details-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading movie details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="movie-details-page">
        <div className="error-container">
          <p>{error}</p>
          <button onClick={handleBackToSearch} className="back-button">
            Back to Search
          </button>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="movie-details-page">
        <div className="error-container">
          <p>Movie not found</p>
          <button onClick={handleBackToSearch} className="back-button">
            Back to Search
          </button>
        </div>
      </div>
    );
  }

  const directors = movie.directors && movie.directors.length > 0 ? movie.directors : [];
  const votesLabel =
    typeof movie.votes === 'number'
      ? movie.votes.toLocaleString()
      : movie.votes || null;

  return (
    <div className="movie-details-page">
      <div className="movie-details-container">
        <button onClick={handleBackToSearch} className="back-button">
          ← Back to Search
        </button>

        <div className="movie-details-content">
          <div className="movie-details-poster">
            <img
              src={movie.poster || getPlaceholderPoster()}
              alt={movie.title}
              onError={handleImageError}
            />
          </div>

          <div className="movie-details-info">
            <h1 className="movie-details-title">
              {movie.title}
              {movie.year && <span className="movie-details-year"> ({movie.year})</span>}
            </h1>

            <div className="movie-details-meta">
              {movie.runtime && (
                <div className="meta-item">
                  <span className="meta-icon">🕐</span>
                  <span>{movie.runtime} min</span>
                </div>
              )}
              {movie.rating && (
                <div className="meta-item">
                  <span className="star">⭐</span>
                  <span>{movie.rating}/10</span>
                </div>
              )}
              {votesLabel && (
                <div className="meta-item">
                  <span className="meta-icon">👤</span>
                  <span>{votesLabel}</span>
                </div>
              )}
            </div>

            {movie.overview && (
              <div className="movie-details-section">
                <h2 className="section-title">Overview</h2>
                <p className="section-content">{movie.overview}</p>
              </div>
            )}

            {directors.length > 0 && (
              <div className="movie-details-section">
                <h2 className="section-title">Director</h2>
                <div className="tag-list">
                  {directors.map((director) => (
                    <span key={director} className="tag">
                      {director}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {movie.genres && movie.genres.length > 0 && (
              <div className="movie-details-section">
                <h2 className="section-title">Genres</h2>
                <div className="tag-list">
                  {movie.genres.map((genre) => (
                    <span key={genre} className="tag">
                      {genre}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {movie.cast && movie.cast.length > 0 && (
              <div className="movie-details-section">
                <h2 className="section-title">Cast</h2>
                <div className="tag-list">
                  {movie.cast.map((actor) => (
                    <span key={actor} className="tag">
                      {actor}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {movie.keywords && movie.keywords.length > 0 && (
              <div className="movie-details-section">
                <h2 className="section-title">Keywords</h2>
                <div className="tag-list">
                  {movie.keywords.map((keyword) => (
                    <span key={keyword} className="tag">
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {movie.imdbUrl && (
              <button onClick={handleViewIMDb} className="imdb-button">
                View on IMDb
              </button>
            )}
          </div>
        </div>
        
        <div className="movie-recommendations-section">
          {contentRecommendations.length > 0 && (
            <RecommendationSection
              title="Based on Content"
              subtitle="Because of similar content"
              movies={contentRecommendations}
            />
          )}

          {actorRecommendations.length > 0 && (
            <RecommendationSection
              title="Based on Actors"
              subtitle="Because you liked these actors"
              movies={actorRecommendations}
            />
          )}

          {genreRecommendations.length > 0 && (
            <RecommendationSection
              title="Based on Genre"
              subtitle="Because you like this genre"
              movies={genreRecommendations}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieDetailsPage;

