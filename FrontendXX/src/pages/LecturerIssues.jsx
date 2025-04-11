import React, { useEffect, useState } from 'react';

const LecturerIssues = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch issues assigned to the lecturer
    const fetchIssues = async () => {
      try {
        const response = await fetch('/api/issues?assignedTo=lecturer'); // Adjust API endpoint as needed
        const data = await response.json();
        setIssues(data);
      } catch (error) {
        console.error('Error fetching issues:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchIssues();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Issues Assigned to Lecturer</h2>
      {issues.length === 0 ? (
        <p>No issues assigned.</p>
      ) : (
        <ul>
          {issues.map((issue) => (
            <li key={issue.id}>
              <h3>{issue.title}</h3>
              <p>{issue.description}</p>
              <p>Status: {issue.status}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LecturerIssues;
