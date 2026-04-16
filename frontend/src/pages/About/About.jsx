import React from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faBullseye, faHistory } from '@fortawesome/free-solid-svg-icons';
import './About.css';

const About = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="about-page-ak"
    >
      <div className="container py-24">
        <div className="text-center mb-24">
          <h1 className="text-6xl font-black mb-8">About PVGCOE & SSDIOM</h1>
          <p className="text-xl text-muted max-w-3xl mx-auto font-medium leading-relaxed">
            Pune Vidyarthi Griha's College of Engineering & SS Dhamankar Institute of Management, Nashik
            was established in 2010 to provide quality professional education in engineering and management.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-16 items-center mb-32">
          <div className="about-pill-image overflow-hidden shadow-2xl">
            <img 
              src="https://images.unsplash.com/photo-1541339907198-e08756ebafe3?auto=format&fit=crop&q=80&w=800" 
              alt="Campus" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="about-stats-grid grid grid-cols-2 gap-8">
            <div className="ak-stat-card">
              <h3 className="text-5xl font-black text-black">13+</h3>
              <p className="text-xs font-bold uppercase tracking-widest text-[#4EBD5E] mt-2">Years Since Establishment</p>
            </div>
            <div className="ak-stat-card">
              <h3 className="text-5xl font-black text-black">800+</h3>
              <p className="text-xs font-bold uppercase tracking-widest text-[#4EBD5E] mt-2">Current Students</p>
            </div>
            <div className="ak-stat-card">
              <h3 className="text-5xl font-black text-black">5</h3>
              <p className="text-xs font-bold uppercase tracking-widest text-[#4EBD5E] mt-2">UG Engineering Branches</p>
            </div>
            <div className="ak-stat-card">
              <h3 className="text-5xl font-black text-black">1</h3>
              <p className="text-xs font-bold uppercase tracking-widest text-[#4EBD5E] mt-2">MBA Program</p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-12">
          <div className="ak-highlight-card">
            <div className="ak-icon-box bg-green-100 text-green-700">
              <FontAwesomeIcon icon={faEye} />
            </div>
            <h2 className="text-2xl font-bold mb-6 mt-6">Our Vision</h2>
            <p className="text-muted leading-relaxed font-medium">
              To deliver quality technical and management education that builds competent professionals
              ready to contribute to industry and society.
            </p>
          </div>

          <div className="ak-highlight-card">
            <div className="ak-icon-box bg-blue-100 text-blue-700">
              <FontAwesomeIcon icon={faBullseye} />
            </div>
            <h2 className="text-2xl font-bold mb-6 mt-6">Our Mission</h2>
            <p className="text-muted leading-relaxed font-medium">
              To provide strong academic foundations, practical exposure, and ethical values through
              student-centric teaching and continuous improvement.
            </p>
          </div>

          <div className="ak-highlight-card">
            <div className="ak-icon-box bg-yellow-100 text-yellow-700">
              <FontAwesomeIcon icon={faHistory} />
            </div>
            <h2 className="text-2xl font-bold mb-6 mt-6">Our History</h2>
            <p className="text-muted leading-relaxed font-medium">
              Since 2010, the institute has grown into a trusted destination for engineering and MBA education
              in Nashik under the Pune Vidyarthi Griha educational umbrella.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default About;
