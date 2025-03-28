import React from "react";
import { Link } from "react-router-dom";
import "../../styles/Home.css";
import graduationImage from "@/assets/graduationImage/graduation1.png";

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

export default Home;
