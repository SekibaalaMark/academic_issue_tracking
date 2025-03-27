import React, { useState, useEffect } from "react";
import "./IssuesTable.css";

const IssuesTable = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data from API (Simulated with JSON Placeholder for now)
  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/users") // Replace with Django API later
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        const formattedData = data.map((user) => ({
          name: user.name,
          number: user.id, 
          email: user.email,
          courseUnits: Math.floor(Math.random() * 5) + 1, // Simulating course units
          issue: Math.random() > 0.5 ? "missing marks" : "appeal", // Placeholder issue
          status: Math.random() > 0.5 ? "Resolved" : "Pending" , "Open": "in progress" // Random status
        }));
        setIssues(formattedData);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="issues-table">
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>Error: {error.message}</div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Student Name</th>
              <th>Student Number</th>
              <th>Email</th>
              <th>Course Units</th>
              <th>Issue</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {issues.length > 0 ? (
              issues.map((issue, index) => (
                <tr key={index}>
                  <td>{issue.name}</td>
                  <td>{issue.number}</td>
                  <td>{issue.email}</td>
                  <td>{issue.courseUnits}</td>
                  <td>{issue.issue}</td>
                  <td className={issue.status.toLowerCase()}>{issue.status}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">No data available</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default IssuesTable;
