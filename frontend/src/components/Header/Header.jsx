import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faXmark } from '@fortawesome/free-solid-svg-icons';
import {
  Laptop2,
  Bot,
  RadioTower,
  Cog,
  ChartNoAxesCombined,
  GraduationCap,
  Database,
  Phone,
  MapPin,
  CircleDollarSign,
} from 'lucide-react';
import './Header.css';

const programRoutes = {
  computer: "/programs/computer-engineering",
  it: "/programs/it-engineering",
  ai: "/programs/ai-ds-engineering",
  entc: "/programs/entc-engineering",
  mechanical: "/programs/mechanical-engineering",
  mba: "/programs/mba",
};

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDropdown = (name) => {
    setActiveDropdown(activeDropdown === name ? null : name);
  };

  const closeAll = () => {
    setActiveDropdown(null);
    setMobileOpen(false);
  };

  return (
    <header className={`main-header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container header-content">
        <Link to="/" className="branding" onClick={closeAll}>
          <img src="/logo.png" alt="PVGCOE Logo" className="brand-logo" />
          <span className="brand-name-akademia">PVGCOE & SSDIOM</span>
        </Link>

        <nav className={`header-nav ${mobileOpen ? 'mobile-open' : ''}`} ref={dropdownRef}>
          <ul className="nav-list">
            <li><NavLink to="/about" className="nav-item" onClick={closeAll}>About</NavLink></li>

            {/* Programmes Dropdown */}
            <li className="nav-dropdown-wrapper">
              <button 
                className="nav-item nav-dropdown-trigger" 
                onClick={() => toggleDropdown('programmes')}
              >
                Programmes
                <svg className={`chevron ${activeDropdown === 'programmes' ? 'open' : ''}`} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
              </button>
              {activeDropdown === 'programmes' && (
                <div className="nav-mega-dropdown">
                  <div className="dropdown-section">
                    <span className="dropdown-label">Engineering (UG)</span>
                    <Link to={programRoutes.computer} className="dropdown-link" onClick={closeAll}>
                      <Laptop2 className="dropdown-icon text-green-600" size={18} strokeWidth={2.2} /> Computer Engineering
                    </Link>
                    <Link to={programRoutes.it} className="dropdown-link" onClick={closeAll}>
                      <Database className="dropdown-icon text-orange-500" size={18} strokeWidth={2.2} /> IT Engineering
                    </Link>
                    <Link to={programRoutes.ai} className="dropdown-link" onClick={closeAll}>
                      <Bot className="dropdown-icon text-blue-600" size={18} strokeWidth={2.2} /> AI & Data Science
                    </Link>
                    <Link to={programRoutes.entc} className="dropdown-link" onClick={closeAll}>
                      <RadioTower className="dropdown-icon text-yellow-600" size={18} strokeWidth={2.2} /> E&TC Engineering
                    </Link>
                    <Link to={programRoutes.mechanical} className="dropdown-link" onClick={closeAll}>
                      <Cog className="dropdown-icon text-red-600" size={18} strokeWidth={2.2} /> Mechanical Engineering
                    </Link>
                  </div>
                  <div className="dropdown-section">
                    <span className="dropdown-label">Management (PG)</span>
                    <Link to={programRoutes.mba} className="dropdown-link" onClick={closeAll}>
                      <ChartNoAxesCombined className="dropdown-icon text-purple-600" size={18} strokeWidth={2.2} /> MBA Programs
                    </Link>
                    <div className="dropdown-divider"></div>
                    <span className="dropdown-label">Admission</span>
                    <Link to="/admissions" className="dropdown-link" onClick={closeAll}>
                      <GraduationCap className="dropdown-icon text-emerald-600" size={18} strokeWidth={2.2} /> Apply for Admission
                    </Link>
                  </div>
                </div>
              )}
            </li>

            {/* Resources Dropdown */}
            <li className="nav-dropdown-wrapper">
              <button 
                className="nav-item nav-dropdown-trigger" 
                onClick={() => toggleDropdown('resources')}
              >
                Resources
                <svg className={`chevron ${activeDropdown === 'resources' ? 'open' : ''}`} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
              </button>
              {activeDropdown === 'resources' && (
                <div className="nav-dropdown">
                  <Link to="/contact" className="dropdown-link" onClick={closeAll}>
                    <Phone className="dropdown-icon text-orange-500" size={18} strokeWidth={2.2} /> Contact Numbers
                  </Link>
                  <Link to="/contact" className="dropdown-link" onClick={closeAll}>
                    <MapPin className="dropdown-icon text-sky-500" size={18} strokeWidth={2.2} /> Campus Address
                  </Link>
                  <Link to="/admissions" className="dropdown-link" onClick={closeAll}>
                    <CircleDollarSign className="dropdown-icon text-violet-500" size={18} strokeWidth={2.2} /> Fee & Scholarships
                  </Link>
                  <Link to="/admissions" className="dropdown-link" onClick={closeAll}>
                    <GraduationCap className="dropdown-icon text-teal-500" size={18} strokeWidth={2.2} /> Admission Enquiry
                  </Link>
                </div>
              )}
            </li>
          </ul>
        </nav>

        <div className="header-actions">
          <Link to="/contact" className="ak-btn-outline" onClick={closeAll}>Get in touch</Link>
          <button className="mobile-toggle" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">
            <FontAwesomeIcon icon={mobileOpen ? faXmark : faBars} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
