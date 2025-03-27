import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/Dashboard.css";

const Dashboard = () => {
  const [isUserLoggedIn, setUserLoggedIn] = useState(false);
  const [issuesData, setIssuesData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorText, setErrorText] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {

  }, [navigate]);

  const getIssues = async (token) => {
    try {
      const response = await fetch("https://api.example.com/issues", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setIssuesData(data);
      } else {
        setErrorText("Failed to fetch issues. Please try again later.");
      }
    } catch (error) {
      setErrorText("Error fetching issues. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  // if (!isUserLoggedIn) return null;

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
          <Link to="/dashboard/academic-registrar">Academic Registrar Dashboard</Link>
        </li>
      </ul>
      <div className="issues-section">
        <h2>Issues Tracker</h2>
        {isLoading ? (
          <p>Loading issues...</p>
        ) : errorText ? (
          <p>{errorText}</p>
        ) : (
          <ul>
            {issuesData.map((issue) => (
              <li key={issue.id}>{issue.title}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

