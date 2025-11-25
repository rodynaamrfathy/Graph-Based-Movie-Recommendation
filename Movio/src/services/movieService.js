// Import mock data for fallbacks
import {
  mockMovies,
  searchMockMovie,
  getMockMovieById,
  getMockRecommendations,
} from './mockData';

const readEnv = (viteKey, craKey) => {
  const viteValue =
    typeof import.meta !== 'undefined' && import.meta.env
      ? import.meta.env[viteKey]
      : undefined;
  const craValue =
    typeof process !== 'undefined' && process.env ? process.env[craKey] : undefined;
  return viteValue ?? craValue ?? undefined;
};

const normalizeUrl = (value) => {
  if (!value || typeof value !== 'string') return undefined;
  return value.endsWith('/') ? value.slice(0, -1) : value;
};

const API_BASE_URL =
  normalizeUrl(
    readEnv('VITE_API_BASE_URL', 'REACT_APP_API_BASE_URL'),
  ) || 'http://localhost:8000';

const USE_MOCK_DATA =
  (readEnv('VITE_USE_MOCK_DATA', 'REACT_APP_USE_MOCK_DATA') || 'false').toString().toLowerCase() ===
  'true';

const OMDB_API_KEY = readEnv('VITE_OMDB_API_KEY', 'REACT_APP_OMDB_API_KEY');
const DEFAULT_OMDB_KEY = 'trilogy'; // public demo key from OMDb docs

const cache = new Map();

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const handleFetchError = (error, defaultMessage) => {
  if (error?.name === 'TypeError' && error.message.includes('fetch')) {
    return new Error('Unable to reach the recommendation API. Please ensure the backend is running.');
  }
  if (error?.message) {
    return new Error(error.message);
  }
  return new Error(defaultMessage || 'An unexpected error occurred.');
};

const parseJSONResponse = async (response) => {
  const text = await response.text();
  if (text.trim().startsWith('<!DOCTYPE') || text.trim().startsWith('<html')) {
    throw new Error('Server returned HTML instead of JSON. Check your API base URL.');
  }
  try {
    return JSON.parse(text);
  } catch (error) {
    throw new Error(`Failed to parse server response: ${text.substring(0, 120)}...`);
  }
};

const apiRequest = async (path, options = {}) => {
  const url = `${API_BASE_URL}${path}`;
  const response = await fetch(url, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  });

  if (!response.ok) {
    const errorPayload = await response.text();
    let message = `Request failed: ${response.statusText}`;
    try {
      const parsed = JSON.parse(errorPayload);
      message = parsed.detail || parsed.message || message;
    } catch {
      if (errorPayload && errorPayload.length < 200) {
        message = errorPayload;
      }
    }
    throw new Error(message);
  }

  return parseJSONResponse(response);
};

const buildImdbUrl = (imdbId) =>
  imdbId ? `https://www.imdb.com/title/${encodeURIComponent(imdbId)}/` : null;

const buildPosterUrl = (movie, imdbId) => {
  if (!movie) return null;
  if (movie.poster_url || movie.posterUrl) return movie.poster_url || movie.posterUrl;
  if (movie.poster && movie.poster !== 'N/A') return movie.poster;
  if (movie.poster_path) return movie.poster_path;
  return null;
};

const buildOmdbImageUrl = (imdbId) => {
  if (!imdbId) return null;
  const key = OMDB_API_KEY || DEFAULT_OMDB_KEY;
  if (!key) return null;
  return `https://img.omdbapi.com/?apikey=${key}&i=${encodeURIComponent(imdbId)}`;
};

const ensurePoster = async (movie) => {
  if (!movie) return null;
  if ((movie.poster && movie.poster !== 'N/A') || !movie.imdbId) {
    return movie;
  }
  const posterUrl = buildOmdbImageUrl(movie.imdbId);
  if (posterUrl) {
    return { ...movie, poster: posterUrl };
  }
  return movie;
};

const mapApiMovie = (movie = {}) => {
  if (!movie) return null;
  const imdbId =
    movie.imdb_id || movie.imdbId || movie.id || movie.imdbID || null;

  return {
    id: imdbId || movie.title,
    imdbId,
    title: movie.title || movie.name || 'Unknown title',
    year: movie.year ?? null,
    runtime: movie.runtime ?? null,
    rating: movie.rating ?? null,
    votes: movie.votes ?? null,
    overview: movie.plot || movie.overview || movie.description || '',
    genres: movie.genres || movie.genre || [],
    directors: movie.directors || (movie.director ? [movie.director] : []),
    cast: movie.actors || movie.cast || [],
    keywords: movie.keywords || [],
    imdbUrl: movie.imdb_url || buildImdbUrl(imdbId),
    poster: buildPosterUrl(movie, imdbId),
  };
};

const selectBestMatch = (movies, query) => {
  if (!Array.isArray(movies) || movies.length === 0) return null;
  if (!query) return movies[0];

  const lowerQuery = query.trim().toLowerCase();
  return (
    movies.find((movie) => movie.title?.toLowerCase() === lowerQuery) ||
    movies[0]
  );
};

const searchMoviesRaw = async (keyword) => {
  const params = new URLSearchParams({ keyword });
  return apiRequest(`/movies/search/?${params.toString()}`);
};

