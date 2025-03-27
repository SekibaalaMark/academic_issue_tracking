import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import IssueTable from "./IssuesTable"; // Ensure the import matches the component name
import "./Lecturer.css"; // Global styles

const Lecturer = () => {
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

  // Log loading and issues state for debugging
  console.log("Loading:", loading);
  console.log("Issues:", issues);

  return (
    <div className="dashboard-container">
      <Sidebar /> {/* Sidebar Navigation */}
      <div className="main-content">
        <Header /> {/* Top Header */}
        <div className="issues-section">
          <h2>Student Issues</h2>
          {loading ? (
            <p>Loading issues...</p>
          ) : (
            <IssueTable issues={issues} /> // Ensure the component name is consistent
          )}
        </div>
      </div>
    </div>
  );
};

export default Lecturer;
