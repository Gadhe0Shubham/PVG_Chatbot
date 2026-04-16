import React from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { GraduationCap, Clock3, Users, WalletCards, BookOpenCheck, ArrowRight } from "lucide-react";
import { getProgramBySlug } from "../../data/programs";
import "./ProgramDetail.css";

const InfoBlock = ({ title, text }) => (
  <section className="program-detail-card">
    <h3>{title}</h3>
    <p>{text || "Information currently unavailable in the dataset."}</p>
  </section>
);

const extractValue = (text, regex, fallback = "As Per Norms") => {
  if (!text) return fallback;
  const match = text.match(regex);
  return match?.[1] || fallback;
};

const cleanOverview = (title, overview) => {
  if (!overview) {
    return `${title} at PVGCOE & SSDIOM Nashik. Explore intake, eligibility, fee structure, and duration details below.`;
  }
  if (overview.toLowerCase().startsWith("what do you want to know")) {
    return `${title} at PVGCOE & SSDIOM Nashik. Explore intake, eligibility, fee structure, and duration details below.`;
  }
  return overview;
};

const ProgramDetail = () => {
  const { slug } = useParams();
  const program = getProgramBySlug(slug);

  if (!program) {
    return (
      <div className="program-detail-page">
        <div className="container py-24">
          <div className="program-detail-not-found">
            <h1>Program Not Found</h1>
            <p>The requested program page is not available.</p>
            <Link to="/courses" className="program-detail-back">Back To Programs</Link>
          </div>
        </div>
      </div>
    );
  }

  const intake = extractValue(program.intakeFE, /(\d+)/);
  const duration = extractValue(program.duration, /(\d+\s*years?)/i);
  const openFee = extractValue(program.feeOpen, /RS\s*([0-9]+)/i, "As Per Norms");
  const overviewText = cleanOverview(program.title, program.overview);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      className="program-detail-page"
    >
      <div className="container py-24">
        <div className="program-detail-head">
          <span className="program-detail-kicker">{program.level} Program</span>
          <h1>{program.title}</h1>
          <p>{overviewText}</p>
          <div className="program-detail-actions">
            <Link to="/courses" className="program-detail-back">Back To Programs</Link>
            <a href="https://www.pvgcoenashik.edu.in/admission.php" className="program-detail-apply" target="_blank" rel="noreferrer">
              Admission Enquiry <ArrowRight size={16} />
            </a>
          </div>
        </div>

        <section className="program-detail-metrics">
          <div className="program-detail-metric">
            <Users size={18} />
            <div>
              <span>Intake</span>
              <strong>{intake}</strong>
            </div>
          </div>
          <div className="program-detail-metric">
            <Clock3 size={18} />
            <div>
              <span>Duration</span>
              <strong>{duration}</strong>
            </div>
          </div>
          <div className="program-detail-metric">
            <WalletCards size={18} />
            <div>
              <span>Open Category Fee</span>
              <strong>{openFee === "As Per Norms" ? openFee : `Rs ${openFee}`}</strong>
            </div>
          </div>
          <div className="program-detail-metric">
            <GraduationCap size={18} />
            <div>
              <span>Level</span>
              <strong>{program.level}</strong>
            </div>
          </div>
        </section>

        <div className="program-detail-grid">
          <InfoBlock title="Intake (First Year / Main Intake)" text={program.intakeFE} />
          {program.intakeDSY ? <InfoBlock title="Intake (Direct Second Year)" text={program.intakeDSY} /> : <InfoBlock title="Direct Second Year" text="For this program, DSY intake is not listed in the dataset." />}
          <InfoBlock title="Eligibility Criteria" text={program.eligibility} />
          <InfoBlock title="Course Duration" text={program.duration} />
          <section className="program-detail-card program-detail-fees">
            <h3>Fee Structure</h3>
            <div className="program-detail-fee-row">
              <span>OPEN</span>
              <p>{program.feeOpen}</p>
            </div>
            <div className="program-detail-fee-row">
              <span>OBC</span>
              <p>{program.feeObc}</p>
            </div>
            <div className="program-detail-fee-row">
              <span>SC / ST</span>
              <p>{program.feeScst}</p>
            </div>
          </section>
        </div>

        {program.commonQueries?.length ? (
          <div className="program-detail-queries">
            <h2><BookOpenCheck size={18} /> Common Questions From Dataset</h2>
            <ul>
              {program.commonQueries.map((query) => (
                <li key={query}>{query}</li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </motion.div>
  );
};

export default ProgramDetail;
