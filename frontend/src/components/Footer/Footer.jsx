import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPhone, faEnvelope, faMapMarkerAlt, faHeart, faArrowRight
} from '@fortawesome/free-solid-svg-icons';
import { faFacebook, faLinkedin, faInstagram, faYoutube } from '@fortawesome/free-brands-svg-icons';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer-ak">
      <div className="footer-cta-strip">
        <div className="container footer-cta-inner">
          <div>
            <h3 className="text-3xl font-black">Still have questions?</h3>
            <p className="text-white/60 font-medium mt-2">Our college assistant is available 24/7 to help you.</p>
          </div>
          <Link to="/contact" className="footer-cta-btn">
            Contact Us <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
          </Link>
        </div>
      </div>

      <div className="container footer-main">
        <div className="footer-grid">
          <div className="footer-col footer-brand-col">
            <h2 className="footer-logo-text">PVGCOE & SSDIOM</h2>
            <p className="footer-desc">
              Pune Vidyarthi Griha's College of Engineering & SS Dhamankar Institute of Management, Nashik.
              Established in 2010 with a focus on quality professional education.
            </p>
            <div className="footer-socials">
              <a href="https://www.pvgcoenashik.edu.in/" aria-label="Website" target="_blank" rel="noreferrer"><FontAwesomeIcon icon={faFacebook} /></a>
              <a href="https://www.pvgcoenashik.edu.in/" aria-label="Website" target="_blank" rel="noreferrer"><FontAwesomeIcon icon={faLinkedin} /></a>
              <a href="https://www.pvgcoenashik.edu.in/" aria-label="Website" target="_blank" rel="noreferrer"><FontAwesomeIcon icon={faInstagram} /></a>
              <a href="https://www.pvgcoenashik.edu.in/" aria-label="Website" target="_blank" rel="noreferrer"><FontAwesomeIcon icon={faYoutube} /></a>
            </div>
          </div>

          <div className="footer-col">
            <h4 className="footer-heading">Navigation</h4>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/courses">Programs</Link></li>
              <li><Link to="/admissions">Admissions</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4 className="footer-heading">Departments</h4>
            <ul className="footer-links muted">
              <li>Computer Engineering</li>
              <li>IT Engineering</li>
              <li>AI & Data Science</li>
              <li>E&TC Engineering</li>
              <li>Mechanical Engineering</li>
              <li>MBA (SSDIOM Nashik)</li>
            </ul>
          </div>

          <div className="footer-col">
            <h4 className="footer-heading">Get In Touch</h4>
            <div className="footer-contact-list">
              <div className="footer-contact-item">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="footer-contact-icon" />
                <span>206-Dindori Road, Behind Reliance Petrol Pump, Near MERI, Mhasrul, Nashik - 422004</span>
              </div>
              <div className="footer-contact-item">
                <FontAwesomeIcon icon={faPhone} className="footer-contact-icon" />
                <span>0253-6480036, 1800-266-5330</span>
              </div>
              <div className="footer-contact-item">
                <FontAwesomeIcon icon={faEnvelope} className="footer-contact-icon" />
                <span>pvgcoenashik@gmail.com</span>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} PVGCOE & SSDIOM Nashik. All rights reserved.</p>
          <p className="footer-made">
            Built with <FontAwesomeIcon icon={faHeart} className="text-[#4EBD5E] mx-1" /> for student guidance
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
