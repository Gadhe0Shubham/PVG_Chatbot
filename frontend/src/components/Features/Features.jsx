import React from 'react';
import {
  Laptop2,
  Bot,
  Database,
  Cog,
  ChartNoAxesCombined,
  RadioTower,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import './Features.css';

const Features = () => {
  const departments = [
    { icon: Laptop2,             title: "Computer Engineering", seats: "120", color: "#4EBD5E", bg: "rgba(78,189,94,0.1)", slug: "computer-engineering" },
    { icon: Bot,                 title: "AI & Data Science",    seats: "60",  color: "#2369FF", bg: "rgba(35,105,255,0.1)", slug: "ai-ds-engineering" },
    { icon: Database,            title: "IT Engineering",        seats: "120", color: "#F59E0B", bg: "rgba(245,158,11,0.1)", slug: "it-engineering" },
    { icon: RadioTower,          title: "E&TC Engineering",      seats: "120", color: "#D97706", bg: "rgba(217,119,6,0.12)", slug: "entc-engineering" },
    { icon: Cog,                 title: "Mechanical Engg.",      seats: "120", color: "#EF4444", bg: "rgba(239,68,68,0.1)", slug: "mechanical-engineering" },
    { icon: ChartNoAxesCombined, title: "MBA Programs",          seats: "60",  color: "#8B5CF6", bg: "rgba(139,92,246,0.1)", slug: "mba" },
  ];

  const stats = [
    { value: "800+", label: "Students Enrolled" },
    { value: "95%",  label: "Placement Rate" },
    { value: "50+",  label: "Industry Partners" },
    { value: "13+",  label: "Years Legacy" },
  ];

  return (
    <section className="features-section">
      <div className="features-container">

        {/* Department Row */}
        <div className="text-center mb-6">
          <h2 className="section-title">Our Departments</h2>
          <p className="section-subtitle">
            5 undergraduate engineering programs at PVGCOE and 1 MBA program at SSDIOM.
          </p>
        </div>

        <div className="dept-row">
          {departments.map((d, i) => (
            <Link to={`/programs/${d.slug}`} key={i} className="dept-chip">
              <span className="dept-chip-icon" style={{ backgroundColor: d.bg, color: d.color }}>
                <d.icon size={18} strokeWidth={2.2} />
              </span>
              <div className="dept-chip-text">
                <span className="dept-chip-name">{d.title}</span>
                <span className="dept-chip-seats">{d.seats} Seats</span>
              </div>
            </Link>
          ))}
        </div>

        {/* Stats Strip */}
        <div className="stats-strip">
          {stats.map((s, i) => (
            <div key={i} className="stat-block">
              <span className="stat-value">{s.value}</span>
              <span className="stat-label">{s.label}</span>
            </div>
          ))}
        </div>

        {/* CTA Banner */}
        <div className="cta-banner">
          <div className="cta-text">
            <h3>Ready to begin your journey?</h3>
            <p>Apply now through the official admission process. Our admissions team is here to guide you every step of the way.</p>
          </div>
          <div className="cta-actions">
            <Link to="/admissions" className="cta-btn-primary">Apply Now</Link>
            <Link to="/contact" className="cta-btn-secondary">Talk to us</Link>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Features;
