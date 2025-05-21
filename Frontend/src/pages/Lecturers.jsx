import React, { useState, useEffect, useContext, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Lecturers.css";
import { AuthContext } from "@/context/authContext";

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: "20px", color: "#ff0000", textAlign: "center" }}>
          <h2>Something went wrong</h2>
          <p>We're sorry, but there was an error loading this component.</p>
          <details
            style={{
              whiteSpace: "pre-wrap",
              marginTop: "20px",
              textAlign: "left",
            }}
          >
            <summary>Show error details</summary>
            <p>{this.state.error && this.state.error.toString()}</p>
            <p>Component Stack:</p>
            <pre>
              {this.state.errorInfo && this.state.errorInfo.componentStack}
            </pre>
          </details>
          <button
            onClick={() => window.location.reload()}
            style={{
              backgroundColor: "#008000",
              color: "#fff",
              padding: "10px 20px",
              borderRadius: "5px",
              border: "none",
              marginTop: "20px",
            }}
          >
            Reload Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const ENDPOINTS = {
  lecturerIssues:
    "https://academic-issue-tracking-now.onrender.com/api/lecturer-issue-management/",
  lecturerDashboard:
    "https://academic-issue-tracking-now.onrender.com/api/lecturer-dashboard/",
  userProfile: "https://academic-issue-tracking-now.onrender.com/api/user/profile/",
  lecturerProfile: "https://academic-issue-tracking-now.onrender.com/api/lecturer-profile/",
};

const MESSAGE_TIMEOUT = 5000;

// Helper function to safely format student information
const formatStudent = (student) => {
  if (!student) return "N/A";
  if (typeof student === "object") {
    return (
      `${student.first_name || ""} ${student.last_name || ""}`.trim() ||
      student.username ||
      "N/A"
    );
  }
  return student;
};

// Helper function to safely format user information
const formatUser = (user) => {
  if (!user) return null;
  return {
    name:
      user.name ||
      `${user.first_name || ""} ${user.last_name || ""}`.trim() ||
      user.username ||
      "",
    email: user.email || "",
    role: user.role || "",
    username: user.username || "",
    staffId: user.staff_id || "",
  };
};

