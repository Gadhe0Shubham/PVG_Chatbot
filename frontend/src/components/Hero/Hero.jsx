import React from 'react';
import './Hero.css';

const Hero = () => {
  return (
    <section className="hero-ak-section">
      <div className="hero-ak-container">
        <div className="hero-ak-main">
          <div className="hero-ak-row">
            <h1 className="hero-ak-text">PVGCOE</h1>
            <div className="hero-ak-pill seminar-pill-container">
              <img src="/assets/seminar.png" alt="PVGCOE Campus" className="hero-ak-image" />
            </div>
            <h1 className="hero-ak-text">& SSDIOM</h1>
          </div>

          <div className="hero-ak-row mt-4">
            <h1 className="hero-ak-text">Nashik</h1>
            <div className="hero-ak-icons-group">
              <div className="ak-circle bg-yellow">UG</div>
              <div className="ak-circle bg-blue">PG</div>
            </div>
            <h1 className="hero-ak-text">Programs</h1>
            <div className="hero-ak-pill trainer-pill-container">
              <img src="/assets/trainer.png" alt="Students" className="hero-ak-image" />
            </div>
          </div>
        </div>

        <p className="hero-ak-description">
          Established in 2010, affiliated to Savitribai Phule Pune University,<br />
          and approved by AICTE & DTE, Maharashtra.
        </p>

        <div className="floating-card-ak implementation-card">
          <div className="flex flex-col gap-4">
            <span className="font-bold text-lg">PVGCOE & SSDIOM</span>
            <div className="divider-ak" />
            <div className="ak-feature-item">
              <div className="ak-check-circle"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 5 5L20 7"/></svg></div>
              <span>5 UG Engineering Branches</span>
            </div>
            <div className="ak-feature-item">
              <div className="ak-check-circle"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 5 5L20 7"/></svg></div>
              <span>1 MBA Program at SSDIOM</span>
            </div>
          </div>
        </div>

        <div className="floating-badge-ak management-badge">
          <svg className="ak-badge-arrow" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="m12 19 7-7-7-7-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 19Z"/></svg>
          <span className="font-bold">Admissions Open</span>
        </div>

        <div className="ak-stamp-container">
          <div className="ak-stamp-inner">
            <div className="ak-stamp-text">PUNE VIDYARTHI GRIHA •</div>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M19 12l-7 7-7-7"/></svg>
          </div>
        </div>

        <div className="ak-zigzag">
          <svg width="200" height="100" viewBox="0 0 200 100" fill="none" stroke="#4EBD5E" strokeWidth="20" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 80 L50 20 L90 80 L130 20 L170 80" />
          </svg>
        </div>
      </div>
    </section>
  );
};

export default Hero;
