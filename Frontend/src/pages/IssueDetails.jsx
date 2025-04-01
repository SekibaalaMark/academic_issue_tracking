// src/pages/IssueDetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './IssueDetails.css';

const IssueDetails = () => {
  const { issueId } = useParams();
  const [issue, setIssue] = useState(null);
  const navigate = useNavigate();

  // Fetch issue details from backend API
  useEffect(() => {
    axios
      .get('http://127.0.0.1:8000/api/issues/' + issueId + '/')
      .then((response) => setIssue(response.data))
      .catch((err) => {
        console.error('Error fetching issue details:', err);
      });
  }, [issueId]);

  // Navigate to edit issue page
  const handleEdit = () => {
    navigate(`/edit-issue/${issueId}`);
  };

  // Delete the issue and then navigate to Issues List or Dashboard
  const handleDelete = () => {
    axios
      .delete('http://127.0.0.1:8000/api/issues/')
      .then(() => {
        alert('Issue deleted successfully');
        navigate('/issues'); // or navigate('/dashboard') if preferred
      })
      .catch((err) => {
        console.error('Error deleting the issue:', err);
      });
  };

  // Navigate to update profile page (for students)
  const handleUpdateProfile = () => {
    navigate('/update-profile');
  };

  if (!issue) {
    return <div className="issue-container">Loading...</div>;
  }

  return (
    <div className="issue-container">
      <h2 className="issue-heading">Issue Details</h2>
      <h3 className="issue-title">{issue.title || `Issue ID: ${issue.id}`}</h3>
      <div className="issue-info">
        <div className="info-section">
          <span className="info-label">Course Code:</span>
          <span className="info-value">{issue.course_code}</span>
        </div>
        <div className="info-section">
          <span className="info-label">Issue Type:</span>
          <span className="info-value">{issue.category}</span>
        </div>
        <div className="info-section">
          <span className="info-label">Status:</span>
          <span className="info-value" style={{ color: getStatusColor(issue.status) }}>
            {issue.status}
          </span>
        </div>
        <div className="info-section">
          <span className="info-label">Description:</span>
          <span className="info-value">{issue.description}</span>
        </div>
      </div>
      <div className="button-group">
        <button className="btn" onClick={handleEdit}>Edit Issue</button>
        <button className="btn" onClick={handleDelete}>Delete Issue</button>
      </div>
      <div className="nav-group">
        <button className="btn" onClick={() => navigate('/issues')}>Back to Issues List</button>
        <button className="btn" onClick={() => navigate('/dashboard')}>Dashboard</button>
        <button className="btn" onClick={handleUpdateProfile}>Update Profile</button>
      </div>
    </div>
  );
};

// Helper function to determine color based on issue status
const getStatusColor = (status) => {
  switch (status) {
    case 'pending':
      return 'orange';
    case 'in_progress':
      return 'blue';
    case 'resolved':
      return 'green';
    default:
      return 'gray';
  }
};

export default IssueDetails;
