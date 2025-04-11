import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { AuthContext } from "@/context/authContext";

// import { UserContext } from "../context/UserContext"; // Adjust the import path as necessary

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
  const [selectedTab, setSelectedTab] = useState("coverPage");
  const { user, logout } = useContext(UserContext); // Adjust the import path as necessary


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

  /* const totalIssues = issues.length;
  const pendingIssues = issues.filter((i) => i.status === "pending").length;
  const inProgressIssues = issues.filter((i) => i.status === "in progress").length;
  const resolvedIssues = issues.filter((i) => i.status === "resolved").length;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); */

  // Create axios instance with authentication
  const createAuthAxios = () => {
    const token = localStorage.getItem("accessToken");
    return axios.create({
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };

  // Check authentication and fetch data
  useEffect(() => {
    console.log("AcademicRegistrar component mounted");

    const checkAuthAndRedirect = () => {
      const token = localStorage.getItem("accessToken");
      const userRole = localStorage.getItem("userRole");
      const isAuthenticated = localStorage.getItem("isAuthenticated");

      if (!token || !isAuthenticated) {
        console.log("Not authenticated, redirecting to login");
        navigate("/login");
        return false;
      }

      // Check if user is actually a registrar
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
      // First check authentication and role
      if (!checkAuthAndRedirect()) {
        return;
      }

      const authAxios = createAuthAxios();

      try {
        // Fetch registrar issues
        console.log("Fetching registrar issues");
        const issuesResponse = await authAxios.get(ENDPOINTS.issues);
        console.log("Issues response:", issuesResponse.data);
        setIssues(
          Array.isArray(issuesResponse.data) ? issuesResponse.data : []
        );

        // Fetch lecturers from the users endpoint with role filter
        try {
          console.log("Fetching lecturers");
          const lecturersResponse = await authAxios.get(
            `${ENDPOINTS.users}?role=lecturer`
          );
          console.log("Lecturers response:", lecturersResponse.data);

          // Transform the data to match the expected format
          const formattedLecturers = lecturersResponse.data.map((lecturer) => ({
            id: lecturer.id,
            name: `${lecturer.first_name} ${lecturer.last_name}`,
          }));

          setLecturers(formattedLecturers);
        } catch (lecturerErr) {
          console.error("Error fetching lecturers:", lecturerErr);
          // Try alternative endpoint if the first one fails
          try {
            const alternativeLecturersResponse = await authAxios.get(
              ENDPOINTS.lecturers
            );
            console.log(
              "Alternative lecturers response:",
              alternativeLecturersResponse.data
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
        console.error("Response data:", err.response?.data);
        console.error("Response status:", err.response?.status);

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
  }, [navigate, logout, user]);

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


  // Assign an issue to a lecturer
  const handleAssign = async (issueId, lecturerId) => {
    if (!lecturerId) return; // Don't proceed if no lecturer is selected

    try {
      const authAxios = createAuthAxios();
      console.log(`Assigning issue ${issueId} to lecturer ${lecturerId}`);

      const response = await authAxios.patch(
        `${ENDPOINTS.issues}${issueId}/assign`,
        { assigned_to: lecturerId }
      );

      console.log("Assign response:", response.data);

      // Update the local state with the new assignment
      setIssues((prevIssues) =>
        prevIssues.map((issue) =>
          issue.id === issueId
            ? {
                ...issue,
                assignedLecturer: lecturers.find((l) => l.id === lecturerId)
                  ?.name,
                status: "in progress", // Update status if your API does this
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

  // Resolve an issue
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

        console.log("Resolve response:", response.data);

        // Update the local state with the resolved status
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

  // Handle logout
  const handleLogout = () => {
    console.log("Logging out");
    // Clear localStorage
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userRole");
    localStorage.removeItem("username");

    // Use context logout if available
    if (logout) {
      logout();
    }

    navigate("/login");
  };

  // Handle retry
  const handleRetry = () => {
    setLoading(true);
    setError(null);
    window.location.reload();
  };

  // Show loading state
  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading Academic Registrar Dashboard...</p>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="error-container">
        <h2>Error</h2>
        <p>{error}</p>
        <div style={{ marginTop: "20px" }}>
          <button onClick={handleRetry} style={{ marginRight: "10px" }}>
            Retry
          </button>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </div>
    );
  }

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

          <li onClick={handleLogout}>Logout</li>
        </ul>
      </aside>


      {/* Main Content */}
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
            {/* Filters */}
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
