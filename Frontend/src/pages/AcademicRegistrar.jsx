// src/pages/AcademicRegistrar.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AcademicRegistrar.css";

// Define API endpoints (adjust as needed)
const ENDPOINTS = {
  issues: "http://127.0.0.1:8000/api/registrar-issues-management/",
  lecturers: "http://127.0.0.1:8000/api/lecturers/",
};

const AcademicRegistrar = () => {
  const [issues, setIssues] = useState([]);
  const [lecturers, setLecturers] = useState([]);
  const [filterType, setFilterType] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterLecturer, setFilterLecturer] = useState("");
  const [selectedTab, setSelectedTab] = useState("home"); // "home" or "management"
  const authToken = localStorage.getItem("authToken");
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch registrar issues
    axios
      .get(ENDPOINTS.issues, {
        headers: { Authorization: `Token ${authToken}` },
      })
      .then((res) => setIssues(Array.isArray(res.data) ? res.data : []))
      .catch((err) => console.error("Error fetching issues:", err));

    // Fetch lecturers
    axios
      .get(ENDPOINTS.lecturers, {
        headers: { Authorization: `Token ${authToken}` },
      })
      .then((res) => setLecturers(Array.isArray(res.data) ? res.data : []))
      .catch((err) => console.error("Error fetching lecturers:", err));
  }, [authToken]);

  // Calculate summary counts
  const totalIssues = issues.length;
  const pendingIssues = issues.filter((issue) => issue.status === "pending").length;
  const inProgressIssues = issues.filter((issue) => issue.status === "in progress").length;
  const resolvedIssues = issues.filter((issue) => issue.status === "resolved").length;

  // Filter issues for management view
  const filteredIssues = issues.filter((issue) => {
    const matchType = filterType ? issue.issueCategory === filterType : true;
    const matchStatus = filterStatus ? issue.status === filterStatus : true;
    const matchLecturer = filterLecturer
      ? issue.assignedLecturer &&
        issue.assignedLecturer.toLowerCase().includes(filterLecturer.toLowerCase())
      : true;
    return matchType && matchStatus && matchLecturer;
  });

  // Assign an issue to a lecturer
  const handleAssign = (issueId, lecturerId) => {
    axios
      .patch(
        `${ENDPOINTS.issues}${issueId}/assign`,
        { assigned_to: lecturerId },
        { headers: { Authorization: `Token ${authToken}` } }
      )
      .then(() => {
        setIssues((prevIssues) =>
          prevIssues.map((issue) =>
            issue.id === issueId
              ? {
                  ...issue,
                  assignedLecturer: lecturers.find((l) => l.id === lecturerId)?.name,
                }
              : issue
          )
        );
        alert("Issue assigned successfully!");
      })
      .catch((err) => alert("Error assigning issue."));
  };

  // Resolve an issue
  const handleResolve = (issueId) => {
    if (window.confirm("Are you sure you want to mark this issue as resolved?")) {
      axios
        .patch(
          `${ENDPOINTS.issues}${issueId}/resolve`,
          { status: "resolved" },
          { headers: { Authorization: `Token ${authToken}` } }
        )
        .then(() => {
          setIssues((prevIssues) =>
            prevIssues.map((issue) =>
              issue.id === issueId ? { ...issue, status: "resolved" } : issue
            )
          );
          alert("Issue marked as resolved.");
        })
        .catch(() => alert("Error resolving issue."));
    }
  };

  // Navigation in sidebar (e.g., Logout, Notifications, etc.)
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  return (
    <div className="academic-registrar-dashboard">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2 className="sidebar-title">Registrar Dashboard</h2>
        <ul className="sidebar-nav">
          <li
            className={selectedTab === "home" ? "active" : ""}
            onClick={() => setSelectedTab("home")}
          >
            Home
          </li>
          <li
            className={selectedTab === "management" ? "active" : ""}
            onClick={() => setSelectedTab("management")}
          >
            Issue Management
          </li>
          <li onClick={() => navigate("/notifications")}>Notifications</li>
          <li onClick={handleLogout}>Logout</li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <h1 className="page-title">Academic Registrar Dashboard</h1>

        {selectedTab === "home" && (
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
        )}

        {selectedTab === "management" && (
          <div className="management-section">
            {/* Filters */}
            <div className="filter-container">
              <label>
                Filter by Issue Category:
                <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                  <option value="">All</option>
                  <option value="Missing_Marks">Missing Marks</option>
                  <option value="wrong grading">Wrong Grading</option>
                  <option value="wrong marks">Wrong Marks</option>
                  <option value="other">Other</option>
                </select>
              </label>

              <label>
                Filter by Status:
                <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                  <option value="">All</option>
                  <option value="pending">Pending</option>
                  <option value="in progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                </select>
              </label>

              <label>
                Filter by Lecturer:
                <input
                  type="text"
                  value={filterLecturer}
                  onChange={(e) => setFilterLecturer(e.target.value)}
                  placeholder="Lecturer's name"
                />
              </label>
            </div>

            {/* Issues Table */}
            <div className="issues-table-container">
              <h2 className="section-title">Registrar Issue Management</h2>
              {filteredIssues.length === 0 ? (
                <p>No issues found.</p>
              ) : (
                <table className="issues-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Course Code</th>
                      <th>Issue Category</th>
                      <th>Description</th>
                      <th>Status</th>
                      <th>Assigned Lecturer</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredIssues.map((issue) => (
                      <tr key={issue.id}>
                        <td>{issue.id}</td>
                        <td>{issue.courseCode}</td>
                        <td>{issue.issueCategory}</td>
                        <td>{issue.description}</td>
                        <td>{issue.status}</td>
                        <td>{issue.assignedLecturer || "Not Assigned"}</td>
                        <td>
                          <select
                            onChange={(e) =>
                              handleAssign(issue.id, e.target.value)
                            }
                          >
                            <option value="">Select Lecturer</option>
                            {lecturers.map((lecturer) => (
                              <option key={lecturer.id} value={lecturer.id}>
                                {lecturer.name}
                              </option>
                            ))}
                          </select>
                          {issue.status !== "resolved" && (
                            <button
                              className="resolve-btn"
                              onClick={() => handleResolve(issue.id)}
                            >
                              Resolve
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AcademicRegistrar;
