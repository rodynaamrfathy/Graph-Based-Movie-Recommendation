import React, { useState } from 'react';
import './HelpIcon.css';

const HelpIcon = () => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="help-icon-container">
      <button
        className="help-icon"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onClick={() => setShowTooltip(!showTooltip)}
        aria-label="Help"
      >
        ?
      </button>
      {showTooltip && (
        <div className="help-tooltip">
          <p>Search for any movie to get personalized recommendations!</p>
        </div>
      )}
    </div>
  );
};

export default HelpIcon;

