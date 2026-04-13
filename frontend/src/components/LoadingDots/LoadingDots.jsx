import React from 'react';
import './LoadingDots.css';

const LoadingDots = () => {
  return (
    <div className="loading-dots-container">
      <div className="loading-dots">
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="dot"></div>
      </div>
      <span className="loading-text">AI is thinking...</span>
    </div>
  );
};

export default LoadingDots;