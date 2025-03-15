import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";

const Input = styled.input`
  padding: 8px 12px;
  border-radius: 5px;
  border: 1px solid #ddd;
`;

function Students() {
  const [issues, setIssues] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [formData, setFormData] = useState({
    courseCode: "",
    issueType: "missing marks",
    description: "",
  });
  const [alertMessage, setAlertMessage] = useState("");

  // ✅ Fetch issues (with fetch) and notifications (with axios) on mount
  useEffect(() => {
    //Fetch issues from /api/issues/mine
    fetch("/api/issues/mine")
      .then((res) => res.json())
      .then((data) => {
        //Ensure data is an array to prevent .map() errors
        setIssues(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error("Error fetching issues:", err);
        setIssues([]);
      });

      //Fetch notifications with axios
    axios.get("/api/notifications")
      .then((res) => {
        setIssues(Array.isArray(res.data) ? res.data : []);
      })
      .catch((err) => {
        console.error("Error fetching issues:", err);
        setIssues([]);
      });

    axios.get("/api/notifications")
      .then((res) => {
        setNotifications(Array.isArray(res.data) ? res.data : []);
      })
      .catch((err) => {
        console.error("Error fetching notifications:", err);
        setNotifications([]);
      });
  }, []);

  // ✅ Check for overdue issues
  useEffect(() => {
    const now = new Date();
    const overdue = issues.filter(
      (issue) =>
        new Date(issue.created_at) < now - 7 * 24 * 60 * 60 * 1000 &&
        issue.status !== "resolved"
    );
    setAlertMessage(
      overdue.length > 0 ? "Some issues are overdue or unresolved." : ""
    );
  }, [issues]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post("/api/issues", formData)
      .then((res) => {
        setIssues([...issues, res.data]);
        setFormData({ courseCode: "", issueType: "missing marks", description: "" });
      })
      .catch((err) => console.error(err));
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h1>Student Issue Tracking</h1>
      {alertMessage && <div style={{ color: "red", marginBottom: "1rem" }}>{alertMessage}</div>}

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
          <select name="issueType" value={formData.issueType} onChange={handleChange}>
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
        <button type="submit">Submit Issue</button>
      </form>

      <h2>Your Issues</h2>
      {issues.length > 0 ? (
        <ul>
          {issues.map((issue) => (
            <li key={issue.id}>
              <strong>{issue.courseCode}</strong> - {issue.issueType} - {issue.status}
              <p>{issue.description}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No issues found.</p>
      )}

      <hr />

      <h2>Notifications</h2>
      {notifications.length > 0 ? (
        <ul>
          {notifications.map((note, idx) => (
            <li key={idx}>
              {note.message} (Status: {note.statusChange})
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
