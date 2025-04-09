import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styled from "styled-components"; // from donatah branch
import "./AcademicRegistrar.css";

const ENDPOINTS = {
  issues: "https://academic-6ea365e4b745.herokuapp.com/api/registrar-issues-management/",
  lecturers: "https://academic-6ea365e4b745.herokuapp.com/api/lecturers/",
};

// Styled Components from donatah
const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
  table-layout: fixed;
  overflow-x: auto;
`;

const Th = styled.th`
  border: 1px solid #ddd;
  padding: 8px;
  background-color: rgb(248, 197, 197);
`;

const Td = styled.td`
  border: 1px solid #ddd;
  padding: 8px;
  text-align: center;
`;

const Tr = styled.tr`
  &:hover {
    background-color: #f9f9f9;
  }
`;

const Pagination = styled.div`
  margin-top: 1rem;
  display: flex;
  justify-content: center;
  gap: 10px;
`;

const PageButton = styled.button`
  padding: 5px 10px;
  border: 1px solid #ddd;
  background-color: #f2f2f2;
  border-radius: 3px;
  cursor: pointer;

  &:hover {
    background-color: #ddd;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

const Button = styled.button`
  margin: 0 0.5px;
  padding: 6px 12px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

const AcademicRegistrar = () => {
  const [issues, setIssues] = useState([]);
  const [lecturers, setLecturers] = useState([]);
  const [filterType, setFilterType] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterLecturer, setFilterLecturer] = useState("");
  const [selectedTab, setSelectedTab] = useState("home");

  const authToken = localStorage.getItem("authToken");
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  useEffect(() => {
    axios
      .get(ENDPOINTS.issues, {
        headers: { Authorization: `Token ${authToken}` },
      })
      .then((res) => setIssues(Array.isArray(res.data) ? res.data : []))
      .catch((err) => console.error("Error fetching issues:", err));

    axios
      .get(ENDPOINTS.lecturers, {
        headers: { Authorization: `Token ${authToken}` },
      })
      .then((res) => setLecturers(Array.isArray(res.data) ? res.data : []))
      .catch((err) => console.error("Error fetching lecturers:", err));
  }, [authToken]);

  const totalIssues = issues.length;
  const pendingIssues = issues.filter((i) => i.status === "pending").length;
  const inProgressIssues = issues.filter((i) => i.status === "in progress").length;
  const resolvedIssues = issues.filter((i) => i.status === "resolved").length;

  const filteredIssues = issues.filter((issue) => {
    const matchType = filterType ? issue.issueCategory === filterType : true;
    const matchStatus = filterStatus ? issue.status === filterStatus : true;
    const matchLecturer = filterLecturer
      ? issue.assignedLecturer?.toLowerCase().includes(filterLecturer.trim().toLowerCase())
      : true;
    return matchType && matchStatus && matchLecturer;
  });

  const indexOfLastIssue = currentPage * itemsPerPage;
  const indexOfFirstIssue = indexOfLastIssue - itemsPerPage;
  const currentIssues = filteredIssues.slice(indexOfFirstIssue, indexOfLastIssue);

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
      .catch(() => alert("Error assigning issue."));
  };

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

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  return (
    <div className="academic-registrar-dashboard">
      <aside className="sidebar">
        <h2 className="sidebar-title">Registrar Dashboard</h2>
        <ul className="sidebar-nav">
          <li className={selectedTab === "home" ? "active" : ""} onClick={() => setSelectedTab("home")}>Home</li>
          <li className={selectedTab === "management" ? "active" : ""} onClick={() => setSelectedTab("management")}>Issue Management</li>
          <li onClick={handleLogout}>Logout</li>
        </ul>
      </aside>

      <main className="main-content">
        <h1 className="page-title">Academic Registrar Dashboard</h1>

        {selectedTab === "home" && (
          <div className="dashboard-summary">
            <div className="summary-item"><span>Total Issues:</span> <span>{totalIssues}</span></div>
            <div className="summary-item"><span>Pending:</span> <span>{pendingIssues}</span></div>
            <div className="summary-item"><span>In Progress:</span> <span>{inProgressIssues}</span></div>
            <div className="summary-item"><span>Resolved:</span> <span>{resolvedIssues}</span></div>
          </div>
        )}

        {selectedTab === "management" && (
          <>
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

            <Table>
              <thead>
                <tr>
                  <Th>ID</Th>
                  <Th>Course Code</Th>
                  <Th>Issue Category</Th>
                  <Th>Description</Th>
                  <Th>Status</Th>
                  <Th>Assigned Lecturer</Th>
                  <Th>Actions</Th>
                </tr>
              </thead>
              <tbody>
                {currentIssues.length > 0 ? (
                  currentIssues.map((issue) => (
                    <Tr key={issue.id}>
                      <Td>{issue.id}</Td>
                      <Td>{issue.courseCode}</Td>
                      <Td>{issue.issueCategory}</Td>
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
                    </Tr>
                  ))
                ) : (
                  <tr><Td colSpan="7">No issues found.</Td></tr>
                )}
              </tbody>
            </Table>

            <Pagination>
              <PageButton onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
                Previous
              </PageButton>
              <span>Page {currentPage}</span>
              <PageButton
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, Math.ceil(filteredIssues.length / itemsPerPage)))}
                disabled={currentPage === Math.ceil(filteredIssues.length / itemsPerPage)}
              >
                Next
              </PageButton>
            </Pagination>
          </>
        )}
      </main>
    </div>
  );
};

export default AcademicRegistrar;
