// src/pages/IssueDetails.jsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Use `useNavigate` instead of `useHistory`
import axios from 'axios';
import styled from 'styled-components';

// Styled components
const Button = styled.button`
  padding: 8px 12px;
  margin-right: 10px;
  cursor: pointer;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;

  &:hover {
    background-color: #0056b3;
  }
`;

const Container = styled.div`
  padding: 2rem;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;

const InfoSection = styled.div`
  margin-bottom: 1rem;
`;

const Label = styled.span`
  font-weight: bold;
  margin-right: 5px;
`;

const Value = styled.span`
  color: #555;
`;

const Heading = styled.h2`
  font-size: 24px;
  margin-bottom: 1rem;
`;

const IssueDetails = () => {
  const { issueId } = useParams(); // Use URL params to get the issueId
  const [issue, setIssue] = useState(null);
  const navigate = useNavigate(); // Use `useNavigate` from `react-router-dom`

  // Fetch issue data when the component is mounted
  useEffect(() => {
    axios
      .get(`/api/issues/${issueId}`)
      .then((response) => {
        setIssue(response.data);
      })
      .catch((err) => {
        console.error('Error fetching issue details:', err);
      });
  }, [issueId]);

  // Handle editing the issue (navigate to edit page)
  const handleEdit = () => {
    navigate(`/edit-issue/${issueId}`); // Navigate to the edit page
  };

  // Handle deleting the issue
  const handleDelete = () => {
    axios
      .delete(`/api/issues/${issueId}`)
      .then(() => {
        alert('Issue deleted successfully');
        navigate('/'); // Redirect to the home page or issue list
      })
      .catch((err) => {
        console.error('Error deleting the issue:', err);
      });
  };

  // Render loading or error state if issue data is not available
  if (!issue) {
    return <div>Loading...</div>;
  }

  return (
    <Container>
      <Heading>Issue Details</Heading>

      {/* Issue ID or Title */}
      <h3>{issue.title || `Issue ID: ${issue.id}`}</h3>

      {/* Issue Data */}
      <InfoSection>
        <Label>Course Code: </Label>
        <Value>{issue.courseCode}</Value>
      </InfoSection>
      <InfoSection>
        <Label>Issue Type: </Label>
        <Value>{issue.issueType}</Value>
      </InfoSection>
      <InfoSection>
        <Label>Status: </Label>
        <Value style={{ color: getStatusColor(issue.status) }}>{issue.status}</Value>
      </InfoSection>
      <InfoSection>
        <Label>Description: </Label>
        <Value>{issue.description}</Value>
      </InfoSection>

      {/* Action Buttons */}
      <div>
        <Button onClick={handleEdit}>Edit Issue</Button>
        <Button onClick={handleDelete}>Delete Issue</Button>
      </div>
    </Container>
  );
};

// Helper function for determining status color
const getStatusColor = (status) => {
  switch (status) {
    case 'pending':
      return 'orange';
    case 'resolved':
      return 'green';
    case 'overdue':
      return 'red';
    default:
      return 'gray';
  }
};

export default IssueDetails;
