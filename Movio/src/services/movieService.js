// API Base URL - Update this to match your backend URL
// In Vite, use import.meta.env.VITE_* for environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

// OMDB API configuration
const OMDB_API_KEY = import.meta.env.VITE_OMDB_API_KEY || '2d188dad';
const OMDB_API_URL = 'https://www.omdbapi.com';

/**
 * Handle fetch errors with better error messages
 */
const handleFetchError = (error, defaultMessage) => {
  if (error.name === 'TypeError' && error.message.includes('fetch')) {
    return new Error('Unable to connect to the server. Please check if the backend is running.');
  }
  if (error.message && error.message.includes('JSON')) {
    return new Error('Server returned an invalid response. Please check if the backend API is running and the URL is correct.');
  }
  if (error.message) {
    return error;
  }
  return new Error(defaultMessage || 'An unexpected error occurred');
};

/**
 * Parse JSON response with better error handling
 */
const parseJSONResponse = async (response) => {
  const text = await response.text();
  
  // Check if response is HTML (common when server returns error page)
  if (text.trim().startsWith('<!DOCTYPE') || text.trim().startsWith('<html')) {
    throw new Error('Server returned HTML instead of JSON. The API endpoint may be incorrect or the server is not running.');
  }
  
  try {
    return JSON.parse(text);
  } catch (parseError) {
    throw new Error(`Invalid JSON response from server: ${text.substring(0, 100)}...`);
  }
};

/**
 * Fetch movie poster from OMDB API
 * @param {string} imdbId - IMDb ID (e.g., "tt3896198")
 * @returns {Promise<string|null>} Poster URL or null if not found
 */
const fetchPosterFromOMDB = async (imdbId) => {
  if (!imdbId || !imdbId.startsWith('tt')) {
    return null;
  }

  try {
    const response = await fetch(`${OMDB_API_URL}/?i=${encodeURIComponent(imdbId)}&apikey=${OMDB_API_KEY}`);
    
    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    
    // Check if response is valid and has a poster
    if (data.Response === 'True' && data.Poster && data.Poster !== 'N/A') {
      return data.Poster;
    }
    
    return null;
  } catch (error) {
    console.warn(`Failed to fetch poster for ${imdbId}:`, error);
    return null;
  }
};

/**
 * Transform backend movie format to frontend format
 * @param {Object} movie - Movie data from backend
 * @param {boolean} fetchPoster - Whether to fetch poster from OMDB (default: true)
 * @returns {Promise<Object>} Transformed movie object
 */
const transformMovie = async (movie, fetchPoster = true) => {
  if (!movie) return null;
  
  // Handle error responses
  if (movie.error) {
    return null;
  }
  
  // Fetch poster from OMDB if imdb_id is available
  let poster = null;
  if (fetchPoster && movie.imdb_id) {
    poster = await fetchPosterFromOMDB(movie.imdb_id);
  }
  
  return {
    id: movie.imdb_id, // Use imdb_id as id for navigation
    imdb_id: movie.imdb_id,
    title: movie.title,
    year: movie.year,
    duration: movie.runtime, // Map runtime to duration
    rating: movie.rating,
    votes: movie.votes ? String(movie.votes) : null,
    overview: movie.plot, // Map plot to overview
    plot: movie.plot,
    poster: poster,
    director: movie.directors && movie.directors.length > 0 ? movie.directors[0] : null,
    directors: movie.directors || [],
    genres: movie.genres || [],
    cast: movie.actors || [], // Map actors to cast
    actors: movie.actors || [],
    keywords: movie.keywords || [],
    imdbUrl: movie.imdb_url || movie.imdbUrl,
  };
};

/**
 * Transform recommendation movie format to frontend format
 * @param {Object} rec - Recommendation data from backend
 * @param {boolean} fetchPoster - Whether to fetch poster from OMDB (default: true)
 * @returns {Promise<Object>} Transformed recommendation movie object
 */
const transformRecommendationMovie = async (rec, fetchPoster = true) => {
  // Recommendations may not have imdb_id, so we'll use title as identifier
  // When navigating, we'll need to search by title first
  const title = rec.title || rec.RecommendedMovie;
  
  // Fetch poster from OMDB if imdb_id is available
  let poster = null;
  if (fetchPoster && rec.imdb_id) {
    poster = await fetchPosterFromOMDB(rec.imdb_id);
  }
  
  return {
    id: rec.imdb_id || title, // Use imdb_id if available, otherwise title
    imdb_id: rec.imdb_id || null,
    title: title,
    year: rec.year || rec.Year,
    rating: rec.rating || rec.Rating,
    poster: poster,
    // Store title for searching if imdb_id is missing
    _needsSearch: !rec.imdb_id,
  };
};

/**
 * Search for a movie by keyword
 * @param {string} query - Movie name or keyword to search for
 * @returns {Promise<Object>} Movie data (first result from search)
 */
