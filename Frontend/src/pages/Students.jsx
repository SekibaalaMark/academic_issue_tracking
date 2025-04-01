// src/pages/Students.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Students.css";

function Students() {
  const [issues, setIssues] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [formData, setFormData] = useState({
    courseCode: "",
    issueType: "missing marks",
    description: "",
  });
  const navigate = useNavigate();

  // Fetch issues and notifications
  useEffect(() => {
    fetch("/api/issues/mine")
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
        navigate("/"); // Redirect to home after submission (adjust as needed)
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

  // Redirect to the notification details page
  const handleNotificationClick = (notificationId) => {
    navigate(`/notification-details/${notificationId}`);
  };

  // For demonstration, the "Home" and "Notifications" side menu items could also route accordingly
  // E.g., navigate("/notifications") or navigate("/dashboard") as needed.

  return (
    <div className="student-dashboard">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2 className="sidebar-title">Student Dashboard</h2>
        <ul className="sidebar-nav">
          <li onClick={() => navigate("/")}>Home</li>
          <li onClick={() => navigate("#issue-form")}>Submit Issue</li>
          <li onClick={() => navigate("/notifications")}>Notifications</li>
          <li onClick={() => navigate("/update-profile")}>Profile</li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <h1 className="page-title">Student Issue Tracking</h1>

        {/* Issue Submission Form */}
        <form onSubmit={handleSubmit} id="issue-form" className="issue-form">
          <div className="form-group">
            <label>Course Code:</label>
            <input
              type="text"
              name="courseCode"
              value={formData.courseCode}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Issue Type:</label>
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
          <div className="form-group">
            <label>Description:</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="btn-submit">
            Submit Issue
          </button>
        </form>

        {/* Issue List */}
        <h2 className="section-title">Your Issues</h2>
        {issues.length > 0 ? (
          <table className="issues-table">
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
                    <button
                      className="btn-action"
                      onClick={() => handleViewDetails(issue.id)}
                    >
                      View Details
                    </button>
                    <button className="btn-action">Edit Issue</button>
                    <button className="btn-action">Delete Issue</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No issues found.</p>
        )}

        <hr />

        {/* Notifications */}
        <h2 className="section-title">Notifications</h2>
        {notifications.length > 0 ? (
          <ul className="notifications-list">
            {notifications.map((note, idx) => (
              <li key={idx} className="notification-item">
                <a onClick={() => handleNotificationClick(note.id)}>
                  {note.message} (Status: {note.statusChange})
                </a>
                <br />
                <small>
                  Received on: {new Date(note.timestamp).toLocaleString()}
                </small>
              </li>
            ))}
          </ul>
        ) : (
          <p>No notifications found.</p>
        )}
      </main>
    </div>
  );
}

export default Students;
