// Mock data for UI testing
export const mockMovies = {
  'iron man': {
    id: 1,
    title: 'Iron Man',
    year: 2008,
    poster: 'https://image.tmdb.org/t/p/w500/78lPtwv72eTNqFW9COBYI0dWDJa.jpg',
    rating: 7.9,
    overview: 'After being held captive in an Afghan cave, billionaire engineer Tony Stark creates a unique weaponized suit of armor to fight evil.',
    duration: 126,
    votes: '1.1M votes',
    director: 'Jon Favreau',
    genres: ['Action', 'Adventure', 'Sci-Fi'],
    cast: ['Robert Downey Jr.', 'Gwyneth Paltrow', 'Terrence Howard', 'Jeff Bridges'],
    keywords: ['superhero', 'origin story', 'technology', 'billionaire', 'armor'],
    imdbUrl: 'https://www.imdb.com/title/tt0371746/',
  },
  'avengers': {
    id: 2,
    title: 'The Avengers',
    year: 2012,
    poster: 'https://image.tmdb.org/t/p/w500/RYMX2wcKCBAr24UyPD7xwmjaTn.jpg',
    rating: 8.0,
    overview: 'When an unexpected enemy emerges and threatens global safety and security, Nick Fury assembles a team of the world\'s most legendary superheroes.',
    duration: 143,
    votes: '1.5M votes',
    director: 'Joss Whedon',
    genres: ['Action', 'Adventure', 'Sci-Fi'],
    cast: ['Robert Downey Jr.', 'Chris Evans', 'Mark Ruffalo', 'Chris Hemsworth', 'Scarlett Johansson'],
    keywords: ['superhero', 'team', 'aliens', 'new york', 'shield'],
    imdbUrl: 'https://www.imdb.com/title/tt0848228/',
  },
  'inception': {
    id: 3,
    title: 'Inception',
    year: 2010,
    poster: 'https://image.tmdb.org/t/p/w500/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg',
    rating: 8.8,
    overview: 'A skilled thief is given a chance at redemption if he can pull off an impossible task: Inception, the implantation of another person\'s idea into a target\'s subconscious.',
    duration: 148,
    votes: '2.3M votes',
    director: 'Christopher Nolan',
    genres: ['Action', 'Sci-Fi', 'Thriller'],
    cast: ['Leonardo DiCaprio', 'Marion Cotillard', 'Tom Hardy', 'Ellen Page', 'Joseph Gordon-Levitt'],
    keywords: ['dreams', 'subconscious', 'heist', 'mind', 'reality'],
    imdbUrl: 'https://www.imdb.com/title/tt1375666/',
  },
  'interstellar': {
    id: 4,
    title: 'Interstellar',
    year: 2014,
    poster: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
    rating: 8.6,
    overview: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.',
    duration: 169,
    votes: '1.8M votes',
    director: 'Christopher Nolan',
    genres: ['Adventure', 'Drama', 'Sci-Fi'],
    cast: ['Matthew McConaughey', 'Anne Hathaway', 'Jessica Chastain', 'Michael Caine'],
    keywords: ['space', 'time', 'wormhole', 'earth', 'exploration'],
    imdbUrl: 'https://www.imdb.com/title/tt0816692/',
  },
};

