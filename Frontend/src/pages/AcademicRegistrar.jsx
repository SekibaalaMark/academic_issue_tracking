import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AcademicRegistrar.css"; // Import the separate CSS file

const AcademicRegistrar = () => {
  const [issues, setIssues] = useState([]);
  const [lecturers, setLecturers] = useState([]);
  const [filterType, setFilterType] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterLecturer, setFilterLecturer] = useState("");

  // Fetch all issues
  useEffect(() => {
    axios
      .get("http://localhost:5000/issues")
      .then((res) => setIssues(Array.isArray(res.data) ? res.data : []))
      .catch((err) => console.error("Error fetching issues:", err));

    // Fetch lecturers
    axios
      .get("http://localhost:5000/lecturers")
      .then((res) => setLecturers(Array.isArray(res.data) ? res.data : []))
      .catch((err) => console.error("Error fetching lecturers:", err));
  }, []);

  // Filter issues based on user input
  const filteredIssues = issues.filter((issue) => {
    const matchType = filterType ? issue.issueType === filterType : true;
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
      .patch(`/api/issues/${issueId}/assign`, { assigned_to: lecturerId })
      .then(() => {
        setIssues((prevIssues) =>
          prevIssues.map((issue) =>
            issue.id === issueId
              ? { ...issue, assignedLecturer: lecturers.find((l) => l.id === lecturerId)?.name }
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
        .patch(`/api/issues/${issueId}/resolve`, { status: "resolved" })
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

  return (
    <div className="academic-registrar-container">
      <h1>Academic Registrar Dashboard</h1>

      {/* Filters */}
      <div className="filter-container">
        <label>
          Filter by Issue Category:
          <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
            <option value="">All</option>
            <option value="missing marks">Missing Marks</option>
            <option value="wrong marks">wrong marks</option>
            <option value="wrong grading">wrong grading</option>
            <option value="other">other</option>
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
          {filteredIssues.length > 0 ? (
            filteredIssues.map((issue) => (
              <tr key={issue.id}>
                <td>{issue.id}</td>
                <td>{issue.courseCode}</td>
                <td>{issue.issueCategory}</td>
                <td>{issue.description}</td>
                <td>{issue.status}</td>
                <td>{issue.assignedLecturer || "Not Assigned"}</td>
                <td>
                  <select onChange={(e) => handleAssign(issue.id, e.target.value)}>
                    <option value="">Select Lecturer</option>
                    {lecturers.map((lecturer) => (
                      <option key={lecturer.id} value={lecturer.id}>
                        {lecturer.name}
                      </option>
                    ))}
                  </select>
                  {issue.status !== "resolved" && (
                    <button className="resolve-btn" onClick={() => handleResolve(issue.id)}>
                      Resolve
                    </button>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7">No issues found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AcademicRegistrar;
