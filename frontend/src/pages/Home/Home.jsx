import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Hero from '../../components/Hero/Hero';
import Features from '../../components/Features/Features';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGraduationCap, faMicrochip, faUniversity } from '@fortawesome/free-solid-svg-icons';
import './Home.css';

const Home = () => {
  const highlights = [
    {
      icon: faUniversity,
      title: "Academic Excellence",
      description:
        "Established in 2010 and affiliated to Savitribai Phule Pune University with AICTE and DTE approvals.",
      iconClass: "ak-highlight-icon-yellow"
    },
    {
      icon: faMicrochip,
      title: "Modern Labs",
      description:
        "Dedicated labs and infrastructure across Computer, IT, Mechanical, E&TC, and AI&DS departments.",
      iconClass: "ak-highlight-icon-blue"
    },
    {
      icon: faGraduationCap,
      title: "Expert Faculty",
      description:
        "Experienced faculty and technical staff support 800+ students across UG engineering and MBA programs.",
      iconClass: "ak-highlight-icon-green"
    }
  ];

  const [email, setEmail] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      alert("Subscription successful for: " + email);
      setEmail("");
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="home-page-ak"
    >
      <Hero />
      
      {/* Newsletter Section - Directly under Hero as in the image */}
      <section className="newsletter-section">
        <div className="container">
          <form onSubmit={handleSubscribe} className="newsletter-form">
            <input 
              type="email" 
              className="newsletter-input" 
              placeholder="Enter your email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" className="newsletter-btn">
              Send
            </button>
          </form>
        </div>
      </section>

      <section className="highlights-section-ak py-24">
        <div className="container">
          <div className="text-center mb-16 ak-highlights-head">
            <span className="ak-highlights-kicker">Why Choose Us</span>
            <h2 className="text-4xl font-bold mb-4">Why PVGCOE & SSDIOM?</h2>
            <p className="text-muted max-w-2xl mx-auto text-lg font-medium ak-highlights-subtext">
              We combine strong academics, industry-oriented learning, and student-focused guidance for engineering and management education.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-10">
            {highlights.map((item) => (
              <article key={item.title} className="ak-highlight-card">
                <div className={`ak-icon-box ${item.iconClass}`}>
                  <FontAwesomeIcon icon={item.icon} />
                </div>
                <h3 className="text-2xl font-bold mb-4 mt-6">{item.title}</h3>
                <p className="text-muted text-md font-medium">{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <Features />
    </motion.div>
  );
};

export default Home;
