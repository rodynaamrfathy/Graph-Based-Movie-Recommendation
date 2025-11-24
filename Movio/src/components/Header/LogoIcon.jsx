import React from 'react';

const LogoIcon = () => {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="logo-svg"
    >
      {/* Film reel base */}
      <rect x="5" y="10" width="30" height="20" rx="2.5" fill="#5dade2" />
      <rect x="7" y="12" width="26" height="16" rx="1.5" fill="#1a0d2e" />
      
      {/* Film holes */}
      <circle cx="12" cy="20" r="2" fill="#5dade2" />
      <circle cx="20" cy="20" r="2" fill="#5dade2" />
      <circle cx="28" cy="20" r="2" fill="#5dade2" />
      
      {/* Film reel edges */}
      <rect x="5" y="7" width="4" height="3" rx="1.5" fill="#5dade2" />
      <rect x="31" y="7" width="4" height="3" rx="1.5" fill="#5dade2" />
      <rect x="5" y="30" width="4" height="3" rx="1.5" fill="#5dade2" />
      <rect x="31" y="30" width="4" height="3" rx="1.5" fill="#5dade2" />
    </svg>
  );
};

export default LogoIcon;

