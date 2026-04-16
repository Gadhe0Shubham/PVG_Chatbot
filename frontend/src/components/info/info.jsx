import React from "react";
import "./info.css";

export default function Info(props) {
  const { className } = props;
  return (
    <div className={`mt-24 ml-10 ${className || ''}`}>
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold mb-8 text-white text-shadow">
          Pune Vidyarthi Griha's College of Engineering & SS Dhamankar Institute of Management Nashik - College Information
        </h1>

        <div className="info-container text-white rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4 text-shadow">About PVGCOE & SSDIOM Nashik</h2>
          <p className="text-lg leading-relaxed">
            Pune Vidyarthi Griha's College of Engineering and SS Dhamankar Institute of Management Nashik was established in 2010. 
            Located in Nashik, Maharashtra, we offer quality engineering education in affiliation with Savitribai Phule Pune University. 
            The institute is approved by AICTE, New Delhi & DTE, Maharashtra, offering Computer, IT, Mechanical, E&TC, AI&DS engineering and MBA programs.
          </p>
        </div>

        <div className="info-container text-white rounded-lg p-6 mb-6">
          <h2 className="text-xl font-bold mb-4 text-shadow">
            Chatbot Features
          </h2>
          <ul className="list-disc list-inside space-y-2 text-lg">
            <li>Instant answers to admission and course queries</li>
            <li>Information about fee structure and eligibility criteria</li>
            <li>Campus visit details and contact information</li>
            <li>Scholarship and admission process guidance</li>
          </ul>
        </div>

        <div className="info-container text-white py-4 text-center mt-6 rounded-lg">
          <p className="text-shadow">
            © {new Date().getFullYear()} Pune Vidyarthi Griha's College of Engineering & SS Dhamankar Institute of Management Nashik
          </p>
        </div>
      </div>
    </div>
  );
}