const fetchMovieByTitle = async (title) => {
  if (!title) return null;
  const cacheKey = `title:${title.toLowerCase()}`;
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }
  try {
    const results = await searchMoviesRaw(title);
    const match = selectBestMatch(results, title);
    const mapped = mapApiMovie(match);
    if (!mapped) {
      return null;
    }
    const enriched = await ensurePoster(mapped);
    cache.set(cacheKey, enriched);
    return enriched;
  } catch (error) {
    console.warn(`Failed to fetch movie by title "${title}":`, error);
    return null;
  }
};

export const fetchPopularMovies = async () => {
  if (USE_MOCK_DATA) {
    await delay(400);
    const mappedMocks = Object.values(mockMovies).map(mapApiMovie);
    return Promise.all(mappedMocks.map(ensurePoster));
  }

  try {
    const data = await apiRequest('/movies/');
    const mapped = Array.isArray(data) ? data.map(mapApiMovie) : [];
    return Promise.all(mapped.map(ensurePoster));
  } catch (error) {
    console.warn('Failed to load popular movies, falling back to mock data.', error);
    const mappedMocks = Object.values(mockMovies).map(mapApiMovie);
    return Promise.all(mappedMocks.map(ensurePoster));
  }
};

export const searchMovie = async (query) => {
  if (!query?.trim()) return null;

  if (USE_MOCK_DATA) {
    await delay(300);
    return ensurePoster(mapApiMovie(searchMockMovie(query)));
  }

  try {
    const results = await searchMoviesRaw(query);
    const match = selectBestMatch(results, query);
    const mapped = mapApiMovie(match);
    if (!mapped) {
      return null;
    }
    return ensurePoster(mapped);
  } catch (error) {
    console.warn('Search failed, using mock data.', error);
    await delay(300);
    return ensurePoster(mapApiMovie(searchMockMovie(query)));
  }
};

export const getMovieDetails = async (imdbId) => {
  if (!imdbId) return null;

  if (USE_MOCK_DATA) {
    await delay(300);
    return ensurePoster(mapApiMovie(getMockMovieById(imdbId)));
  }

  try {
    const data = await apiRequest(`/movies/id/${encodeURIComponent(imdbId)}`);
    return ensurePoster(mapApiMovie(data));
  } catch (error) {
    console.error('Error fetching movie details, falling back to mock data.', error);
    await delay(300);
    return ensurePoster(mapApiMovie(getMockMovieById(imdbId)));
  }
};

const fetchActorRecommendations = async (movieTitle) => {
  const params = new URLSearchParams({ movie_name: movieTitle });
  const data = await apiRequest(`/MoviesRecommendByActor?${params.toString()}`);
  return data?.recommendations ?? [];
};

const fetchGenreRecommendations = async (movieTitle) => {
  const params = new URLSearchParams({ movie_name: movieTitle });
  const data = await apiRequest(`/MoviesRecommendByGenre?${params.toString()}`);
  return data?.recommendations ?? [];
};

const fetchContentRecommendations = async (movieTitle, topN = 8) => {
  const params = new URLSearchParams({
    movie_title: movieTitle,
    top_n: topN.toString(),
  });
  const data = await apiRequest(`/recommend/content-based?${params.toString()}`);
  return data?.recommendations ?? [];
};

const hydrateRecommendations = async (items = []) => {
  const limited = items.slice(0, 10);
  const hydrated = await Promise.all(
    limited.map(async (item) => {
      const imdbId = item.imdb_id || item.imdbId || item.id || null;

      if (imdbId) {
        try {
          const detailedById = await getMovieDetails(imdbId);
          if (detailedById) {
            return detailedById;
          }
        } catch (error) {
          console.warn(`Failed to fetch movie by IMDb ID "${imdbId}"`, error);
        }
      }

      if (item.title) {
        try {
          const detailedByTitle = await fetchMovieByTitle(item.title);
          if (detailedByTitle) {
            return detailedByTitle;
          }
        } catch (error) {
          console.warn(`Failed to fetch movie by title "${item.title}"`, error);
        }
      }

      return ensurePoster({
        id: imdbId || item.title,
        imdbId,
        title: item.title || 'Unknown title',
        year: item.year ?? null,
        rating: item.rating ?? null,
        overview: '',
        genres: [],
        directors: [],
        cast: [],
        keywords: [],
        imdbUrl: imdbId ? buildImdbUrl(imdbId) : null,
        poster: null,
      });
    }),
  );

  return hydrated.filter(Boolean);
};

export const getRecommendations = async (imdbId, movieTitle) => {
  if (USE_MOCK_DATA) {
    await delay(300);
    return getMockRecommendations(imdbId);
  }

  if (!movieTitle) {
    const details = await getMovieDetails(imdbId);
    movieTitle = details?.title;
  }

  if (!movieTitle) {
    return { byActors: [], byGenre: [], byContent: [] };
  }

  try {
    const [actorRaw, genreRaw, contentRaw] = await Promise.all([
      fetchActorRecommendations(movieTitle).catch((err) => {
        console.warn('Actor recommendations failed', err);
        return [];
      }),
      fetchGenreRecommendations(movieTitle).catch((err) => {
        console.warn('Genre recommendations failed', err);
        return [];
      }),
      fetchContentRecommendations(movieTitle).catch((err) => {
        console.warn('Content recommendations failed', err);
        return [];
      }),
    ]);

    const [byActors, byGenre, byContent] = await Promise.all([
      hydrateRecommendations(actorRaw),
      hydrateRecommendations(genreRaw),
      hydrateRecommendations(contentRaw),
    ]);

    return { byActors, byGenre, byContent };
  } catch (error) {
    console.error('Failed to fetch recommendations, using mock data.', error);
    return getMockRecommendations(imdbId);
  }
};

