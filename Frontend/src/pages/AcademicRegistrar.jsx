import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";

// Styled components for the table and controls
const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
`;

const Th = styled.th`
  border: 1px solid #ddd;
  padding: 8px;
  background-color: #f2f2f2;
`;

const Td = styled.td`
  border: 1px solid #ddd;
  padding: 8px;
  text-align: center;
`;

const FilterContainer = styled.div`
  margin-top: 1rem;
`;

const Button = styled.button`
  margin: 0 0.5px;
  padding: 5px 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 3px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

function AcademicRegistrar() {
  const [issues, setIssues] = useState([]);
  const [lecturers, setLecturers] = useState([]);
  const [filterType, setFilterType] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterLecturer, setFilterLecturer] = useState("");

  // Fetch all issues
  useEffect(() => {
    axios
      .get("http://localhost:5000/issues")
      .then((res) => {
        setIssues(Array.isArray(res.data) ? res.data : []);
      })
      .catch((err) => {
        console.error("Error fetching issues:", err);
        setIssues([]);
      });

    // Fetch lecturers
    axios
      .get("http://localhost:5000/lecturers")
      .then((res) => {
        setLecturers(Array.isArray(res.data) ? res.data : []);
      })
      .catch((err) => {
        console.error("Error fetching lecturers:", err);
        setLecturers([]);
      });
  }, []);

  // Compute filtered issues
  const filteredIssues = issues.filter((issue) => {
    const matchType = filterType ? issue.issueType === filterType : true;
    const matchStatus = filterStatus ? issue.status === filterStatus : true;
    const matchLecturer = filterLecturer
      ? issue.assignedLecturer &&
        issue.assignedLecturer.toLowerCase().includes(filterLecturer.toLowerCase())
      : true;
    return matchType && matchStatus && matchLecturer;
  });

  // Handle assigning an issue to a lecturer
  const handleAssign = (issueId, lecturerId) => {
    axios
      .patch(`/api/issues/${issueId}/assign`, { assigned_to: lecturerId })
      .then((res) => {
        setIssues((prevIssues) =>
          prevIssues.map((issue) =>
            issue.id === issueId
              ? { ...issue, assignedLecturer: lecturers.find((l) => l.id === lecturerId)?.name }
              : issue
          )
        );
        alert("Issue assigned successfully!");
      })
      .catch((err) => {
        console.error("Error assigning issue:", err);
        alert("Error assigning issue.");
      });
  };

  // Handle resolving an issue
  const handleResolve = (issueId) => {
    if (window.confirm("Are you sure you want to mark this issue as resolved?")) {
      axios
        .patch(`/api/issues/${issueId}/resolve`, { status: "resolved" })
        .then((res) => {
          setIssues((prevIssues) =>
            prevIssues.map((issue) =>
              issue.id === issueId ? { ...issue, status: "resolved" } : issue
            )
          );
          alert("Issue marked as resolved.");
        })
        .catch((err) => {
          console.error("Error resolving issue:", err);
          alert("Error resolving issue.");
        });
    }
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h1>Academic Registrar Dashboard</h1>

      {/* Filtering Controls */}
      <FilterContainer>
        <label>
          Filter by Issue Type:&nbsp;
          <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
            <option value="">All</option>
            <option value="missing marks">Missing Marks</option>
            <option value="appeals">Appeals</option>
            <option value="corrections">Corrections</option>
          </select>
        </label>
        <label style={{ marginLeft: "1rem" }}>
          Filter by Status:&nbsp;
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="">All</option>
            <option value="pending">Pending</option>
            <option value="in progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>
        </label>
        <label style={{ marginLeft: "1rem" }}>
          Filter by Assigned Lecturer:&nbsp;
          <input
            type="text"
            value={filterLecturer}
            onChange={(e) => setFilterLecturer(e.target.value)}
            placeholder="Lecturer's name"
          />
        </label>
      </FilterContainer>

      {/* Issues Table */}
      <Table>
        <thead>
          <tr>
            <Th>ID</Th>
            <Th>Course Code</Th>
            <Th>Issue Type</Th>
            <Th>Description</Th>
            <Th>Status</Th>
            <Th>Assigned Lecturer</Th>
            <Th>Actions</Th>
          </tr>
        </thead>
        <tbody>
          {filteredIssues.length > 0 ? (
            filteredIssues.map((issue) => (
              <tr key={issue.id}>
                <Td>{issue.id}</Td>
                <Td>{issue.courseCode}</Td>
                <Td>{issue.issueType}</Td>
                <Td>{issue.description}</Td>
                <Td>{issue.status}</Td>
                <Td>{issue.assignedLecturer || "Not Assigned"}</Td>
                <Td>
                  <select onChange={(e) => handleAssign(issue.id, e.target.value)}>
                    <option value="">Select Lecturer</option>
                    {lecturers.map((lecturer) => (
                      <option key={lecturer.id} value={lecturer.id}>
                        {lecturer.name}
                      </option>
                    ))}
                  </select>
                  {issue.status !== "resolved" && (
                    <Button onClick={() => handleResolve(issue.id)}>Resolve</Button>
                  )}
                </Td>
              </tr>
            ))
          ) : (
            <tr>
              <Td colSpan="7">No issues found.</Td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
}

export default AcademicRegistrar;
