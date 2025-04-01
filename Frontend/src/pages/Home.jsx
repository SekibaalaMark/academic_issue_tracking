import React from "react";
<<<<<<< HEAD
import { Link } from "react-router-dom";
import "../../styles/Home.css";
// import graduationImage from "@/assets/graduationImage/graduation1.png";

function Home() {
  return (
    <div className="home-container">
      <h1>Welcome to the Academic Tracking System</h1>
      <ul>
        <li>
          <Link to="/dashboard/student">Student Dashboard</Link>
        </li>
        <li>
          <Link to="/dashboard/lecturer">Lecturer Dashboard</Link>
        </li>
        <li>
          <Link to="/dashboard/academic-registrar">
            Academic Registrar Dashboard
          </Link>
        </li>
      </ul>
    </div>
  );
}
=======
import "./Home.css";

const Home = () => {
  return (
    <div className="home">
       {/* Top navigation bar */}
       <header className="home-header">
        <nav>
          <ul>
            <li><a href="/login">LOGIN</a></li>
            <li><a href="/register">REGISTER</a></li>
          </ul>
        </nav>
      </header>

      {/* Main content */}
      <main className="home-main">       
        <h1 className="landing-title">ACADEMIC ISSUE TRACKING</h1>
      </main>
    </div>
  );
};


>>>>>>> origin/main

export default Home;