export const mockRecommendations = {
  1: { // Iron Man
    byContent: [
      {
        id: 5,
        title: 'Captain America: Civil War',
        year: 2016,
        poster: 'https://image.tmdb.org/t/p/w500/rAGiXaUfPzY7CDEyNKUofk3Kw2e.jpg',
        rating: 7.8,
      },
      {
        id: 6,
        title: 'Black Widow',
        year: 2021,
        poster: 'https://image.tmdb.org/t/p/w500/qAZ0pzat24kLdO3o8ejmbLxyOac.jpg',
        rating: 6.7,
      },
      {
        id: 7,
        title: 'Guardians of the Galaxy',
        year: 2014,
        poster: 'https://image.tmdb.org/t/p/w500/r7vmZjiyZw9rpJMQJdXpjgiCOk9.jpg',
        rating: 8.0,
      },
      {
        id: 8,
        title: 'Thor: Ragnarok',
        year: 2017,
        poster: 'https://image.tmdb.org/t/p/w500/rzRwTcFvttcN1ZpX2xv4j3tSdJu.jpg',
        rating: 7.9,
      },
    ],
    byActors: [
      {
        id: 2,
        title: 'The Avengers',
        year: 2012,
        poster: 'https://image.tmdb.org/t/p/w500/RYMX2wcKCBAr24UyPD7xwmjaTn.jpg',
        rating: 8.0,
      },
      {
        id: 9,
        title: 'Iron Man 2',
        year: 2010,
        poster: 'https://image.tmdb.org/t/p/w500/6WBeq4fCfn7AN0o21W9qNcRF2l9.jpg',
        rating: 7.0,
      },
      {
        id: 10,
        title: 'Iron Man 3',
        year: 2013,
        poster: 'https://image.tmdb.org/t/p/w500/qhPtAc1TKbMPqNvcdXSOn9Bn7hZ.jpg',
        rating: 7.1,
      },
    ],
    byGenre: [
      {
        id: 11,
        title: 'The Dark Knight',
        year: 2008,
        poster: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
        rating: 9.0,
      },
      {
        id: 12,
        title: 'Spider-Man: Homecoming',
        year: 2017,
        poster: 'https://image.tmdb.org/t/p/w500/c24sv2weTHPsmDa7jEMN0m2P3RT.jpg',
        rating: 7.4,
      },
      {
        id: 13,
        title: 'Doctor Strange',
        year: 2016,
        poster: 'https://image.tmdb.org/t/p/w500/4PiiNGXj1KENTmCBHeN6Mskj2Fq.jpg',
        rating: 7.5,
      },
    ],
  },
  2: { // The Avengers
    byContent: [
      {
        id: 1,
        title: 'Iron Man',
        year: 2008,
        poster: 'https://image.tmdb.org/t/p/w500/78lPtwv72eTNqFW9COBYI0dWDJa.jpg',
        rating: 7.9,
      },
      {
        id: 14,
        title: 'Avengers: Age of Ultron',
        year: 2015,
        poster: 'https://image.tmdb.org/t/p/w500/t90Y3G8UGQp0f0DrP60wRu9gfrH.jpg',
        rating: 7.3,
      },
    ],
    byActors: [
      {
        id: 1,
        title: 'Iron Man',
        year: 2008,
        poster: 'https://image.tmdb.org/t/p/w500/78lPtwv72eTNqFW9COBYI0dWDJa.jpg',
        rating: 7.9,
      },
      {
        id: 15,
        title: 'Captain America: The First Avenger',
        year: 2011,
        poster: 'https://image.tmdb.org/t/p/w500/vSNxAJTlD0r02V9sPYpOjqDZXUK.jpg',
        rating: 6.9,
      },
    ],
    byGenre: [
      {
        id: 7,
        title: 'Guardians of the Galaxy',
        year: 2014,
        poster: 'https://image.tmdb.org/t/p/w500/r7vmZjiyZw9rpJMQJdXpjgiCOk9.jpg',
        rating: 8.0,
      },
    ],
  },
  3: { // Inception
    byContent: [
      {
        id: 4,
        title: 'Interstellar',
        year: 2014,
        poster: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
        rating: 8.6,
      },
      {
        id: 16,
        title: 'The Matrix',
        year: 1999,
        poster: 'https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg',
        rating: 8.7,
      },
    ],
    byActors: [
      {
        id: 17,
        title: 'The Revenant',
        year: 2015,
        poster: 'https://image.tmdb.org/t/p/w500/ji3ecJphATlVgWNY0B4y8HRcDED.jpg',
        rating: 8.0,
      },
    ],
    byGenre: [
      {
        id: 18,
        title: 'Tenet',
        year: 2020,
        poster: 'https://image.tmdb.org/t/p/w500/k68nPLbIST6NP96JmTxmZijEvCA.jpg',
        rating: 7.4,
      },
    ],
  },
  4: { // Interstellar
    byContent: [
      {
        id: 3,
        title: 'Inception',
        year: 2010,
        poster: 'https://image.tmdb.org/t/p/w500/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg',
        rating: 8.8,
      },
      {
        id: 19,
        title: 'The Martian',
        year: 2015,
        poster: 'https://image.tmdb.org/t/p/w500/5aGhaIHYuQbqlHWvWYqMCnj40y2.jpg',
        rating: 8.0,
      },
    ],
    byActors: [
      {
        id: 20,
        title: 'Dallas Buyers Club',
        year: 2013,
        poster: 'https://image.tmdb.org/t/p/w500/y7iTwB5i5Tq8hTfHxW0q3qJzJvN.jpg',
        rating: 8.0,
      },
    ],
    byGenre: [
      {
        id: 3,
        title: 'Inception',
        year: 2010,
        poster: 'https://image.tmdb.org/t/p/w500/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg',
        rating: 8.8,
      },
    ],
  },
};

// Helper function to search mock movies
export const searchMockMovie = (query) => {
  const lowerQuery = query.toLowerCase().trim();
  
  // Try exact match first
  if (mockMovies[lowerQuery]) {
    return mockMovies[lowerQuery];
  }
  
  // Try partial match
  for (const [key, movie] of Object.entries(mockMovies)) {
    if (key.includes(lowerQuery) || movie.title.toLowerCase().includes(lowerQuery)) {
      return movie;
    }
  }
  
  // Default to Iron Man if no match
  return mockMovies['iron man'];
};

// Helper function to get mock movie by ID
export const getMockMovieById = (id) => {
  for (const movie of Object.values(mockMovies)) {
    if (movie.id === parseInt(id)) {
      return movie;
    }
  }
  return mockMovies['iron man']; // Default fallback
};

// Helper function to get mock recommendations
export const getMockRecommendations = (movieId) => {
  const id = parseInt(movieId);
  return mockRecommendations[id] || {
    byActors: [],
    byGenre: [],
    byContent: [],
  };
};