const Lecturer = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [issues, setIssues] = useState([]);
  const [dashboardData, setDashboardData] = useState({
    total_assigned: 0,
    in_progress_count: 0,
    resolved_count: 0,
  });
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [selectedTab, setSelectedTab] = useState("home");
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [feedback, setFeedback] = useState("");
  const [emailMessage, setEmailMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Format user data safely
  const formattedUser = formatUser(user);

  useEffect(() => {
    if (successMsg) {
      const timer = setTimeout(() => setSuccessMsg(""), MESSAGE_TIMEOUT);
      return () => clearTimeout(timer);
    }
  }, [successMsg]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), MESSAGE_TIMEOUT);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const createAuthAxios = useCallback(() => {
    const token = user?.token || localStorage.getItem("accessToken");
    console.log("Using token:", token ? "Present" : "Missing");
    return axios.create({
      baseURL: "https://academic-issue-tracking-now.onrender.com/",
      headers: {
        Authorization: token ? `Bearer ${token}` : undefined,
      },
    });
  }, [user]);

  const fetchLecturerData = useCallback(async () => {
    try {
      setLoading(true);
      const authAxios = createAuthAxios();
      console.log("Fetching lecturer data...");
      const [issuesRes, dashboardRes] = await Promise.all([
        authAxios.get(ENDPOINTS.lecturerIssues),
        authAxios.get(ENDPOINTS.lecturerDashboard),
      ]);
      console.log("Issues response:", issuesRes.data);
      console.log("Dashboard response:", dashboardRes.data);
      if (!Array.isArray(issuesRes.data)) {
        console.warn("Issues response is not an array:", issuesRes.data);
        setIssues([]);
      } else {
        setIssues(issuesRes.data);
      }
      setDashboardData(
        dashboardRes.data.dashboard || {
          total_assigned: 0,
          in_progress_count: 0,
          resolved_count: 0,
        }
      );
    } catch (err) {
      console.error("Error fetching lecturer data:", {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data,
      });
      setError("Failed to load dashboard data. Please try again.");
      if (err.response?.status === 401) {
        setError("Session expired. Please log in again.");
        handleLogout();
      }
    } finally {
      setLoading(false);
    }
  }, [createAuthAxios]);

  useEffect(() => {
    fetchLecturerData();
    const interval = setInterval(fetchLecturerData, 30000);
    return () => clearInterval(interval);
  }, [fetchLecturerData]);

  const handleLogout = useCallback(() => {
    console.log("Logging out...");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userRole");
    localStorage.removeItem("username");
    if (logout) {
      logout();
    }
    navigate("/login");
  }, [logout, navigate]);

  const handleViewIssue = useCallback(
    (issueId) => {
      const issue = issues.find((i) => i.id === issueId);
      setSelectedIssue(issue);
      setSelectedTab("issueDetail");
      setFeedback("");
      setEmailMessage("");
    },
    [issues]
  );

  const handleStatusUpdate = useCallback(
    async (issueId, status) => {
      setSubmitting(true);
      setError("");
      setSuccessMsg("");
      try {
        const authAxios = createAuthAxios();
        console.log("Updating issue status:", { issueId, status, feedback });
        await authAxios.patch(`${ENDPOINTS.lecturerIssues}${issueId}/`, {
          status,
          feedback: feedback || "Status updated by lecturer.",
        });
        setSuccessMsg(
          status === "resolved"
            ? "Issue resolved. Emails sent to you, student, and registrar."
            : status === "in_progress"
              ? "Issue set to in progress. Emails sent to you and student."
              : status === "pending"
                ? "Issue set to pending. Emails sent to you and student."
                : "Issue updated successfully."
        );
        await fetchLecturerData();
        if (selectedIssue && selectedIssue.id === issueId) {
          const updatedIssue = await authAxios.get(
            `${ENDPOINTS.lecturerIssues}${issueId}/`
          );
          setSelectedIssue(updatedIssue.data);
        }
        setFeedback("");
      } catch (err) {
        console.error("Error updating issue:", err);
        setError("Failed to update issue. Please try again.");
        if (err.response?.status === 401) {
          setError("Session expired. Please log in again.");
          handleLogout();
        }
      } finally {
        setSubmitting(false);
      }
    },
    [feedback, createAuthAxios, fetchLecturerData, selectedIssue]
  );

  const handleSendRegistrarEmail = useCallback(
    async (issueId) => {
      if (!emailMessage.trim()) {
        setError("Email message cannot be empty.");
        return;
      }
      setSubmitting(true);
      setError("");
      setSuccessMsg("");
      try {
        const authAxios = createAuthAxios();
        console.log("Sending email to registrar for issue:", issueId);
        await authAxios.post(
          `${ENDPOINTS.lecturerIssues}${issueId}/send-registrar-email/`,
          {
            message: emailMessage,
          }
        );
        setSuccessMsg("Email sent to registrar successfully.");
        setEmailMessage("");
      } catch (err) {
        console.error("Error sending email:", err);
        setError("Failed to send email to registrar. Please try again.");
        if (err.response?.status === 401) {
          setError("Session expired. Please log in again.");
          handleLogout();
        }
      } finally {
        setSubmitting(false);
      }
    },
    [emailMessage, createAuthAxios]
  );

  const filteredIssues = issues
    .filter((issue) => {
      const matchesSearch =
        searchTerm === "" ||
        (issue.course_code || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        (issue.course_name || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        formatStudent(issue.student)
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      const matchesStatus =
        filterStatus === "" || (issue.status || "") === filterStatus;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if ((a.status || "") === "pending" && (b.status || "") !== "pending")
        return -1;
      if ((b.status || "") === "pending" && (a.status || "") !== "pending")
        return 1;
      return new Date(b.created_at || 0) - new Date(a.created_at || 0);
    });

  if (loading) {
    return (
      <div
        className="loading"
        style={{ color: "#1A1A1A", textAlign: "center" }}
      >
        <div className="spinner"></div>
        <p>Loading Lecturer Dashboard...</p>
      </div>
    );
  }
  return (
    <ErrorBoundary>
      <div className="lecturer-dashboard">
        <aside className="sidebar" style={{ backgroundColor: "#f4f4f4" }}>
          <h2 className="sidebar-title" style={{ color: "#1A1A1A" }}>
            Lecturer Dashboard
          </h2>
          <ul className="sidebar-nav">
            {["home", "issues", "profile", "logout"].map((tab) => (
              <li
                key={tab}
                className={selectedTab === tab ? "active" : ""}
                onClick={() =>
                  tab === "logout" && typeof handleLogout === "function"
                    ? handleLogout()
                    : setSelectedTab(tab)
                }
                style={{
                  color: selectedTab === tab ? "#008000" : "#1A1A1A",
                  cursor: "pointer",
                  padding: "10px",
                }}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </li>
            ))}
          </ul>
        </aside>
        <main className="main-content" style={{ padding: "20px" }}>
          {successMsg && (
            <div
              className="success-message"
              style={{
                backgroundColor: "#008000",
                color: "#fff",
                padding: "10px",
              }}
            >
              <p>{successMsg}</p>
              <button
                className="close-btn"
                onClick={() => setSuccessMsg("")}
                style={{ color: "#fff" }}
              >
                ×
              </button>
            </div>
          )}
          {error && (
            <div
              className="error-message"
              style={{
                backgroundColor: "#ff0000",
                color: "#fff",
                padding: "10px",
              }}
            >
              <p>{error}</p>
              <button
                className="close-btn"
                onClick={() => setError("")}
                style={{ color: "#fff" }}
              >
                ×
              </button>
            </div>
          )}
          {selectedTab === "home" && (
            <div className="dashboard-home">
              <h1 className="page-title" style={{ color: "#1A1A1A" }}>
                Lecturer Dashboard
              </h1>
              <button
                onClick={fetchLecturerData}
                style={{
                  backgroundColor: "#008000",
                  color: "#fff",
                  padding: "10px 20px",
                  borderRadius: "5px",
                  border: "none",
                  marginBottom: "20px",
                }}
              >
                Refresh Issues
              </button>
              <div className="user-welcome">
                <p style={{ color: "#1A1A1A" }}>
                  Welcome,{" "}
                  {formattedUser?.name ||
                    localStorage.getItem("username") ||
                    "Lecturer"}
                </p>
              </div>
              <div
                className="dashboard-summary"
                style={{ display: "flex", gap: "20px" }}
              >
                {[
                  {
                    label: "Total Assigned",
                    value: dashboardData?.total_assigned || 0,
                  },
                  {
                    label: "In Progress",
                    value: dashboardData?.in_progress_count || 0,
                  },
                  {
                    label: "Resolved",
                    value: dashboardData?.resolved_count || 0,
                  },
                ].map(({ label, value }) => (
                  <div
                    key={label}
                    className="summary-item"
                    style={{
                      backgroundColor: "#fff",
                      padding: "15px",
                      borderRadius: "5px",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                    }}
                  >
                    <span
                      className="summary-label"
                      style={{ color: "#1A1A1A" }}
                    >
                      {label}:
                    </span>
                    <span
                      className="summary-value"
                      style={{ color: "#008000", fontWeight: "bold" }}
                    >
                      {value}
                    </span>
                  </div>
                ))}
              </div>
              <div className="recent-issues">
                <h2 className="section-title" style={{ color: "#1A1A1A" }}>
                  Recent Issues
                </h2>
                {issues?.length === 0 ? (
                  <p className="no-issues" style={{ color: "#1A1A1A" }}>
                    No issues assigned to you yet.
                  </p>
                ) : (
                  <div
                    className="issues-grid"
                    style={{ display: "grid", gap: "15px" }}
                  >
                    {issues.slice(0, 4).map((issue) => (
                      <div
                        key={issue.id}
                        className={`issue-card ${issue.status || ""}`}
                        style={{
                          backgroundColor:
                            issue.status === "pending" ? "#e6ffe6" : "#fff",
                          padding: "15px",
                          borderRadius: "5px",
                          border: "1px solid #ddd",
                        }}
                      >
                        <div
                          className="issue-header"
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <h3 style={{ color: "#1A1A1A" }}>
                            {issue.course_code || "N/A"}:{" "}
                            {issue.course_name || "Unknown Course"}
                          </h3>
                          <span
                            className={`status-badge ${issue.status || ""}`}
                            style={{
                              backgroundColor:
                                issue.status === "resolved"
                                  ? "#008000"
                                  : issue.status === "pending"
                                    ? "#ff9900"
                                    : issue.status === "in_progress"
                                      ? "#0066cc"
                                      : "#ff0000",
                              color: "#fff",
                              padding: "5px 10px",
                              borderRadius: "12px",
                            }}
                          >
                            {(issue.status || "unknown").replace("_", " ")}
                          </span>
                        </div>
                        <p
                          className="issue-description"
                          style={{ color: "#1A1A1A" }}
                        >
                          {(
                            issue.description || "No description provided"
                          ).substring(0, 100)}
                          ...
                        </p>
                        <div
                          className="issue-footer"
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <span
                            className="student-name"
                            style={{ color: "#1A1A1A" }}
                          >
                            {formatStudent(issue.student) || "Unknown Student"}
                          </span>
                          <button
                            className="view-btn"
                            onClick={() =>
                              typeof handleViewIssue === "function" &&
                              handleViewIssue(issue.id)
                            }
                            style={{
                              backgroundColor: "#008000",
                              color: "#fff",
                              padding: "8px 15px",
                              borderRadius: "5px",
                              border: "none",
                            }}
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {issues?.length > 4 && (
                  <button
                    className="view-all-btn"
                    onClick={() => setSelectedTab("issues")}
                    style={{
                      backgroundColor: "#008000",
                      color: "#fff",
                      padding: "10px 20px",
                      borderRadius: "5px",
                      border: "none",
                      marginTop: "15px",
                    }}
                  >
                    View All Issues
                  </button>
                )}
              </div>
            </div>
          )}
          {selectedTab === "issues" && (
            <div className="issues-management">
              <h1 className="page-title" style={{ color: "#1A1A1A" }}>
                Manage Issues
              </h1>
              <p style={{ color: "#1A1A1A" }}>
                Showing {filteredIssues?.length || 0} of {issues?.length || 0}{" "}
                issues
              </p>
              <div
                className="filter-container"
                style={{ display: "flex", gap: "10px", marginBottom: "20px" }}
              >
                <div className="search-box" style={{ flex: 1 }}>
                  <input
                    type="text"
                    placeholder="Search by course or student..."
                    value={searchTerm || ""}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px",
                      borderRadius: "5px",
                      border: "1px solid #ddd",
                      color: "#1A1A1A",
                    }}
                  />
                </div>
                <div className="status-filter">
                  <select
                    value={filterStatus || ""}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    style={{
                      padding: "10px",
                      borderRadius: "5px",
                      border: "1px solid #ddd",
                      color: "#1A1A1A",
                    }}
                  >
                    <option value="">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                  </select>
                </div>
              </div>
              {filteredIssues?.length === 0 ? (
                <p className="no-issues" style={{ color: "#1A1A1A" }}>
                  No issues match your search criteria.
                </p>
              ) : (
                <div className="issues-table-container">
                  <table
                    className="issues-table"
                    style={{
                      width: "100%",
                      borderCollapse: "collapse",
                      color: "#1A1A1A",
                    }}
                  >
                    <thead>
                      <tr style={{ backgroundColor: "#f4f4f4" }}>
                        {[
                          "ID",
                          "Course",
                          "Student",
                          "Date Submitted",
                          "Status",
                          "Actions",
                        ].map((header) => (
                          <th
                            key={header}
                            style={{
                              padding: "10px",
                              border: "1px solid #ddd",
                            }}
                          >
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredIssues.map((issue) => (
                        <tr
                          key={issue.id}
                          className={issue.status || ""}
                          style={{
                            backgroundColor:
                              issue.status === "pending" ? "#e6ffe6" : "#fff",
                          }}
                        >
                          <td
                            style={{
                              padding: "10px",
                              border: "1px solid #ddd",
                            }}
                          >
                            {issue.id || "N/A"}
                          </td>
                          <td
                            style={{
                              padding: "10px",
                              border: "1px solid #ddd",
                            }}
                          >
                            {issue.course_code || "N/A"}:{" "}
                            {issue.course_name || "Unknown Course"}
                          </td>
                          <td
                            style={{
                              padding: "10px",
                              border: "1px solid #ddd",
                            }}
                          >
                            {formatStudent(issue.student) || "Unknown Student"}
                          </td>
                          <td
                            style={{
                              padding: "10px",
                              border: "1px solid #ddd",
                            }}
                          >
                            {issue.created_at
                              ? new Date(issue.created_at).toLocaleDateString()
                              : "N/A"}
                          </td>
                          <td
                            style={{
                              padding: "10px",
                              border: "1px solid #ddd",
                            }}
                          >
                            <span
                              className={`status-badge ${issue.status || ""}`}
                              style={{
                                backgroundColor:
                                  issue.status === "resolved"
                                    ? "#008000"
                                    : issue.status === "pending"
                                      ? "#ff9900"
                                      : issue.status === "in_progress"
                                        ? "#0066cc"
                                        : "#ff0000",
                                color: "#fff",
                                padding: "5px 10px",
                                borderRadius: "12px",
                              }}
                            >
                              {(issue.status || "unknown").replace("_", " ")}
                            </span>
                          </td>
                          <td
                            style={{
                              padding: "10px",
                              border: "1px solid #ddd",
                            }}
                          >
                            <button
                              className="view-btn"
                              onClick={() =>
                                typeof handleViewIssue === "function" &&
                                handleViewIssue(issue.id)
                              }
                              style={{
                                backgroundColor: "#008000",
                                color: "#fff",
                                padding: "8px 15px",
                                borderRadius: "5px",
                                border: "none",
                              }}
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
          {selectedTab === "issueDetail" && selectedIssue && (
            <div className="issue-detail">
              <div
                className="detail-header"
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <button
                  className="back-btn"
                  onClick={() => setSelectedTab("issues")}
                  style={{
                    backgroundColor: "#008000",
                    color: "#fff",
                    padding: "8px 15px",
                    borderRadius: "5px",
                    border: "none",
                  }}
                >
                  ← Back to Issues
                </button>
                <h1 className="page-title" style={{ color: "#1A1A1A" }}>
                  Issue Details
                </h1>
              </div>
              <div className="issue-info">
                <div
                  className="info-section"
                  style={{
                    backgroundColor: "#fff",
                    padding: "15px",
                    borderRadius: "5px",
                  }}
                >
                  <h2 style={{ color: "#1A1A1A" }}>
                    {selectedIssue.course_code || "N/A"}:{" "}
                    {selectedIssue.course_name || "Unknown Course"}
                  </h2>
                  {[
                    {
                      label: "Status",
                      value: (
                        <span
                          className={`status-badge ${selectedIssue.status || ""}`}
                          style={{
                            backgroundColor:
                              selectedIssue.status === "resolved"
                                ? "#008000"
                                : selectedIssue.status === "pending"
                                  ? "#ff9900"
                                  : selectedIssue.status === "in_progress"
                                    ? "#0066cc"
                                    : "#ff0000",
                            color: "#fff",
                            padding: "5px 10px",
                            borderRadius: "12px",
                          }}
                        >
                          {(selectedIssue.status || "unknown").replace(
                            "_",
                            " "
                          )}
                        </span>
                      ),
                    },
                    {
                      label: "Student",
                      value:
                        formatStudent(selectedIssue.student) ||
                        "Unknown Student",
                    },
                    {
                      label: "Date Submitted",
                      value: selectedIssue.created_at
                        ? new Date(selectedIssue.created_at).toLocaleString()
                        : "N/A",
                    },
                  ].map(({ label, value }) => (
                    <div
                      key={label}
                      className="info-row"
                      style={{ margin: "10px 0" }}
                    >
                      <span
                        className="info-label"
                        style={{ color: "#1A1A1A", fontWeight: "bold" }}
                      >
                        {label}:
                      </span>
                      <span style={{ color: "#1A1A1A" }}>{value}</span>
                    </div>
                  ))}
                </div>
                <div
                  className="description-section"
                  style={{ marginTop: "20px" }}
                >
                  <h3 style={{ color: "#1A1A1A" }}>Issue Description</h3>
                  <p
                    style={{
                      color: "#1A1A1A",
                      backgroundColor: "#fff",
                      padding: "10px",
                      borderRadius: "5px",
                    }}
                  >
                    {selectedIssue.description || "No description provided."}
                  </p>
                </div>
                <div
                  className="registrar-communication"
                  style={{ marginTop: "20px" }}
                >
                  <h3 style={{ color: "#1A1A1A" }}>Contact Registrar</h3>
                  <textarea
                    placeholder="Enter your message to the academic registrar (e.g., need clarification)..."
                    value={emailMessage || ""}
                    onChange={(e) => setEmailMessage(e.target.value)}
                    disabled={submitting}
                    style={{
                      width: "100%",
                      padding: "10px",
                      borderRadius: "5px",
                      border: "1px solid #ddd",
                      color: "#1A1A1A",
                      minHeight: "100px",
                    }}
                  />
                  <button
                    className="send-email-btn"
                    onClick={() =>
                      handleSendRegistrarEmail &&
                      handleSendRegistrarEmail(selectedIssue.id)
                    }
                    disabled={!emailMessage?.trim() || submitting}
                    style={{
                      backgroundColor: "#008000",
                      color: "#fff",
                      padding: "10px 20px",
                      borderRadius: "5px",
                      border: "none",
                      marginTop: "10px",
                      opacity: !emailMessage?.trim() || submitting ? 0.6 : 1,
                    }}
                  >
                    {submitting ? "Sending..." : "Send Email to Registrar"}
                  </button>
                </div>
                <div
                  className="status-update-section"
                  style={{ marginTop: "20px" }}
                >
                  <h3 style={{ color: "#1A1A1A" }}>Update Status</h3>
                  <textarea
                    placeholder="Enter feedback for this status update..."
                    value={feedback || ""}
                    onChange={(e) => setFeedback(e.target.value)}
                    disabled={submitting}
                    style={{
                      width: "100%",
                      padding: "10px",
                      borderRadius: "5px",
                      border: "1px solid #ddd",
                      color: "#1A1A1A",
                      minHeight: "80px",
                      marginBottom: "10px",
                    }}
                  />
                  <div
                    className="status-buttons"
                    style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}
                  >
                    {["pending", "in_progress", "resolved"].map((status) => (
                      <button
                        key={status}
                        className={`status-btn ${status} ${
                          selectedIssue.status === status ? "active" : ""
                        }`}
                        onClick={() =>
                          handleStatusUpdate &&
                          handleStatusUpdate(selectedIssue.id, status)
                        }
                        disabled={selectedIssue.status === status || submitting}
                        style={{
                          backgroundColor:
                            status === "resolved"
                              ? "#008000"
                              : status === "pending"
                                ? "#ff9900"
                                : status === "in_progress"
                                  ? "#0066cc"
                                  : "#ff0000",
                          color: "#fff",
                          padding: "10px 20px",
                          borderRadius: "5px",
                          border: "none",
                          opacity:
                            selectedIssue.status === status || submitting
                              ? 0.6
                              : 1,
                        }}
                      >
                        {status === "in_progress"
                          ? "In Progress"
                          : status.charAt(0).toUpperCase() + status.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
                {selectedIssue.feedback && (
                  <div
                    className="feedback-section"
                    style={{ marginTop: "20px" }}
                  >
                    <h3 style={{ color: "#1A1A1A" }}>Previous Feedback</h3>
                    <p
                      style={{
                        color: "#1A1A1A",
                        backgroundColor: "#fff",
                        padding: "10px",
                        borderRadius: "5px",
                      }}
                    >
                      {selectedIssue.feedback}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
          {selectedTab === "profile" && (
            <div className="profile-section">
              <h1 className="page-title" style={{ color: "#1A1A1A" }}>
                Lecturer Profile
              </h1>
              <div
                className="profile-card"
                style={{
                  backgroundColor: "#fff",
                  padding: "20px",
                  borderRadius: "5px",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}
              >
                <h2>
                  {formattedUser?.name ||
                    localStorage.getItem("username") ||
                    "Lecturer"}
                </h2>
                <div className="profile-info">
                  {[
                    { label: "Email", value: formattedUser?.email || "N/A" },
                    { label: "Role", value: formattedUser?.role || "Lecturer" },
                    {
                      label: "Username",
                      value:
                        formattedUser?.username ||
                        localStorage.getItem("username") ||
                        "N/A",
                    },
                    {
                      label: "Staff ID",
                      value: formattedUser?.staffId || "N/A",
                    },
                  ].map(({ label, value }) => (
                    <div
                      key={label}
                      className="info-row"
                      style={{ margin: "10px 0" }}
                    >
                      <span
                        className="info-label"
                        style={{ color: "#1A1A1A", fontWeight: "bold" }}
                      >
                        {label}:
                      </span>
                      <span style={{ color: "#1A1A1A" }}>{value}</span>
                    </div>
                  ))}
                </div>
                <div
                  className="profile-actions"
                  style={{ marginTop: "20px", display: "flex", gap: "10px" }}
                >
                  <button
                    className="logout-btn"
                    onClick={() =>
                      typeof handleLogout === "function" && handleLogout()
                    }
                    style={{
                      backgroundColor: "#ff0000",
                      color: "#fff",
                      padding: "10px 20px",
                      borderRadius: "5px",
                      border: "none",
                    }}
                  >
                    Logout
                  </button>
                </div>
              </div>
              <div
                className="dashboard-summary"
                style={{
                  display: "flex",
                  gap: "20px",
                  marginTop: "20px",
                  flexWrap: "wrap",
                }}
              >
                {[
                  {
                    label: "Total Assigned",
                    value: dashboardData?.total_assigned || 0,
                  },
                  {
                    label: "In Progress",
                    value: dashboardData?.in_progress_count || 0,
                  },
                  {
                    label: "Resolved",
                    value: dashboardData?.resolved_count || 0,
                  },
                ].map(({ label, value }) => (
                  <div
                    key={label}
                    className="summary-item"
                    style={{
                      backgroundColor: "#fff",
                      padding: "15px",
                      borderRadius: "5px",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                      flex: "1 1 30%",
                    }}
                  >
                    <span
                      className="summary-label"
                      style={{ color: "#1A1A1A" }}
                    >
                      {label}:
                    </span>
                    <span
                      className="summary-value"
                      style={{ color: "#008000", fontWeight: "bold" }}
                    >
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </ErrorBoundary>
  );
};

export default Lecturer;
