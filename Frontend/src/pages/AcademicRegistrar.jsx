


import { useState, useEffect } from "react";
import axios from "axios"; // Import axios for API calls
import "./AcademicRegistrar.css";

function AcademicRegistrar() {
  // Base API URL - replace with your actual backend URL
  const API_BASE_URL = "http://127.0.0.1:8000";

  // State for issues and statistics
  const [issues, setIssues] = useState([]);
  const [lecturers, setLecturers] = useState([]);
  const [issueStats, setIssueStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0,
  });

  // UI state
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updateLoading, setUpdateLoading] = useState(false);

  // Configure axios with auth token
  const getAxiosConfig = () => {
    const token = localStorage.getItem("authToken");
    return {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };
  };

  // API Functions
  // Fetch all issues from the backend
  const fetchIssues = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/issues/`,
        getAxiosConfig()
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching issues:", error);
      throw error;
    }
  };

  // Fetch all lecturers from the backend
  const fetchLecturers = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/lecturers/`,
        getAxiosConfig()
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching lecturers:", error);
      throw error;
    }
  };

  // Update the status of an issue
  const updateIssueStatus = async (issueId, newStatus) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/issues/${issueId}/status/`,
        { status: newStatus },
        getAxiosConfig()
      );
      return response.data;
    } catch (error) {
      console.error("Error updating issue status:", error);
      throw error;
    }
  };

  // Assign a lecturer to an issue
  const assignIssueToLecturer = async (issueId, lecturerName) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/issues/${issueId}/assign/`,
        {
          assignedTo: lecturerName,
          status: "in-progress", // Automatically set to in-progress when assigned
        },
        getAxiosConfig()
      );
      return response.data;
    } catch (error) {
      console.error("Error assigning lecturer:", error);
      throw error;
    }
  };

  // Create a new issue (for students)
  const createIssue = async (issueData) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/issues/`,
        issueData,
        getAxiosConfig()
      );
      return response.data;
    } catch (error) {
      console.error("Error creating issue:", error);
      throw error;
    }
  };

  // For development/testing - use mock data if API is not available
  const useMockData = false; // Set to true to use mock data instead of API calls

  const getMockIssues = () => {
    return [
      {
        id: 1,
        studentName: "John Smith",
        subject: "Software Project",
        description: "Project submission deadline extension",
        status: "pending",
        assignedTo: "",
      },
      {
        id: 2,
        studentName: "Sarah Johnson",
        subject: "Mathematics",
        description: "Difficulty with calculus assignment",
        status: "pending",
        assignedTo: "",
      },
      {
        id: 3,
        studentName: "Michael Brown",
        subject: "Operating System",
        description: "Lab access for practical sessions",
        status: "in-progress",
        assignedTo: "Dr. Wilson",
      },
      {
        id: 4,
        studentName: "Emily Davis",
        subject: "System Analysis",
        description: "Clarification on project requirements",
        status: "in-progress",
        assignedTo: "Dr. Martinez",
      },
      {
        id: 5,
        studentName: "David Lee",
        subject: "Software Project",
        description: "Group project member issue",
        status: "resolved",
        assignedTo: "Dr. Thompson",
      },
      {
        id: 6,
        studentName: "Jessica Wilson",
        subject: "Mathematics",
        description: "Exam date confirmation",
        status: "resolved",
        assignedTo: "Dr. Garcia",
      },
    ];
  };

  const getMockLecturers = () => {
    return [
      { id: 1, name: "Dr. Wilson", department: "Computer Science" },
      { id: 2, name: "Dr. Martinez", department: "Mathematics" },
      { id: 3, name: "Dr. Thompson", department: "Software Engineering" },
      { id: 4, name: "Dr. Garcia", department: "Information Systems" },
    ];
  };

  // Check if user is authenticated
  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
    const userRole = localStorage.getItem("userRole");

    if (!isAuthenticated) {
      // Redirect to login page if not authenticated
      window.location.href = "/login";
    } else if (userRole !== "academicregistrar") {
      // Redirect to appropriate dashboard if not an academic registrar
      window.location.href = `/${userRole}academicregistrar`;
    }
  }, []);

  // Fetch initial data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);

        let issuesData, lecturersData;

        if (useMockData) {
          // Use mock data for development/testing
          issuesData = getMockIssues();
          lecturersData = getMockLecturers();
        } else {
          // Fetch real data from API
          issuesData = await fetchIssues();
          lecturersData = await fetchLecturers();
        }

        setIssues(issuesData);
        setLecturers(lecturersData);

        // Calculate statistics
        calculateStats(issuesData);

        setLoading(false);
      } catch (err) {
        setError("Failed to load data. Please try again later.");
        setLoading(false);
        console.error("Error loading data:", err);
      }
    };

    // Only load data if authenticated
    if (localStorage.getItem("isAuthenticated") === "true") {
      loadInitialData();
    }
  }, []);

  // Calculate statistics based on issues
  const calculateStats = (issuesData) => {
    const stats = {
      total: issuesData.length,
      pending: issuesData.filter((issue) => issue.status === "pending").length,
      inProgress: issuesData.filter((issue) => issue.status === "in-progress")
        .length,
      resolved: issuesData.filter((issue) => issue.status === "resolved")
        .length,
    };

    setIssueStats(stats);
  };

  // Handle assigning a lecturer to an issue
  const handleAssignLecturer = async (issueId, lecturerName) => {
    if (!lecturerName) return;

    try {
      setUpdateLoading(true);

      let updatedIssue;

      if (useMockData) {
        // Mock update for development/testing
        updatedIssue = {
          ...issues.find((issue) => issue.id === issueId),
          assignedTo: lecturerName,
          status: "in-progress",
        };
      } else {
        // Call API to assign lecturer
        updatedIssue = await assignIssueToLecturer(issueId, lecturerName);
      }

      // Update local state with the response
      const updatedIssues = issues.map((issue) =>
        issue.id === issueId ? updatedIssue : issue
      );

      setIssues(updatedIssues);
      calculateStats(updatedIssues);

      setUpdateLoading(false);
    } catch (err) {
      setError("Failed to assign lecturer. Please try again.");
      setUpdateLoading(false);
      console.error("Error assigning lecturer:", err);
    }
  };

  // Handle changing issue status
  const handleStatusChange = async (issueId, newStatus) => {
    try {
      setUpdateLoading(true);

      let updatedIssue;

      if (useMockData) {
        // Mock update for development/testing
        updatedIssue = {
          ...issues.find((issue) => issue.id === issueId),
          status: newStatus,
        };
      } else {
        // Call API to update status
        updatedIssue = await updateIssueStatus(issueId, newStatus);
      }

      // Update local state with the response
      const updatedIssues = issues.map((issue) =>
        issue.id === issueId ? updatedIssue : issue
      );

      setIssues(updatedIssues);
      calculateStats(updatedIssues);

      setUpdateLoading(false);
    } catch (err) {
      setError("Failed to update status. Please try again.");
      setUpdateLoading(false);
      console.error("Error updating status:", err);
    }
  };

  // Handle refreshing data
  const handleRefresh = async () => {
    try {
      setLoading(true);
      const issuesData = await fetchIssues();
      setIssues(issuesData);
      calculateStats(issuesData);
      setError(null);
      setLoading(false);
    } catch (err) {
      setError("Failed to refresh data. Please try again.");
      setLoading(false);
    }
  };

  // Filter issues based on selected status
  const filteredIssues =
    statusFilter === "all"
      ? issues
      : issues.filter((issue) => issue.status === statusFilter);

  // Show loading state
  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error && !issues.length) {
    return (
      <div className="dashboard-container">
        <div className="error-container">
          <p className="error-message">{error}</p>
          <button className="retry-button" onClick={handleRefresh}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {error && <div className="error-banner">{error}</div>}

      <h1 className="dashboard-title">Academic Registrar Dashboard</h1>

      {/* Main stats cards */}
      <div className="stats-grid">
        <div className="stat-card total-card">
          <div className="stat-header">
            <h3 className="stat-title">Total Issues</h3>
            <div className="stat-value">{issueStats.total}</div>
          </div>
        </div>

        <div className="stat-card pending-card">
          <div className="stat-header">
            <h3 className="stat-title">Pending</h3>
            <div className="stat-value">{issueStats.pending}</div>
          </div>
        </div>

        <div className="stat-card progress-card">
          <div className="stat-header">
            <h3 className="stat-title">In Progress</h3>
            <div className="stat-value">{issueStats.inProgress}</div>
          </div>
        </div>

        <div className="stat-card resolved-card">
          <div className="stat-header">
            <h3 className="stat-title">Resolved</h3>
            <div className="stat-value">{issueStats.resolved}</div>
          </div>
        </div>
      </div>

      {/* Issues Management Section */}
      <div className="issues-section">
        <div className="issues-header">
          <h2>Student Issues</h2>
          <div className="filter-controls">
            <select
              id="status-filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              disabled={updateLoading}
            >
              <option value="all">All Issues</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>
            <button
              className="refresh-button"
              onClick={handleRefresh}
              disabled={updateLoading || loading}
            >
              Refresh
            </button>
          </div>
        </div>

        {filteredIssues.length === 0 ? (
          <div className="no-issues">
            <p>No issues found with the selected filter.</p>
          </div>
        ) : (
          <div className="issues-table-container">
            {updateLoading && <div className="update-overlay">Updating...</div>}
            <table className="issues-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Subject</th>
                  <th>Issue</th>
                  <th>Status</th>
                  <th>Assign To</th>
                </tr>
              </thead>
              <tbody>
                {filteredIssues.map((issue) => (
                  <tr key={issue.id} className={`status-${issue.status}`}>
                    <td>{issue.studentName}</td>
                    <td>{issue.subject}</td>
                    <td>{issue.description}</td>
                    <td>
                      <select
                        value={issue.status}
                        onChange={(e) =>
                          handleStatusChange(issue.id, e.target.value)
                        }
                        className={`status-select status-${issue.status}`}
                        disabled={updateLoading}
                      >
                        <option value="pending">Pending</option>
                        <option value="in-progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                      </select>
                    </td>
                    <td>
                      <select
                        value={issue.assignedTo || ""}
                        onChange={(e) =>
                          handleAssignLecturer(issue.id, e.target.value)
                        }
                        disabled={updateLoading || issue.status === "resolved"}
                        className="assign-select"
                      >
                        <option value="">Assign Lecturer</option>
                        {lecturers.map((lecturer) => (
                          <option key={lecturer.id} value={lecturer.name}>
                            {lecturer.name}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AcademicRegistrar;
