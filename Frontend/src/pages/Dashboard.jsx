// src/pages/Dashboard.jsx
import  { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Dashboard.css";

const Dashboard = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      setIsLoggedIn(true);
    } else {
      window.location.href = "/login"; // Redirect to login if not authenticated
    }
  }, []);

  if (!isLoggedIn) return <div>Loading...</div>;

  return (
    <div className="dashboard-container">
      <h1>Welcome to the Dashboard</h1>
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
};

export default Dashboard;
