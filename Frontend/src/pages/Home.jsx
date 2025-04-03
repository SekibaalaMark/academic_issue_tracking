import React from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home">
      {/* Background Image */}
      <div className="home-background"></div>

      {/* Overlay for better readability */}
      <div className="home-overlay"></div>

      {/* Content Section */}
      <div className="home-content">
        <h1 className="landing-title">Academic Issue Tracking</h1>
        <p className="landing-subtitle">
          Streamline your academic issue resolution process.
        </p>
      </div>

      {/* Navigation Bar */}
      <header className="home-header">
        <nav>
          <ul>
            <li><a href="/login">LOGIN</a></li>
            <li><a href="/register">REGISTER</a></li>
          </ul>
        </nav>
      </header>
    </div>
  );
};

export default Home;
