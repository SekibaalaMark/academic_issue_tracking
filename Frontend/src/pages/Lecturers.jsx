import React, { useState, useEffect, useContext, useCallback } from "react";
import axios from "axios";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Lecturers.css";
import { AuthContext } from "@/context/authContext";

const ENDPOINTS = {
  lecturerIssues:
    "https://academic-6ea365e4b745.herokuapp.com/api/lecturer-issue-management/",
  lecturerDashboard:
    "https://academic-6ea365e4b745.herokuapp.com/api/lecturer-dashboard/",
  userProfile: "https://academic-6ea365e4b745.herokuapp.com/api/user/profile/",
  lecturerProfile:
    "https://academic-6ea365e4b745.herokuapp.com/api/lecturer-profile/",
};

const MESSAGE_TIMEOUT = 5000;

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
      baseURL: "https://academic-6ea365e4b745.herokuapp.com",
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
        (issue.student || "").toLowerCase().includes(searchTerm.toLowerCase());
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
                tab === "logout" ? handleLogout() : setSelectedTab(tab)
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
                {user?.name || localStorage.getItem("username") || "Lecturer"}
              </p>
            </div>

            <div
              className="dashboard-summary"
              style={{ display: "flex", gap: "20px" }}
            >
              {[
                {
                  label: "Total Assigned",
                  value: dashboardData.total_assigned,
                },
                {
                  label: "In Progress",
                  value: dashboardData.in_progress_count,
                },
                { label: "Resolved", value: dashboardData.resolved_count },
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
                  <span className="summary-label" style={{ color: "#1A1A1A" }}>
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
              {issues.length === 0 ? (
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
                      className={`issue-card ${issue.status}`}
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
                          {issue.course_code}: {issue.course_name}
                        </h3>
                        <span
                          className={`status-badge ${issue.status}`}
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
                          {issue.status.replace("_", " ")}
                        </span>
                      </div>
                      <p
                        className="issue-description"
                        style={{ color: "#1A1A1A" }}
                      >
                        {issue.description?.substring(0, 100)}...
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
                          {issue.student}
                        </span>
                        <button
                          className="view-btn"
                          onClick={() => handleViewIssue(issue.id)}
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
              {issues.length > 4 && (
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
              Showing {filteredIssues.length} of {issues.length} issues
            </p>
            <div
              className="filter-container"
              style={{ display: "flex", gap: "10px", marginBottom: "20px" }}
            >
              <div className="search-box" style={{ flex: 1 }}>
                <input
                  type="text"
                  placeholder="Search by course or student..."
                  value={searchTerm}
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
                  value={filterStatus}
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

            {filteredIssues.length === 0 ? (
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
                          style={{ padding: "10px", border: "1px solid #ddd" }}
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
                        className={issue.status}
                        style={{
                          backgroundColor:
                            issue.status === "pending" ? "#e6ffe6" : "#fff",
                        }}
                      >
                        <td
                          style={{ padding: "10px", border: "1px solid #ddd" }}
                        >
                          {issue.id}
                        </td>
                        <td
                          style={{ padding: "10px", border: "1px solid #ddd" }}
                        >
                          {issue.course_code}: {issue.course_name}
                        </td>
                        <td
                          style={{ padding: "10px", border: "1px solid #ddd" }}
                        >
                          {issue.student}
                        </td>
                        <td
                          style={{ padding: "10px", border: "1px solid #ddd" }}
                        >
                          {new Date(issue.created_at).toLocaleDateString()}
                        </td>
                        <td
                          style={{ padding: "10px", border: "1px solid #ddd" }}
                        >
                          <span
                            className={`status-badge ${issue.status}`}
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
                            {issue.status.replace("_", " ")}
                          </span>
                        </td>
                        <td
                          style={{ padding: "10px", border: "1px solid #ddd" }}
                        >
                          <button
                            className="view-btn"
                            onClick={() => handleViewIssue(issue.id)}
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
                  {selectedIssue.course_code}: {selectedIssue.course_name}
                </h2>
                {[
                  {
                    label: "Status",
                    value: (
                      <span
                        className={`status-badge ${selectedIssue.status}`}
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
                        {selectedIssue.status.replace("_", " ")}
                      </span>
                    ),
                  },
                  {
                    label: "Student",
                    value: selectedIssue.student || "N/A",
                  },
                  {
                    label: "Date Submitted",
                    value: new Date(selectedIssue.created_at).toLocaleString(),
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
                  value={emailMessage}
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
                  onClick={() => handleSendRegistrarEmail(selectedIssue.id)}
                  disabled={!emailMessage.trim() || submitting}
                  style={{
                    backgroundColor: "#008000",
                    color: "#fff",
                    padding: "10px 20px",
                    borderRadius: "5px",
                    border: "none",
                    marginTop: "10px",
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
                  value={feedback}
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
                      className={`status-btn ${status} ${selectedIssue.status === status ? "active" : ""}`}
                      onClick={() =>
                        handleStatusUpdate(selectedIssue.id, status)
                      }
                      disabled={selectedIssue.status === status || submitting}
                      style={{
                        backgroundColor:
                          selectedIssue.status === status ? "#ccc" : "#008000",
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
                      {status.replace("_", " ").charAt(0).toUpperCase() +
                        status.replace("_", " ").slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedTab === "profile" && (
          <div>
            <h1>Lecturer Profile</h1>
            <div className="profile-card">
              <div className="profile-header">
                <div className="profile-avatar">
                  <span>👨🏫</span>
                </div>
                <div className="profile-info">
                  <h2>
                    {auth?.user?.name ||
                      auth?.user?.username ||
                      localStorage.getItem("username") ||
                      "Lecturer"}
                  </h2>
                  <p className="profile-role">
                    {auth?.user?.role
                      ? auth.user.role.charAt(0).toUpperCase() +
                        auth.user.role.slice(1)
                      : localStorage.getItem("userRole")
                        ? localStorage
                            .getItem("userRole")
                            .charAt(0)
                            .toUpperCase() +
                          localStorage.getItem("userRole").slice(1)
                        : "Lecturer"}
                  </p>
                </div>
              </div>

              <div className="profile-details">
                <div className="profile-row">
                  <span className="profile-label">Email:</span>
                  <span className="profile-value">
                    {auth?.user?.email || "Not available"}
                  </span>
                </div>
                <div className="profile-row">
                  <span className="profile-label">Username:</span>
                  <span className="profile-value">
                    {auth?.user?.username ||
                      localStorage.getItem("username") ||
                      "Not available"}
                  </span>
                </div>
                <div className="profile-row">
                  <span className="profile-label">Role:</span>
                  <span className="profile-value">
                    {auth?.user?.role
                      ? auth.user.role.charAt(0).toUpperCase() +
                        auth.user.role.slice(1)
                      : localStorage.getItem("userRole")
                        ? localStorage
                            .getItem("userRole")
                            .charAt(0)
                            .toUpperCase() +
                          localStorage.getItem("userRole").slice(1)
                        : "Lecturer"}
                  </span>
                </div>
                {auth?.user?.staff_id && (
                  <div className="profile-row">
                    <span className="profile-label">Staff ID:</span>
                    <span className="profile-value">{auth.user.staff_id}</span>
                  </div>
                )}
              </div>
              <div className="text-center">
                <button onClick={handleLogout} className="btn btn-danger">
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

const ProfileContent = ({ createAuthAxios, setError }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const authAxios = createAuthAxios();
        console.log("Fetching lecturer profile...");
        const response = await authAxios.get(ENDPOINTS.lecturerProfile);
        console.log("Profile response:", response.data);
        setProfile(response.data);
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("Failed to load profile data. Please try again.");
        if (err.response?.status === 401) {
          setError("Session expired. Please log in again.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [createAuthAxios, setError]);

  if (loading) {
    return (
      <div
        className="loading"
        style={{ color: "#1A1A1A", textAlign: "center" }}
      >
        <div className="spinner"></div>
        <p>Loading profile...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <p style={{ color: "#1A1A1A" }}>No profile information available.</p>
    );
  }

  return (
    <div className="profile-content">
      <div
        className="profile-card"
        style={{
          backgroundColor: "#fff",
          padding: "20px",
          borderRadius: "5px",
        }}
      >
        <div
          className="profile-header"
          style={{ display: "flex", alignItems: "center", gap: "15px" }}
        >
          <div className="profile-name">
            <h2 style={{ color: "#1A1A1A" }}>
              {profile.first_name || ""} {profile.last_name || ""}
            </h2>
            <p className="profile-role" style={{ color: "#008000" }}>
              Lecturer
            </p>
          </div>
        </div>

        <div className="profile-details" style={{ marginTop: "20px" }}>
          {[
            { label: "Email", value: profile.email || "Not provided" },
            {
              label: "Department",
              value: profile.department || "Not provided",
            },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="detail-row"
              style={{ display: "flex", margin: "10px 0" }}
            >
              <span
                className="detail-label"
                style={{ width: "150px", color: "#1A1A1A", fontWeight: "bold" }}
              >
                {label}:
              </span>
              <span className="detail-value" style={{ color: "#1A1A1A" }}>
                {value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Lecturer;
