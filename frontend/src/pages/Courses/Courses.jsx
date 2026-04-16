import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faLaptopCode, faCogs, faBolt, faRobot, faServer, faChartLine 
} from '@fortawesome/free-solid-svg-icons';
import './Courses.css';

const courses = [
  {
    icon: faLaptopCode,
    title: "Computer Engineering",
    slug: "computer-engineering",
    description: "In-depth study of software engineering, algorithms, and distributed systems. Focus on modern stacks and cloud computing.",
    seats: "120 Seats",
    bg: "rgba(78, 189, 94, 0.1)",
    color: "#4EBD5E"
  },
  {
    icon: faRobot,
    title: "AI & Data Science",
    slug: "ai-ds-engineering",
    description: "Program focused on Artificial Intelligence, Machine Learning, and Data Analytics with an industry-oriented approach.",
    seats: "60 Seats",
    bg: "rgba(35, 105, 255, 0.1)",
    color: "#2369FF"
  },
  {
    icon: faBolt,
    title: "E&TC Engineering",
    slug: "entc-engineering",
    description: "Electronics and Telecommunication engineering with focus on communication systems, embedded design, and modern electronics.",
    seats: "120 Seats",
    bg: "rgba(245, 158, 11, 0.12)",
    color: "#D97706"
  },
  {
    icon: faCogs,
    title: "Mechanical Engineering",
    slug: "mechanical-engineering",
    description: "Core engineering discipline with training in design, thermal, and manufacturing domains supported by dedicated laboratories.",
    seats: "120 Seats",
    bg: "rgba(239, 68, 68, 0.1)",
    color: "#EF4444"
  },
  {
    icon: faChartLine,
    title: "MBA Programs",
    slug: "mba",
    description: "Master of Business Administration at SSDIOM, Nashik focused on management, leadership, and business strategy.",
    seats: "60 Seats",
    bg: "rgba(139, 92, 246, 0.1)",
    color: "#8B5CF6"
  },
  {
    icon: faServer,
    title: "IT Engineering",
    slug: "it-engineering",
    description: "Focus on information management, cybersecurity, and network infrastructure. Industry-aligned curriculum.",
    seats: "120 Seats",
    bg: "rgba(100, 100, 100, 0.1)",
    color: "#555555"
  }
];

const Courses = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="courses-page-ak"
    >
      <div className="container py-24">
        <div className="text-center mb-20">
          <h1 className="text-6xl font-black mb-8">Academic Programs</h1>
          <p className="text-xl text-muted max-w-2xl mx-auto font-medium">
            PVGCOE offers UG Engineering programs while SSDIOM offers a PG Management program (MBA).
          </p>
        </div>

        <div className="courses-grid-ak grid lg:grid-cols-2 gap-12">
          {courses.map((course, index) => (
            <motion.div 
              key={index}
              whileHover={{ y: -8 }}
              className="ak-course-card"
            >
              <div className="flex gap-8 p-10">
                <div 
                  className="ak-icon-box"
                  style={{ backgroundColor: course.bg, color: course.color }}
                >
                  <FontAwesomeIcon icon={course.icon} />
                </div>
                
                <div className="flex-1">
                  <h3 className="text-3xl font-bold mb-4">{course.title}</h3>
                  <p className="text-muted mb-8 font-medium leading-relaxed">{course.description}</p>
                  
                  <div className="flex items-center justify-between mt-auto pt-6 border-t border-slate-50">
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground mb-1">Capacity</span>
                      <span className="text-lg font-black">{course.seats}</span>
                    </div>
                    <Link to={`/programs/${course.slug}`} className="ak-btn-primary">View More</Link>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-32 p-20 ak-cta-box rounded-[60px] text-center bg-black text-white relative overflow-hidden">
           <div className="relative z-10">
              <h3 className="text-4xl font-black mb-6">Need Course Guidance?</h3>
              <p className="text-xl mb-10 opacity-70 font-medium max-w-2xl mx-auto">Talk to the admission team for eligibility, intake, fee structure, and counseling support.</p>
              <a className="ak-btn-primary !bg-white !text-black hover:!bg-opacity-90 inline-block" href="https://www.pvgcoenashik.edu.in/admission.php" target="_blank" rel="noreferrer">Visit Admission Page</a>
           </div>
           {/* Decorative Green Accent */}
           <div className="absolute top-0 right-0 w-64 h-64 bg-[#4EBD5E] rounded-full blur-[120px] opacity-20 -mr-32 -mt-32"></div>
        </div>
      </div>
    </motion.div>
  );
};

export default Courses;
