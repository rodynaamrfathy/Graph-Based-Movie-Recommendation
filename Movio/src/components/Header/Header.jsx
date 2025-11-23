import React from 'react';
import LogoIcon from './LogoIcon.jsx';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="header-content">
        <div className="logo-container">
          <div className="logo-icon-wrapper">
            <LogoIcon />
          </div>
          <div className="logo-text-container">
            <h1 className="logo-text">Movio</h1>
            <p className="tagline">Find movies like your favorite!</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

