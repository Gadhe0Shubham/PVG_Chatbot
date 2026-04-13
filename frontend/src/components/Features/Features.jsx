import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faLaptopCode, 
  faCogs, 
  faBolt, 
  faRobot,
  faServer,
  faChartLine,
  faUserGraduate,
  faBuilding,
  faPhone,
  faCalendarAlt
} from '@fortawesome/free-solid-svg-icons';
import './Features.css';

const Features = () => {
  const courses = [
    {
      icon: faLaptopCode,
      title: "Computer Engineering",
      description: "Programming, Software Development & Modern Technology",
      seats: "120 FE + 20 DSY",
      color: "#667eea",
      type: "UG"
    },
    {
      icon: faServer,
      title: "IT Engineering",
      description: "Information Technology, Networks & System Administration",
      seats: "120 FE + 20 DSY",
      color: "#4ecdc4",
      type: "UG"
    },
    {
      icon: faCogs,
      title: "Mechanical Engineering", 
      description: "Design, Manufacturing & Mechanical Systems",
      seats: "120 FE + 20 DSY",
      color: "#764ba2",
      type: "UG"
    },
    {
      icon: faBolt,
      title: "E&TC Engineering",
      description: "Electronics & Telecommunication Technology",
      seats: "120 FE + 20 DSY", 
      color: "#ffd700",
      type: "UG"
    },
    {
      icon: faRobot,
      title: "AI & Data Science",
      description: "AI, Machine Learning & Data Analytics",
      seats: "60 FE + 10 DSY",
      color: "#ff6b6b",
      type: "UG"
    },
    {
      icon: faChartLine,
      title: "MBA",
      description: "Master of Business Administration (SSDIOM)",
      seats: "60 Students",
      color: "#9b59b6",
      type: "PG"
    }
  ];

  const quickInfo = [
    {
      icon: faUserGraduate,
      title: "800+ Students",
      description: "Diverse student community"
    },
    {
      icon: faBuilding,
      title: "Modern Campus",
      description: "State-of-the-art facilities"
    },
    {
      icon: faPhone,
      title: "24/7 Support",
      description: "Student assistance available"
    },
    {
      icon: faCalendarAlt,
      title: "Since 2010",
      description: "13+ years of excellence"
    }
  ];

  return (
    <section className="features-section">
      <div className="features-container">
        {/* Courses Section */}
        <div className="section-header">
          <h2 className="section-title">Academic Programs</h2>
          <p className="section-subtitle">
            PVGCOE offers 5 UG Engineering courses & SSDIOM offers MBA program with industry-focused curriculum
          </p>
        </div>

        <div className="courses-grid">
          {courses.map((course, index) => (
            <div key={index} className="course-card" style={{'--accent-color': course.color}}>
              <div className="course-header">
                <div className="course-icon">
                  <FontAwesomeIcon icon={course.icon} />
                </div>
                <span className="course-type">{course.type}</span>
              </div>
              <h3 className="course-title">{course.title}</h3>
              <p className="course-description">{course.description}</p>
              <div className="course-seats">
                <span className="seats-label">Available Seats:</span>
                <span className="seats-count">{course.seats}</span>
              </div>
              <button className="course-btn">Learn More</button>
            </div>
          ))}
        </div>

        {/* Quick Info Section */}
        <div className="quick-info-section">
          <h3 className="quick-info-title">Why Choose PVGCOE & SSDIOM?</h3>
          <div className="quick-info-grid">
            {quickInfo.map((info, index) => (
              <div key={index} className="info-card">
                <FontAwesomeIcon icon={info.icon} className="info-icon" />
                <h4 className="info-title">{info.title}</h4>
                <p className="info-description">{info.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Info */}
        <div className="contact-info-section">
          <div className="contact-card">
            <h3>Get in Touch</h3>
            <div className="contact-details">
              <div className="contact-item">
                <strong>Address:</strong>
                <p>206-Dindori road, Behind Reliance Petrol Pump, Near MERI, Mhasrul, Nashik - 422004</p>
              </div>
              <div className="contact-item">
                <strong>Phone:</strong>
                <p>0253-6480036, 1800-266-5330</p>
              </div>
              <div className="contact-item">
                <strong>Email:</strong>
                <p>pvgcoenashik@gmail.com</p>
              </div>
              <div className="contact-item">
                <strong>Visit Hours:</strong>
                <p>10 AM to 5 PM (Monday to Saturday)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;