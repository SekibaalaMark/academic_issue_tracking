import React, { useEffect, useState } from 'react';
import './LoadingAnimation.css';

const LoadingAnimation = () => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
    }, 3000); // Animation will last for 3 seconds

    return () => clearTimeout(timer);
  }, []);

  if (!show) return null;

  return (
    <div className="loading-overlay">
      <div className="aits-animation">
        <span className="letter pulse">A</span>
        <span className="letter pulse">I</span>
        <span className="letter pulse">T</span>
        <span className="letter pulse">S</span>
      </div>
      <div className="subtitle">
        Academic Issue Tracking System
      </div>
    </div>
  );
};

export default LoadingAnimation; 