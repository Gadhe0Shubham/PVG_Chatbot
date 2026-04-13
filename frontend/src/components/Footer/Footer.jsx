import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPhone, 
  faEnvelope, 
  faMapMarkerAlt, 
  faClock,
  faGraduationCap,
  faHeart
} from '@fortawesome/free-solid-svg-icons';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="college-footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <div className="footer-logo-section">
              <img src="/logo.png" alt="PVGCOE & SSDIOM Logo" className="footer-logo" />
              <h3 className="footer-title">PVGCOE & SSDIOM</h3>
              <p className="footer-subtitle">
                Pune Vidyarthi Griha's College of Engineering & 
                SS Dhamankar Institute of Management
              </p>
            </div>
          </div>

          <div className="footer-section">
            <h4 className="section-title">Quick Links</h4>
            <ul className="footer-links">
              <li><a href="#about">About College</a></li>
              <li><a href="#courses">Engineering Programs</a></li>
              <li><a href="#admissions">Admissions</a></li>
              <li><a href="#facilities">Facilities</a></li>
              <li><a href="#placements">Placements</a></li>
              <li><a href="#contact">Contact Us</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="section-title">Academic Programs</h4>
            <ul className="footer-links">
              <li>
                <FontAwesomeIcon icon={faGraduationCap} className="link-icon" />
                Computer Engineering (UG)
              </li>
              <li>
                <FontAwesomeIcon icon={faGraduationCap} className="link-icon" />
                IT Engineering (UG)
              </li>
              <li>
                <FontAwesomeIcon icon={faGraduationCap} className="link-icon" />
                Mechanical Engineering (UG)
              </li>
              <li>
                <FontAwesomeIcon icon={faGraduationCap} className="link-icon" />
                E&TC Engineering (UG)
              </li>
              <li>
                <FontAwesomeIcon icon={faGraduationCap} className="link-icon" />
                AI & Data Science (UG)
              </li>
              <li>
                <FontAwesomeIcon icon={faGraduationCap} className="link-icon" />
                MBA (PG)
              </li>
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="section-title">Contact Information</h4>
            <div className="contact-info">
              <div className="contact-item">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="contact-icon" />
                <div>
                  <p>206-Dindori road, Behind Reliance Petrol Pump</p>
                  <p>Near MERI, Mhasrul, Nashik - 422004</p>
                </div>
              </div>
              
              <div className="contact-item">
                <FontAwesomeIcon icon={faPhone} className="contact-icon" />
                <div>
                  <p>0253-6480036</p>
                  <p>1800-266-5330</p>
                </div>
              </div>
              
              <div className="contact-item">
                <FontAwesomeIcon icon={faEnvelope} className="contact-icon" />
                <div>
                  <p>pvgcoenashik@gmail.com</p>
                </div>
              </div>
              
              <div className="contact-item">
                <FontAwesomeIcon icon={faClock} className="contact-icon" />
                <div>
                  <p>Visit Hours: 10 AM to 5 PM</p>
                  <p>Monday to Saturday</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p className="copyright">
              © {new Date().getFullYear()} PVGCOE & SSDIOM Nashik. All rights reserved.
            </p>
            <p className="made-with">
              Made with <FontAwesomeIcon icon={faHeart} className="heart-icon" /> for students
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;