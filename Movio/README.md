# MovieBuddy

A React-based movie recommendation application that helps users discover movies similar to their favorites. The app features a clean, dark-themed UI with purple accents and provides personalized recommendations based on actors, genres, and content similarity.

## Features

- **Movie Search**: Search for movies by name
- **Movie Details**: View comprehensive movie information including cast, genres, director, and more
- **Personalized Recommendations**: Get movie suggestions based on:
  - Similar content
  - Same actors
  - Same genres
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Modern UI**: Dark theme with purple/blue color scheme

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Header/         # App header with logo
│   ├── SearchBar/      # Movie search input
│   ├── MovieCard/      # Movie card for recommendations
│   ├── SearchedMovie/  # Display searched movie details
│   ├── RecommendationSection/  # Horizontal scrolling recommendations
│   ├── EmptyState/     # Initial empty state
│   └── HelpIcon/       # Help tooltip icon
├── pages/              # Page components
│   ├── SearchPage/     # Main search page
│   └── MovieDetailsPage/  # Movie details page
├── services/           # API service layer
│   └── movieService.js # Movie API calls
└── styles/             # Global styles
    └── global.css      # Global CSS styles
```

## Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure API URL (Optional)**
   
   Create a `.env` file in the root directory:
   ```env
   REACT_APP_API_BASE_URL=http://localhost:3001/api
   REACT_APP_USE_MOCK_DATA=true
   ```
   
   - `REACT_APP_API_BASE_URL`: Update the URL to match your backend API endpoint
   - `REACT_APP_USE_MOCK_DATA`: Set to `true` to use mock data for UI testing (default: `false`, but automatically falls back to mock data if API fails)
   
   **Note:** 
   - The app automatically falls back to mock data if the API is unavailable
   - To force mock data mode, set `REACT_APP_USE_MOCK_DATA=true` in your `.env` file
   - Restart the React dev server after creating/updating the `.env` file
   
   **Testing with Mock Data:**
   - Try searching for: "Iron Man", "Avengers", "Inception", or "Interstellar"
   - Mock data includes full movie details and recommendations
   - All UI features work with mock data for testing

3. **Start Development Server**
   ```bash
   npm start
   ```

   The app will open at [http://localhost:3000](http://localhost:3000)

## API Integration

The application expects a REST API with the following endpoints:

### Search Movie
```
GET /api/movies/search?q={query}
```
Returns movie data for the searched movie.

### Get Movie Details
```
GET /api/movies/{id}
```
Returns detailed information about a specific movie.

### Get Recommendations
```
GET /api/movies/{id}/recommendations
```
Returns recommendations object with:
- `byActors`: Array of movies with similar actors
- `byGenre`: Array of movies in the same genre
- `byContent`: Array of movies with similar content

### Expected Data Structure

**Movie Object:**
```javascript
{
  id: string | number,
  title: string,
  year: number,
  poster: string (URL),
  rating: number,
  overview: string,
  duration: number (minutes),
  votes: string (e.g., "1.1M votes"),
  director: string,
  genres: string[],
  cast: string[],
  keywords: string[],
  imdbUrl: string (URL)
}
```

## Technologies Used

- React 19.2.0
- React Router DOM
- CSS3 (Custom styling)
- Fetch API (for HTTP requests)

## Color Scheme

- Background: `#1a0d2e` (Dark purple)
- Cards: `#2d1b4e` (Medium purple)
- Accent: `#5dade2` (Light blue)
- Text: `#ffffff` (White)
- Secondary Text: `#e0e0e0`, `#b0b0b0` (Light gray)

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is private and proprietary.