export const searchMovie = async (query) => {
  try {
    const response = await fetch(`${API_BASE_URL}/movies/search/?keyword=${encodeURIComponent(query)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = `Failed to search movie: ${response.statusText}`;
      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.detail || errorData.error || errorMessage;
      } catch (e) {
        // If response is not JSON, use the text
        if (errorText && errorText.length < 200) {
          errorMessage = errorText;
        }
      }
      throw new Error(errorMessage);
    }

    const data = await parseJSONResponse(response);
    
    // Handle error response
    if (data.error) {
      throw new Error(data.error);
    }
    
    // Search returns an array, take the first result
    if (Array.isArray(data) && data.length > 0) {
      return await transformMovie(data[0]);
    }
    
    throw new Error('No movies found for this search');
  } catch (error) {
    console.error('Error searching movie:', error);
    throw handleFetchError(error, 'Failed to search movie. Please try again.');
  }
};

/**
 * Get movie details by IMDb ID
 * @param {string} imdbId - Movie IMDb ID
 * @returns {Promise<Object>} Movie details
 */
export const getMovieDetails = async (imdbId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/movies/id/${encodeURIComponent(imdbId)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = `Failed to get movie details: ${response.statusText}`;
      
      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.detail || errorData.error || errorMessage;
      } catch (e) {
        if (errorText && errorText.length < 200) {
          errorMessage = errorText;
        }
      }
      throw new Error(errorMessage);
    }

    const data = await parseJSONResponse(response);
    
    // Handle error response
    if (data.error) {
      throw new Error(data.error);
    }
    
    return await transformMovie(data);
  } catch (error) {
    console.error('Error getting movie details:', error);
    throw handleFetchError(error, 'Failed to load movie details. Please try again.');
  }
};

/**
 * Get movie recommendations by actor, genre, and content
 * @param {string} movieTitle - Movie title (not ID, as backend requires title)
 * @returns {Promise<Object>} Recommendations object with byActors, byGenre, and byContent arrays
 */
export const getRecommendations = async (movieTitle) => {
  try {
    // Create form data for actor and genre recommendations (they use Form data)
    const formData = new FormData();
    formData.append('movie_name', movieTitle);
    
    // Fetch all three recommendation types in parallel
    // Note: Using POST for actor and genre recommendations since they use Form data
    // If backend requires GET, you may need to update backend to accept query parameters
    const [actorResponse, genreResponse, contentResponse] = await Promise.allSettled([
      fetch(`${API_BASE_URL}/MoviesRecommendByActor`, {
        method: 'POST',
        body: formData,
      }),
      fetch(`${API_BASE_URL}/MoviesRecommendByGenre`, {
        method: 'POST',
        body: formData,
      }),
      fetch(`${API_BASE_URL}/recommend/content-based?movie_title=${encodeURIComponent(movieTitle)}&top_n=20`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    ]);

    const recommendations = {
      byActors: [],
      byGenre: [],
      byContent: [],
    };

    // Process actor recommendations
    if (actorResponse.status === 'fulfilled' && actorResponse.value.ok) {
      try {
        const actorData = await parseJSONResponse(actorResponse.value);
        if (actorData.recommendations && !actorData.error) {
          // Fetch posters for all recommendations in parallel
          recommendations.byActors = await Promise.all(
            actorData.recommendations.map(rec => transformRecommendationMovie(rec))
          );
        }
      } catch (e) {
        console.warn('Failed to parse actor recommendations:', e);
      }
    }

    // Process genre recommendations
    if (genreResponse.status === 'fulfilled' && genreResponse.value.ok) {
      try {
        const genreData = await parseJSONResponse(genreResponse.value);
        if (genreData.recommendations && !genreData.error) {
          // Fetch posters for all recommendations in parallel
          recommendations.byGenre = await Promise.all(
            genreData.recommendations.map(rec => transformRecommendationMovie(rec))
          );
        }
      } catch (e) {
        console.warn('Failed to parse genre recommendations:', e);
      }
    }

    // Process content-based recommendations
    if (contentResponse.status === 'fulfilled' && contentResponse.value.ok) {
      try {
        const contentData = await parseJSONResponse(contentResponse.value);
        if (contentData.recommendations && !contentData.error) {
          // Fetch posters for all recommendations in parallel
          recommendations.byContent = await Promise.all(
            contentData.recommendations.map(rec => transformRecommendationMovie(rec))
          );
        }
      } catch (e) {
        console.warn('Failed to parse content recommendations:', e);
      }
    }

    return recommendations;
  } catch (error) {
    console.warn('Error getting recommendations:', error);
    // Return empty recommendations instead of throwing
    return {
      byActors: [],
      byGenre: [],
      byContent: [],
    };
  }
};

/**
 * Get all movies (for popular movies list)
 * @returns {Promise<Array>} Array of movies
 */
export const getAllMovies = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/movies/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to get movies: ${response.statusText}`);
    }

    const data = await parseJSONResponse(response);
    
    if (Array.isArray(data)) {
      // Transform all movies and fetch posters in parallel
      const transformedMovies = await Promise.all(
        data.map(movie => transformMovie(movie))
      );
      return transformedMovies.filter(movie => movie !== null);
    }
    
    return [];
  } catch (error) {
    console.error('Error getting all movies:', error);
    return [];
  }
};
