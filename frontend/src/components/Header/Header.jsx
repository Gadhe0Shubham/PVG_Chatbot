import React from 'react';
import './Header.css';

const Header = () => {
  return (
    <header className="college-header">
      <div className="header-container">
        <div className="logo-section">
          <img src="/logo.png" alt="PVGCOE & SSDIOM Logo" className="college-logo" />
          <div className="college-info">
            <h1 className="college-name">PVGCOE & SSDIOM</h1>
            <p className="college-subtitle">Pune Vidyarthi Griha's College of Engineering & SS Dhamankar Institute of Management</p>
            <p className="college-location">Nashik, Maharashtra</p>
          </div>
        </div>
        
        <nav className="main-navigation">
          <ul className="nav-links">
            <li><a href="#home" className="nav-link active">Home</a></li>
            <li><a href="#about" className="nav-link">About</a></li>
            <li><a href="#courses" className="nav-link">Courses</a></li>
            <li><a href="#admissions" className="nav-link">Admissions</a></li>
            <li><a href="#contact" className="nav-link">Contact</a></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;