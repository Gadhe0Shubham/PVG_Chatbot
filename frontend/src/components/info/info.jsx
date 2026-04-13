import React from "react";
import "./info.css";

export default function Info(props) {
  const { className } = props;
  return (
    <div className={`mt-24 ml-10 ${className || ''}`}>
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold mb-8 text-white text-shadow">
          Pune Vidyarthi Griha's College of Engineering & SS Dhamankar Institute of Management Nashik Chatbot - College Info &#128218;
        </h1>

        <div className="info-container text-white rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4 text-shadow">About Pune Vidyarthi Griha's College of Engineering & SS Dhamankar Institute of Management Nashik &#127891;</h2>
          <p className="text-lg leading-relaxed">
            Pune Vidyarthi Griha's College of Engineering and SS Dhamankar Institute of Management Nashik was established in 2010. 
            Located in Nashik, Maharashtra, we offer quality engineering education in affiliation with Savitribai Phule Pune University. 
            The institute is approved by AICTE, New Delhi & DTE, Maharashtra, providing excellent programs in Computer, Mechanical, Electrical Engineering, and AI&DS.
          </p>
        </div>

        <div className="info-container text-white rounded-lg p-6 mb-6">
          <h2 className="text-xl font-bold mb-4 text-shadow">
            Chatbot Features &#128172;
          </h2>
          <ul className="list-disc list-inside space-y-2 text-lg">
            <li>Instant answers to admission and course queries &#128161;</li>
            <li>Information about fee structure and eligibility criteria &#128187;</li>
            <li>Campus visit details and contact information &#128526;</li>
            <li>Scholarship and admission process guidance &#128161;</li>
          </ul>
        </div>

        <div className="info-container text-white py-4 text-center mt-6 rounded-lg">
          <p className="text-shadow">
            &#169; {new Date().getFullYear()} Pune Vidyarthi Griha's College of Engineering & SS Dhamankar Institute of Management Nashik - Pune Vidyarthi Griha's College of Engineering & Shri Shivaji Diploma Institute of Management &#127891;
          </p>
        </div>
      </div>
    </div>
  );
}
