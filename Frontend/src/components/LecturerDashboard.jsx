import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import IssueTable from "./IssuesTable";
import "./LecturerDashboard.css";// Global styles

const Dashboard = () => {
  const [issues, setIssues] = useState([]); // Store student issues
  const [loading, setLoading] = useState(true); // Loading state

  // Fetch issues from an API (Replace with your actual API URL)
  useEffect(() => {
    fetch("https://api.example.com/issues") // Replace with your actual API
      .then((response) => response.json())
      .then((data) => {
        setIssues(data); // Update issues state
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching issues:", error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="dashboard-container">
      <Sidebar /> {/* Sidebar Navigation */}
      <div className="main-content">
        <Header /> {/* Top Header */}
        <div className="issues-section">
          <h2>Student Issues</h2>
          {loading ? <p>Loading issues...</p> : <IssuesTable issues={issues} />}
        </div>
        
      </div>
    </div>
  );
};

export default Dashboard;