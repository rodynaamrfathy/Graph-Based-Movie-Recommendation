// Import mock data
import {
  searchMockMovie,
  getMockMovieById,
  getMockRecommendations,
} from './mockData';

// API Base URL - Update this to match your backend URL
// In Vite, use import.meta.env.VITE_* for environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

// Use mock data for testing (set to true to use mock data, false to use real API)
// The app will automatically fallback to mock data if API fails
const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === 'true' || false;

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
 * Search for a movie by name
 * @param {string} query - Movie name to search for
 * @returns {Promise<Object>} Movie data
 */
export const searchMovie = async (query) => {
  // Use mock data if enabled
  if (USE_MOCK_DATA) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    const mockMovie = searchMockMovie(query);
    console.log('Using mock data for search:', query);
    return mockMovie;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/movies/search?q=${encodeURIComponent(query)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      
      // Check if response is HTML
      if (errorText.trim().startsWith('<!DOCTYPE') || errorText.trim().startsWith('<html')) {
        // Fallback to mock data instead of throwing error
        console.warn('Server returned HTML, falling back to mock data');
        await new Promise(resolve => setTimeout(resolve, 300));
        return searchMockMovie(query);
      }
      
      // For other errors, try to parse and fallback
      let errorMessage = `Failed to search movie: ${response.statusText}`;
      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.message || errorMessage;
      } catch (e) {
        // If response is not JSON, fallback to mock data
        console.warn('Invalid response format, falling back to mock data');
        await new Promise(resolve => setTimeout(resolve, 300));
        return searchMockMovie(query);
      }
      
      // If we have a valid error message, still fallback to mock data
      console.warn('API error, falling back to mock data:', errorMessage);
      await new Promise(resolve => setTimeout(resolve, 300));
      return searchMockMovie(query);
    }

    try {
      const data = await parseJSONResponse(response);
      return data;
    } catch (parseError) {
      // If JSON parsing fails, fallback to mock data
      console.warn('Failed to parse JSON response, falling back to mock data:', parseError);
      await new Promise(resolve => setTimeout(resolve, 300));
      return searchMockMovie(query);
    }
  } catch (error) {
    console.warn('Error searching movie, falling back to mock data:', error);
    // Always fallback to mock data on any error
    await new Promise(resolve => setTimeout(resolve, 300));
    return searchMockMovie(query);
  }
};

/**
 * Get movie details by ID
 * @param {string|number} movieId - Movie ID
 * @returns {Promise<Object>} Movie details
 */
export const getMovieDetails = async (movieId) => {
  // Use mock data if enabled
  if (USE_MOCK_DATA) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    const mockMovie = getMockMovieById(movieId);
    console.log('Using mock data for movie details:', movieId);
    return mockMovie;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/movies/${movieId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = `Failed to get movie details: ${response.statusText}`;
      
      // Check if response is HTML
      if (errorText.trim().startsWith('<!DOCTYPE') || errorText.trim().startsWith('<html')) {
        throw new Error(`Server returned HTML (status ${response.status}). The API endpoint may be incorrect. Check your API URL: ${API_BASE_URL}`);
      }
      
      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.message || errorMessage;
      } catch (e) {
        if (errorText && errorText.length < 200) {
          errorMessage = errorText;
        }
      }
      throw new Error(errorMessage);
    }

    const data = await parseJSONResponse(response);
    return data;
  } catch (error) {
    console.error('Error getting movie details:', error);
    // Fallback to mock data on error if not already using it
    if (!USE_MOCK_DATA) {
      console.warn('API request failed, falling back to mock data');
      await new Promise(resolve => setTimeout(resolve, 300));
      return getMockMovieById(movieId);
    }
    throw handleFetchError(error, 'Failed to load movie details. Please try again.');
  }
};

/**
 * Get movie recommendations
 * @param {string|number} movieId - Movie ID
 * @returns {Promise<Object>} Recommendations object with byActors, byGenre, and byContent arrays
 */
export const getRecommendations = async (movieId) => {
  // Use mock data if enabled
  if (USE_MOCK_DATA) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 400));
    const mockRecs = getMockRecommendations(movieId);
    console.log('Using mock data for recommendations:', movieId);
    return mockRecs;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/movies/${movieId}/recommendations`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      // Don't throw error for recommendations - just return empty arrays
      // This allows the movie to still display even if recommendations fail
      const errorText = await response.text();
      if (errorText.trim().startsWith('<!DOCTYPE') || errorText.trim().startsWith('<html')) {
        console.warn('Server returned HTML for recommendations. API endpoint may be incorrect. Falling back to mock data.');
        // Fallback to mock data
        return getMockRecommendations(movieId);
      } else {
        console.warn('Failed to get recommendations:', response.statusText);
      }
      // Fallback to mock data on error
      return getMockRecommendations(movieId);
    }

    const data = await parseJSONResponse(response);
    return {
      byActors: data.byActors || [],
      byGenre: data.byGenre || [],
      byContent: data.byContent || [],
    };
  } catch (error) {
    // Don't throw error for recommendations - just return mock data
    console.warn('Error getting recommendations, using mock data:', error);
    return getMockRecommendations(movieId);
  }
};

