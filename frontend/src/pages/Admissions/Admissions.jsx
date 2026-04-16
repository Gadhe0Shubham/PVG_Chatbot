import React from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileAlt, faCheckCircle, faClipboardList, faUserCheck } from '@fortawesome/free-solid-svg-icons';
import './Admissions.css';

const Admissions = () => {
  const steps = [
    {
      icon: faClipboardList,
      title: "Registration",
      desc: "Register online on the DTE Maharashtra portal and fill the option form for CAP rounds.",
      color: "#4EBD5E",
      bg: "rgba(78, 189, 94, 0.1)"
    },
    {
      icon: faFileAlt,
      title: "Verification",
      desc: "Visit the Facilitation Center (FC) with original documents for verification and confirmation.",
      color: "#2369FF",
      bg: "rgba(35, 105, 255, 0.1)"
    },
    {
      icon: faUserCheck,
      title: "Seat Allotment",
      desc: "Check the allotment status on the DTE portal and report to the ARC for seat acceptance.",
      color: "#D4DD3E",
      bg: "rgba(234, 242, 124, 0.2)"
    },
    {
      icon: faCheckCircle,
      title: "Final Reporting",
      desc: "Visit the college with allotment letter and complete final fee payment and formalities.",
      color: "#000000",
      bg: "rgba(0, 0, 0, 0.05)"
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="admissions-page-ak"
    >
      <div className="container py-24">
        <div className="text-center mb-24">
          <h1 className="text-6xl font-black mb-6">Admissions Enquiry</h1>
          <p className="text-xl text-muted max-w-2xl mx-auto font-medium leading-relaxed">
            Admission guidance for PVGCOE (UG Engineering) and SSDIOM (MBA) programs.
            Follow the official process and connect with the help desk for support.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-20 mb-32">
          <div>
            <h2 className="text-3xl font-black mb-12 flex items-center">
              Eligibility Criteria
            </h2>
            <div className="space-y-8">
              <div className="ak-admission-card">
                <h4 className="text-2xl font-bold mb-4">FE Engineering</h4>
                <p className="text-muted font-medium mb-6">Minimum aggregate 50% in 10+2 with Physics and Mathematics, and one of Chemistry/Computer Science.</p>
                <div className="flex items-center gap-2 text-black font-bold text-sm">
                  <div className="w-6 h-6 rounded-full bg-green-100 text-green-700 flex items-center justify-center">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-[10px]" />
                  </div>
                  <span>Minimum passing marks are essential in each required subject.</span>
                </div>
              </div>

              <div className="ak-admission-card">
                <h4 className="text-2xl font-bold mb-4">Direct Second Year</h4>
                <p className="text-muted font-medium mb-6">Available as DSY intake for engineering branches as per applicable admission norms.</p>
                <div className="flex items-center gap-2 text-black font-bold text-sm">
                   <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-[10px]" />
                  </div>
                  <span>DSY intake values vary by academic year and branch.</span>
                </div>
              </div>

              <div className="ak-admission-card">
                <h4 className="text-2xl font-bold mb-4">MBA Programs</h4>
                <p className="text-muted font-medium mb-6">Bachelor's degree in any discipline with minimum 50% marks (45% for SC/ST candidates).</p>
                <div className="flex items-center gap-2 text-black font-bold text-sm">
                   <div className="w-6 h-6 rounded-full bg-yellow-100 text-yellow-700 flex items-center justify-center">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-[10px]" />
                  </div>
                  <span>Valid CAT/MAT/CMAT/XAT/ATMA score required for admission.</span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-3xl font-black mb-12 flex items-center">
              Admission Process
            </h2>
            <div className="ak-timeline space-y-12">
              {steps.map((step, idx) => (
                <div key={idx} className="ak-timeline-item">
                  <div 
                    className="ak-timeline-icon" 
                    style={{ backgroundColor: step.bg, color: step.color }}
                  >
                    <FontAwesomeIcon icon={step.icon} />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xl font-bold mb-2">{step.title}</h4>
                    <p className="text-muted font-medium leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="ak-cta-banner rounded-[60px] bg-black text-white p-20 text-center relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-5xl font-black mb-8">Start Your Journey Today</h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto mb-12 font-medium">
              For official admission enquiry, visit the admission portal or contact the college help desk directly.
            </p>
            <div className="flex flex-wrap justify-center gap-8">
              <a className="ak-btn-primary !bg-white !text-black py-5 px-12 text-lg inline-block" href="https://www.pvgcoenashik.edu.in/admission.php" target="_blank" rel="noreferrer">Open Admission Portal</a>
              <a className="ak-btn-primary !bg-[#4EBD5E] py-5 px-12 text-lg flex items-center gap-3" href="tel:18002665330">
                <FontAwesomeIcon icon={faUserCheck} />
                Call Admission Desk
              </a>
            </div>
          </div>
          {/* Decorative gradients */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/20 blur-[100px] rounded-full -mr-40 -mt-40"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-green-600/20 blur-[100px] rounded-full -ml-40 -mb-40"></div>
        </div>
      </div>
    </motion.div>
  );
};

export default Admissions;
