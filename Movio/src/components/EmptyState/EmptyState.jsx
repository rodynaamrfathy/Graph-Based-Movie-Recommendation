import React from 'react';
import './EmptyState.css';

const EmptyState = () => {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">🎬</div>
      <h2 className="empty-state-title">Start Your Movie Journey</h2>
      <p className="empty-state-description">
        Search for a movie to get personalized recommendations
      </p>
      <p className="empty-state-examples">
        Try: "Avengers", "Iron Man", "Inception", "Interstellar"
      </p>
    </div>
  );
};

export default EmptyState;

