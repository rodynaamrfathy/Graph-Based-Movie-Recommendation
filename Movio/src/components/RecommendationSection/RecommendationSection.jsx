import React from 'react';
import { Carousel } from 'flowbite-react';
import MovieCard from '../MovieCard/MovieCard.jsx';
import './RecommendationSection.css';

const RecommendationSection = ({ title, subtitle, movies = [] }) => {
  if (!movies || movies.length === 0) {
    return null;
  }

  // Group movies into slides (e.g., 4-5 movies per slide)
  const moviesPerSlide = 4;
  const slides = [];
  for (let i = 0; i < movies.length; i += moviesPerSlide) {
    slides.push(movies.slice(i, i + moviesPerSlide));
  }

  return (
    <div className="recommendation-section">
      <div className="recommendation-header">
        <h3 className="recommendation-title">{title}</h3>
        {subtitle && <p className="recommendation-subtitle">{subtitle}</p>}
      </div>
      <div className="recommendation-container">
        <Carousel
          slide={false}
          className="custom-carousel"
          leftControl={
            <button
              type="button"
              className="carousel-control-btn carousel-control-left"
              aria-label="Previous slide"
            >
              <svg
                className="carousel-control-icon"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 6 10"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 1 1 5l4 4"
                />
              </svg>
              <span className="sr-only">Previous</span>
            </button>
          }
          rightControl={
            <button
              type="button"
              className="carousel-control-btn carousel-control-right"
              aria-label="Next slide"
            >
              <svg
                className="carousel-control-icon"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 6 10"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 9 4-4-4-4"
                />
              </svg>
              <span className="sr-only">Next</span>
            </button>
          }
        >
          {slides.map((slideMovies, slideIndex) => (
            <div key={slideIndex} className="carousel-slide-content">
              {slideMovies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          ))}
        </Carousel>
      </div>
    </div>
  );
};

export default RecommendationSection;
