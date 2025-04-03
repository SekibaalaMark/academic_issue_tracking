// src/pages/Students.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Students.css";

// Define API endpoints
const ENDPOINTS = {
  departments: "http://127.0.0.1:8000/api/departments/",
  studentIssues: "http://127.0.0.1:8000/api/student-issues/",
  raiseIssue: "http://127.0.0.1:8000/api/raise-issue/"
};

const Students = () => {
  const [departments, setDepartments] = useState([]);
  const [issues, setIssues] = useState([]);
  const [formData, setFormData] = useState({
    course_name: "",
    course_code: "",
    year_of_study: "year_1",
    category: "Missing_Marks",
    description: "",
    department: "",
    attachment: null,
  });
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const authToken = localStorage.getItem("authToken");
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch departments
    axios
      .get(ENDPOINTS.departments, {
        headers: { Authorization: `Token ${authToken}` },
      })
      .then((res) => {
        setDepartments(res.data);
        if (res.data.length > 0) {
          setFormData((prev) => ({ ...prev, department: res.data[0].id }));
        }
      })
      .catch((err) =>
        console.error("Error fetching departments:", err)
      );

    // Fetch student issues
    axios
      .get(ENDPOINTS.studentIssues, {
        headers: { Authorization: `Token ${authToken}` },
      })
      .then((res) => setIssues(res.data))
      .catch((err) =>
        console.error("Error fetching issues:", err)
      );
  }, [authToken]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    const data = new FormData();
    data.append("course_name", formData.course_name);
    data.append("course_code", formData.course_code);
    data.append("year_of_study", formData.year_of_study);
    data.append("category", formData.category);
    data.append("description", formData.description);
    data.append("department", formData.department);
    if (formData.attachment) {
      data.append("attachment", formData.attachment);
    }
    axios
      .post(ENDPOINTS.raiseIssue, data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Token ${authToken}`,
        },
      })
      .then((res) => {
        setSuccessMsg("Issue raised successfully.");
        // Refresh issues list after successful submission
        axios
          .get(ENDPOINTS.studentIssues, {
            headers: { Authorization: `Token ${authToken}` },
          })
          .then((res) => setIssues(res.data))
          .catch((err) =>
            console.error("Error refreshing issues:", err)
          );
        // Reset form fields (except department)
        setFormData((prev) => ({
          ...prev,
          course_name: "",
          course_code: "",
          year_of_study: "year_1",
          category: "Missing_Marks",
          description: "",
          attachment: null,
        }));
      })
      .catch((err) => {
        setError("Failed to raise issue.");
        console.error("Error submitting issue:", err);
      });
  };

  const handleViewDetails = (issueId) => {
    navigate(`/issue-details/${issueId}`);
  };

  // Calculate issue statistics
  const totalIssues = issues.length;
  const pendingIssues = issues.filter((issue) => issue.status === "pending").length;
  const inProgressIssues = issues.filter((issue) => issue.status === "in_progress").length;
  const resolvedIssues = issues.filter((issue) => issue.status === "resolved").length;

  return (
    <div className="student-dashboard">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2 className="sidebar-title">Student Dashboard</h2>
        <ul className="sidebar-nav">
          <li onClick={() => navigate("/")}>Home</li>
          <li onClick={() => navigate("#issue-form")}>Submit Issue</li>
          <li onClick={() => navigate("/notifications")}>Notifications</li>
          <li onClick={() => navigate("/login")}>Logout</li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <h1 className="page-title">My Issues</h1>

        {/* Dashboard Summary */}
        <div className="dashboard-summary">
          <div className="summary-item">
            <span className="summary-label">Total Issues:</span>
            <span className="summary-value">{totalIssues}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Pending:</span>
            <span className="summary-value">{pendingIssues}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">In Progress:</span>
            <span className="summary-value">{inProgressIssues}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Resolved:</span>
            <span className="summary-value">{resolvedIssues}</span>
          </div>
        </div>

        {/* Issue Submission Form */}
        <div className="issue-form" id="issue-form">
          <div className="section-title">Raise a New Issue</div>
          {error && <div className="error-message">{error}</div>}
          {successMsg && <div className="success-message">{successMsg}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="course_name">Course Name</label>
              <input
                type="text"
                id="course_name"
                name="course_name"
                value={formData.course_name}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="course_code">Course Code</label>
              <input
                type="text"
                id="course_code"
                name="course_code"
                value={formData.course_code}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="year_of_study">Year of Study</label>
              <select
                id="year_of_study"
                name="year_of_study"
                value={formData.year_of_study}
                onChange={handleChange}
              >
                <option value="year_1">Year 1</option>
                <option value="year_2">Year 2</option>
                <option value="year_3">Year 3</option>
                <option value="year_4">Year 4</option>
                <option value="year_5">Year 5</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="category">Issue Category</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
              >
                <option value="Missing_Marks">Missing Marks</option>
                <option value="wrong grading">wrong grading</option>
                <option value="wrong marks">wrong marks</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="department">Department</label>
              <select
                id="department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                required
              >
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="attachment">Attachment</label>
              <input
                type="file"
                id="attachment"
                name="attachment"
                onChange={handleChange}
              />
            </div>
            <button type="submit" className="btn-submit">
              Submit Issue
            </button>
          </form>
        </div>

        {/* Issues Table */}
        <div className="issues-table-container">
          <h2 className="section-title">My Logged Issues</h2>
          {issues.length === 0 ? (
            <p>No issues logged yet.</p>
          ) : (
            <table className="issues-table">
              <thead>
                <tr>
                  <th>Course Code</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Created At</th>
                </tr>
              </thead>
              <tbody>
                {issues.map((issue) => (
                  <tr key={issue.id}>
                    <td>{issue.course_code}</td>
                    <td>{issue.category}</td>
                    <td>{issue.status}</td>
                    <td>{new Date(issue.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
};

export default Students;
