import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGraduationCap, faUsers, faAward, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import './Hero.css';

const Hero = () => {
  return (
    <section className="hero-section">
      <div className="hero-container">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              Welcome to <span className="highlight">PVGCOE & SSDIOM</span>
            </h1>
            <h2 className="hero-subtitle">
              Engineering Excellence Since 2010
            </h2>
            <p className="hero-description">
              PVGCOE & SSDIOM Nashik delivers quality engineering education with state-of-the-art facilities 
              and experienced faculty. Affiliated with SPPU and approved by AICTE & DTE Maharashtra.
            </p>
            
            <div className="hero-stats">
              <div className="stat-item">
                <FontAwesomeIcon icon={faUsers} className="stat-icon" />
                <div className="stat-content">
                  <span className="stat-number">800+</span>
                  <span className="stat-label">Students</span>
                </div>
              </div>
              <div className="stat-item">
                <FontAwesomeIcon icon={faGraduationCap} className="stat-icon" />
                <div className="stat-content">
                  <span className="stat-number">6</span>
                  <span className="stat-label">Courses (5 UG + 1 PG)</span>
                </div>
              </div>
              <div className="stat-item">
                <FontAwesomeIcon icon={faAward} className="stat-icon" />
                <div className="stat-content">
                  <span className="stat-number">13+</span>
                  <span className="stat-label">Years of Excellence</span>
                </div>
              </div>
            </div>

            <div className="hero-actions">
              <button className="cta-button primary">
                <FontAwesomeIcon icon={faGraduationCap} />
                Explore Courses
              </button>
              <button className="cta-button secondary">
                <FontAwesomeIcon icon={faMapMarkerAlt} />
                Visit Campus
              </button>
            </div>
          </div>
          
          <div className="hero-image">
            <div className="college-showcase">
              <img src="/logo.png" alt="PVGCOE & SSDIOM" className="showcase-logo" />
              <div className="showcase-info">
                <h3>Engineering Excellence & Management</h3>
                <p>CS • IT • Mechanical • E&TC • AI&DS • MBA</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;