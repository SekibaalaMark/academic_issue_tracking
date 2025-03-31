import React, { useEffect, useState } from "react";

const StudentDashboard = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const response = await fetch("/api/get-issues"); // Replace with your actual API endpoint
        if (!response.ok) {
          throw new Error("Failed to fetch issues");
        }
        const data = await response.json();
        setIssues(data); // Assuming the API returns an array of issues
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchIssues();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Student Dashboard</h1>
      {issues.length === 0 ? (
        <p>No issues submitted yet.</p>
      ) : (
        <ul>
          {issues.map((issue) => (
            <li key={issue.id}>
              <h3>{issue.issue}</h3>
              <p>Comments: {issue.comments}</p>
              {issue.file && (
                <a href={issue.file} target="_blank" rel="noopener noreferrer">
                  View Attachment
                </a>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default StudentDashboard;
