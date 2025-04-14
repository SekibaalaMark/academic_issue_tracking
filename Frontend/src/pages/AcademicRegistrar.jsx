import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/authContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import "./AcademicRegistrar.css";

// API Endpoints
const ENDPOINTS = {
  issues:
    "https://academic-6ea365e4b745.herokuapp.com/api/registrar-issues-management/",
  lecturers: "https://academic-6ea365e4b745.herokuapp.com/api/lecturers/",
  users: "https://academic-6ea365e4b745.herokuapp.com/api/users/",
};

// Styled Components
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const createAuthAxios = () => {
    const token =
      localStorage.getItem("accessToken") || localStorage.getItem("authToken");
    return axios.create({
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };

  useEffect(() => {
    console.log("AcademicRegistrar component mounted");

    const checkAuthAndRedirect = () => {
      const token =
        localStorage.getItem("accessToken") ||
        localStorage.getItem("authToken");
      const userRole = localStorage.getItem("userRole");
      const isAuthenticated = localStorage.getItem("isAuthenticated");

      if (!token || !isAuthenticated) {
        console.log("Not authenticated, redirecting to login");
        navigate("/login");
        return false;
      }

      if (
        userRole &&
        userRole !== "academic_registrar" &&
        userRole !== "registrar" &&
        userRole !== "academicregistrar"
      ) {
        console.log(
          "User is not a registrar, redirecting based on role:",
          userRole
        );
        if (userRole === "student") {
          navigate("/students");
        } else if (userRole === "lecturer") {
          navigate("/lecturers");
        } else {
          navigate("/dashboard");
        }
        return false;
      }
      return true;
    };

    const fetchData = async () => {
      if (!checkAuthAndRedirect()) {
        return;
      }

      const authAxios = createAuthAxios();
      try {
        console.log("Fetching registrar issues");
        const issuesResponse = await authAxios.get(ENDPOINTS.issues);
        setIssues(
          Array.isArray(issuesResponse.data) ? issuesResponse.data : []
        );

        try {
          console.log("Fetching lecturers");
          const lecturersResponse = await authAxios.get(
            `${ENDPOINTS.users}?role=lecturer`
          );
          const formattedLecturers = lecturersResponse.data.map((lecturer) => ({
            id: lecturer.id,
            name: `${lecturer.first_name} ${lecturer.last_name}`,
          }));
          setLecturers(formattedLecturers);
        } catch (lecturerErr) {
          console.error("Error fetching lecturers:", lecturerErr);
          try {
            const alternativeLecturersResponse = await authAxios.get(
              ENDPOINTS.lecturers
            );
            setLecturers(
              Array.isArray(alternativeLecturersResponse.data)
                ? alternativeLecturersResponse.data
                : []
            );
          } catch (altErr) {
            console.error("Error fetching from alternative endpoint:", altErr);
            setLecturers([]);
          }
        }
        setLoading(false);
      } catch (err) {
        console.error("Error in AcademicRegistrar:", err);
        if (err.response?.status === 401) {
          console.log("Unauthorized access, logging out");
          handleLogout();
        } else {
          setError(`Failed to load data: ${err.message || "Unknown error"}`);
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [navigate]);

  // Calculate summary counts
  const totalIssues = issues.length;
  const pendingIssues = issues.filter(
    (issue) => issue.status === "pending"
  ).length;
  const inProgressIssues = issues.filter(
    (issue) => issue.status === "in progress"
  ).length;
  const resolvedIssues = issues.filter(
    (issue) => issue.status === "resolved"
  ).length;

  // Filter issues for management view
  const filteredIssues = issues.filter((issue) => {
    const matchType = filterType ? issue.issueCategory === filterType : true;
    const matchStatus = filterStatus ? issue.status === filterStatus : true;
    const matchLecturer = filterLecturer
      ? issue.assignedLecturer &&
        issue.assignedLecturer
          .toLowerCase()
          .includes(filterLecturer.toLowerCase())
      : true;
    return matchType && matchStatus && matchLecturer;
  });

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentIssues = filteredIssues.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredIssues.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleAssign = async (issueId, lecturerId) => {
    if (!lecturerId) return;
    try {
      const authAxios = createAuthAxios();
      console.log(`Assigning issue ${issueId} to lecturer ${lecturerId}`);
      const response = await authAxios.patch(
        `${ENDPOINTS.issues}${issueId}/assign`,
        { assigned_to: lecturerId }
      );
      setIssues((prevIssues) =>
        prevIssues.map((issue) =>
          issue.id === issueId
            ? {
                ...issue,
                assignedLecturer: lecturers.find((l) => l.id === lecturerId)
                  ?.name,
                status: "in progress",
              }
            : issue
        )
      );
      alert("Issue assigned successfully!");
    } catch (err) {
      console.error("Error assigning issue:", err);
      alert(
        "Error assigning issue: " + (err.response?.data?.message || err.message)
      );
    }
  };

  const handleResolve = async (issueId) => {
    if (
      window.confirm("Are you sure you want to mark this issue as resolved?")
    ) {
      try {
        const authAxios = createAuthAxios();
        console.log(`Resolving issue ${issueId}`);
        const response = await authAxios.patch(
          `${ENDPOINTS.issues}${issueId}/resolve`,
          { status: "resolved" }
        );
        setIssues((prevIssues) =>
          prevIssues.map((issue) =>
            issue.id === issueId ? { ...issue, status: "resolved" } : issue
          )
        );
        alert("Issue marked as resolved.");
      } catch (err) {
        console.error("Error resolving issue:", err);
        alert(
          "Error resolving issue: " +
            (err.response?.data?.message || err.message)
        );
      }
    }
  };

  const handleLogout = () => {
    console.log("Logging out");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("authToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userRole");
    localStorage.removeItem("username");
    if (logout) {
      logout();
    }
    navigate("/login");
  };

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading Academic Registrar Dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Error</h2>
        <p>{error}</p>
        <div style={{ marginTop: "20px" }}>
          <Button onClick={handleRetry} style={{ marginRight: "10px" }}>
            Retry
          </Button>
          <Button onClick={handleLogout}>Logout</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="academic-registrar-dashboard">
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
          <li onClick={handleLogout}>Logout</li>
        </ul>
      </aside>

      <main className="main-content">
        <h1 className="page-title">Academic Registrar Dashboard</h1>
        <div className="user-welcome">
          <p>
            Welcome, {localStorage.getItem("username") || "Academic Registrar"}
          </p>
        </div>

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
            <div className="filter-container">
              <label>
                Filter by Issue Category:
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                >
                  <option value="">All</option>
                  <option value="Missing_Marks">Missing Marks</option>
                  <option value="wrong grading">Wrong Grading</option>
                  <option value="wrong marks">Wrong Marks</option>
                  <option value="other">Other</option>
                </select>
              </label>
              <label>
                Filter by Status:
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
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

            <div className="issues-table-container">
              <h2 className="section-title">Registrar Issue Management</h2>
              {currentIssues.length === 0 ? (
                <p>No issues found.</p>
              ) : (
                <>
                  <Table>
                    <thead>
                      <Tr>
                        <Th>ID</Th>
                        <Th>Course Code</Th>
                        <Th>Issue Category</Th>
                        <Th>Description</Th>
                        <Th>Status</Th>
                        <Th>Assigned Lecturer</Th>
                        <Th>Actions</Th>
                      </Tr>
                    </thead>
                    <tbody>
                      {currentIssues.map((issue) => (
                        <Tr key={issue.id}>
                          <Td>{issue.id}</Td>
                          <Td>{issue.courseCode}</Td>
                          <Td>{issue.issueCategory}</Td>
                          <Td>{issue.description}</Td>
                          <Td>{issue.status}</Td>
                          <Td>{issue.assignedLecturer || "Not Assigned"}</Td>
                          <Td>
                            <select
                              onChange={(e) =>
                                handleAssign(issue.id, e.target.value)
                              }
                              value=""
                            >
                              <option value="">Select Lecturer</option>
                              {lecturers.map((lecturer) => (
                                <option key={lecturer.id} value={lecturer.id}>
                                  {lecturer.name}
                                </option>
                              ))}
                            </select>
                            {issue.status !== "resolved" && (
                              <Button onClick={() => handleResolve(issue.id)}>
                                Resolve
                              </Button>
                            )}
                          </Td>
                        </Tr>
                      ))}
                    </tbody>
                  </Table>
                  <Pagination>
                    <PageButton
                      onClick={() => paginate(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </PageButton>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <PageButton
                          key={page}
                          onClick={() => paginate(page)}
                          style={{
                            backgroundColor:
                              currentPage === page ? "#007bff" : "#f2f2f2",
                            color: currentPage === page ? "white" : "black",
                          }}
                        >
                          {page}
                        </PageButton>
                      )
                    )}
                    <PageButton
                      onClick={() => paginate(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </PageButton>
                  </Pagination>
                </>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AcademicRegistrar;
