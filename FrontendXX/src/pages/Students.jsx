import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import { useNavigate } from "react-router-dom"; // Use useNavigate instead of useHistory

const Input = styled.input`
  padding: 8px 12px;
  border-radius: 5px;
  border: 1px solid #ddd;
`;

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

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 2rem;

  th,
  td {
    padding: 8px;
    text-align: left;
    border: 1px solid #ddd;
  }

  tr:nth-child(even) {
    background-color: #f9f9f9;
  }

  tr:hover {
    background-color: #f1f1f1;
  }
`;

const Navigation = styled.nav`
  margin-bottom: 2rem;
  background-color: #333;
  padding: 1rem;

  a {
    color: white;
    text-decoration: none;
    padding: 10px 15px;
    margin-right: 10px;
    border-radius: 5px;
    background-color: #444;

    &:hover {
      background-color: #555;
    }
  }
`;

function Students() {
  const [issues, setIssues] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [formData, setFormData] = useState({
    courseCode: "",
    issueType: "missing marks",
    description: "",
  });
  const navigate = useNavigate(); // Initialize navigate for redirection

  // Fetch issues and notifications
  useEffect(() => {
    fetch("https://academic-6ea365e4b745.herokuapp.com/api/student-issues/?format=api")
      .then((res) => res.json())
      .then((data) => setIssues(Array.isArray(data) ? data : []))
      .catch((err) => console.error("Error fetching issues:", err));

    axios
      .get("/api/notifications")
      .then((res) => setNotifications(Array.isArray(res.data) ? res.data : []))
      .catch((err) => console.error("Error fetching notifications:", err));
  }, []);

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Submit issue
  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("/api/issues", formData)
      .then((res) => {
        setIssues([...issues, res.data]);
        setFormData({
          courseCode: "",
          issueType: "missing marks",
          description: "",
        });
        navigate("/"); // Redirect to home after submission
      })
      .catch((err) => console.error("Error submitting issue:", err));
  };

  // Helper function for determining status color
  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "orange";
      case "resolved":
        return "green";
      case "overdue":
        return "red";
      default:
        return "gray";
    }
  };

  // Redirect to the issue details page
  const handleViewDetails = (issueId) => {
    navigate(`/issue-details/${issueId}`);
  };

  // Redirect to the submit issue page
  const handleSubmitIssue = () => {
    navigate("/submit-issue");
  };

  // Redirect to the notification details page
  const handleNotificationClick = (notificationId) => {
    navigate(`/notification-details/${notificationId}`);
  };

  return (
    <div style={{ padding: "1rem" }}>
      <Navigation>
        <a href="/">Home</a>
        <a onClick={handleSubmitIssue}>Submit Issue</a>
        <a href="/notifications">Notifications</a>
        <a href="/profile">Profile</a>
      </Navigation>

      <h1>Student Issue Tracking</h1>

      {/* Issue Submission Form */}
      <form onSubmit={handleSubmit} style={{ marginBottom: "2rem" }}>
        <div>
          <label>Course Code: </label>
          <Input
            type="text"
            name="courseCode"
            value={formData.courseCode}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Issue Type: </label>
          <select
            name="issueType"
            value={formData.issueType}
            onChange={handleChange}
          >
            <option value="missing marks">Missing Marks</option>
            <option value="appeals">Appeals</option>
            <option value="corrections">Corrections</option>
          </select>
        </div>
        <div>
          <label>Description: </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>
        <Button type="submit">Submit Issue</Button>
      </form>

      {/* Issue List */}
      <h2>Your Issues</h2>
      {issues.length > 0 ? (
        <Table>
          <thead>
            <tr>
              <th>Course Code</th>
              <th>Issue Type</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {issues.map((issue) => (
              <tr key={issue.id}>
                <td>{issue.courseCode}</td>
                <td>{issue.issueType}</td>
                <td style={{ color: getStatusColor(issue.status) }}>
                  {issue.status}
                </td>
                <td>
                  <Button onClick={() => handleViewDetails(issue.id)}>
                    View Details
                  </Button>
                  <Button>Edit Issue</Button>
                  <Button>Delete Issue</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <p>No issues found.</p>
      )}

      <hr />

      {/* Notifications */}
      <h2>Notifications</h2>
      {notifications.length > 0 ? (
        <ul>
          {notifications.map((note, idx) => (
            <li key={idx}>
              <a onClick={() => handleNotificationClick(note.id)}>
                {note.message} (Status: {note.statusChange})
              </a>
              <br />
              <small>Received on: {new Date(note.timestamp).toLocaleString()}</small>
            </li>
          ))}
        </ul>
      ) : (
        <p>No notifications found.</p>
      )}
    </div>
  );
}

export default Students;
