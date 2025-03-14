import React,{useState,useEffect} from "react";
import axios from 'axios';
import styled from "styled-components"

const Students = () => {
  const [issues, setIssues] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [formData, setFormData] = useState({
    courseCode:"",
    issueType:"missing marks",
    description:"",
  })
  const [alertMessage, setAlertMessage] = useState("");

  // Fetch issues and notifications on mount
  useEffect(() => {
    axios
      .get("/api/issues?role=student")
      .then((res) => setIssues(res.data))
      .catch((err) => console.error(err));
    axios
      .get("/api/notifications")
      .then((res) => setNotifications(res.data))
      .catch((err) => console.error(err));
  }, []);

  // Check for overdue or unresolved issues (simulate 7 days threshold)
  useEffect(() => {
    const now = new Date();
    const overdue = issues.filter((issue) => {
      const createdAt = new Date(issue.created_at);
      return now - createdAt > 7 * 24 * 60 * 60 * 1000 && issue.status !== "resolved";
    });
    setAlertMessage(overdue.length > 0 ? "Some issues are overdue or unresolved." : "");
  }, [issues]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("/api/issues", formData)
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
          <input
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
      <ul>
        {issues.map((issue) => (
          <li key={issue.id}>
            <strong>{issue.courseCode}</strong> - {issue.issueType} - {issue.status}
            <p>{issue.description}</p>
          </li>
        ))}
      </ul>
      <hr />
      <h2>Notifications</h2>
      <ul>
        {notifications.map((note, idx) => (
          <li key={idx}>
            {note.message} (Status: {note.statusChange})
          </li>
        ))}
      </ul>
    </div>
  );
};



export default Students;
