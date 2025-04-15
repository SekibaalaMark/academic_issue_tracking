import React, { useState, useEffect, useContext, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Lecturers.css";
import { AuthContext } from "@/context/authContext";

// API Endpoints
const ENDPOINTS = {
  lecturerIssues:
    "https://academic-6ea365e4b745.herokuapp.com/api/lecturer-issue-management/",
  lecturerDashboard:
    "https://academic-6ea365e4b745.herokuapp.com/api/lecturer-dashboard/",
  userProfile: "https://academic-6ea365e4b745.herokuapp.com/api/user/profile/",
  lecturerProfile:
    "https://academic-6ea365e4b745.herokuapp.com/api/lecturer-profile/",
};

// Message timeout duration
const MESSAGE_TIMEOUT = 5000; // 5 seconds

const Lecturer = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // State variables
  const [userRole, setUserRole] = useState(null);
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
  const [authChecked, setAuthChecked] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Clear messages after timeout
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

  // Create axios instance with authentication
  const createAuthAxios = useCallback(() => {
    const token = user?.token || localStorage.getItem("accessToken");
    return axios.create({
      baseURL: "https://academic-6ea365e4b745.herokuapp.com",
      headers: {
        Authorization: token ? `Bearer ${token}` : undefined, // Use Bearer for JWT
      },
    });
  }, [user]);

  // Function to fetch lecturer data
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

      setIssues(Array.isArray(issuesRes.data) ? issuesRes.data : []);
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
      // Only logout on specific conditions
      if (err.response?.status === 401) {
        setError("Session expired. Please log in again.");
        handleLogout();
      }
    } finally {
      setLoading(false);
    }
  }, [createAuthAxios]);

  // Check authentication and user role
  useEffect(() => {
    const checkAuthAndFetchData = async () => {
      setLoading(true);
      console.log("Checking auth:", {
        user,
        token: user?.token || localStorage.getItem("accessToken"),
        storedRole: localStorage.getItem("userRole"),
      });

      // Check token
      const token = user?.token || localStorage.getItem("accessToken");
      if (!token) {
        console.log("No token found, redirecting to login");
        navigate("/login");
        setAuthChecked(true);
        setLoading(false);
        return;
      }

      try {
        const storedRole = localStorage.getItem("userRole");
        const authAxios = createAuthAxios();

        // Proceed if storedRole is lecturer
        if (storedRole === "lecturer") {
          console.log("Stored role is lecturer, proceeding to fetch data");
          setUserRole("lecturer");
          await fetchLecturerData();
          setAuthChecked(true);
          setLoading(false);
          return;
        }

        // Fetch user profile to confirm role
        console.log("Fetching user profile...");
        const response = await authAxios.get(ENDPOINTS.userProfile);
        console.log("Profile response:", response.data);

        // Handle different role field names
        const role =
          response.data.role?.toLowerCase() ||
          response.data.user_role?.toLowerCase() ||
          response.data.group?.toLowerCase();

        if (!role) {
          console.error("No role found in profile response");
          throw new Error("Role not found in profile response");
        }

        setUserRole(role);
        localStorage.setItem("userRole", role);

        if (role !== "lecturer") {
          console.log(`Role ${role} is not lecturer, redirecting`);
          redirectByRole(role);
          setAuthChecked(true);
          setLoading(false);
          return;
        }

        // Fetch lecturer data
        console.log("Role is lecturer, fetching dashboard data");
        await fetchLecturerData();
        setAuthChecked(true);
      } catch (err) {
        console.error("Auth check error:", {
          message: err.message,
          status: err.response?.status,
          data: err.response?.data,
        });
        setError("Authentication failed. Please try again.");
        if (
          err.response?.status === 401 ||
          err.message.includes("Role not found")
        ) {
          console.log("Unauthorized or role missing, logging out");
          handleLogout();
        } else if (localStorage.getItem("userRole") === "lecturer") {
          console.log("Falling back to stored lecturer role");
          setUserRole("lecturer");
          await fetchLecturerData();
          setAuthChecked(true);
        } else {
          navigate("/login");
          setAuthChecked(true);
        }
      } finally {
        setLoading(false);
      }
    };

    const redirectByRole = (role) => {
      console.log("Redirecting based on role:", role);
      if (["academic_registrar", "registrar"].includes(role)) {
        navigate("/AcademicRegistrar");
      } else if (role === "student") {
        navigate("/students");
      } else {
        navigate("/dashboard");
      }
    };

    if (!authChecked) {
      console.log("Running auth check");
      checkAuthAndFetchData();
    }
  }, [user, navigate, fetchLecturerData, createAuthAxios, authChecked]);

  // Handle logout
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

  // Handle view issue
  const handleViewIssue = useCallback(
    (issueId) => {
      const issue = issues.find((i) => i.id === issueId);
      setSelectedIssue(issue);
      setSelectedTab("issueDetail");
    },
    [issues]
  );

  // Handle status update
  const handleStatusUpdate = useCallback(
    async (issueId, status) => {
      setSubmitting(true);
      setError("");
      setSuccessMsg("");

      try {
        const authAxios = createAuthAxios();
        console.log("Updating issue status:", { issueId, status });
        await authAxios.patch(`${ENDPOINTS.lecturerIssues}${issueId}/`, {
          status,
          feedback: comment || "Status updated by lecturer.",
        });

        setSuccessMsg(
          `Issue ${status === "resolved" ? "resolved" : "updated"} successfully.`
        );

        await fetchLecturerData();

        if (selectedIssue && selectedIssue.id === issueId) {
          const updatedIssue = await authAxios.get(
            `${ENDPOINTS.lecturerIssues}${issueId}/`
          );
          setSelectedIssue(updatedIssue.data);
        }

        setComment("");
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
    [comment, createAuthAxios, fetchLecturerData, selectedIssue]
  );

  // Handle add comment
  const handleAddComment = useCallback(
    async (issueId) => {
      if (!comment.trim()) {
        setError("Comment cannot be empty.");
        return;
      }

      setSubmitting(true);
      setError("");
      setSuccessMsg("");

      try {
        const authAxios = createAuthAxios();
        console.log("Adding comment to issue:", issueId);
        await authAxios.post(`${ENDPOINTS.lecturerIssues}${issueId}/comment/`, {
          content: comment,
        });

        setSuccessMsg("Comment added successfully.");

        const issueRes = await authAxios.get(
          `${ENDPOINTS.lecturerIssues}${issueId}/`
        );
        setSelectedIssue(issueRes.data);
        setComment("");
      } catch (err) {
        console.error("Error adding comment:", err);
        setError("Failed to add comment. Please try again.");
        if (err.response?.status === 401) {
          setError("Session expired. Please log in again.");
          handleLogout();
        }
      } finally {
        setSubmitting(false);
      }
    },
    [comment, createAuthAxios]
  );

  // Filter issues
  const filteredIssues = issues
    .filter((issue) => {
      const matchesSearch =
        searchTerm === "" ||
        issue.course_code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        issue.course_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (issue.student?.first_name + " " + issue.student?.last_name)
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase());
      const matchesStatus =
        filterStatus === "" || issue.status === filterStatus;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (a.status === "pending" && b.status !== "pending") return -1;
      if (b.status === "pending" && a.status !== "pending") return 1;
      return new Date(b.created_at) - new Date(a.created_at);
    });

  if (loading || !authChecked) {
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

  if (authChecked && (!user || userRole !== "lecturer")) {
    console.log("Auth checked, redirecting due to invalid user or role");
    return null;
  }

  console.log("Rendering lecturer dashboard");
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
                                  : "#0066cc",
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
                          {issue.student?.first_name} {issue.student?.last_name}
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

            <div
              className="filter-container"
              style={{ display: "flex", gap: "10px", marginBottom: "20px" }}
            >
              <div className="search-box" style={{ flex: 1 }}>
                <input
                  type="text"
                  placeholder="Search by course or student name..."
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
                  <option value="rejected">Rejected</option>
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
                          {issue.student?.first_name} {issue.student?.last_name}
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
                                    : "#0066cc",
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
                              : "#ff9900",
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
                    value: `${selectedIssue.student?.first_name || ""} ${
                      selectedIssue.student?.last_name || ""
                    }`,
                  },
                  {
                    label: "Student ID",
                    value: selectedIssue.student?.student_id || "N/A",
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

              {selectedIssue.attachments?.length > 0 && (
                <div
                  className="attachments-section"
                  style={{ marginTop: "20px" }}
                >
                  <h3 style={{ color: "#1A1A1A" }}>Attachments</h3>
                  <ul
                    className="attachments-list"
                    style={{ listStyle: "none", padding: 0 }}
                  >
                    {selectedIssue.attachments.map((attachment, index) => (
                      <li key={index} style={{ margin: "5px 0" }}>
                        <a
                          href={attachment.file}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: "#008000" }}
                        >
                          {attachment.filename || `Attachment ${index + 1}`}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="comments-section" style={{ marginTop: "20px" }}>
                <h3 style={{ color: "#1A1A1A" }}>Comments</h3>
                {selectedIssue.comments?.length > 0 ? (
                  <div className="comments-list">
                    {selectedIssue.comments.map((comment, index) => (
                      <div
                        key={index}
                        className="comment"
                        style={{
                          backgroundColor: "#fff",
                          padding: "10px",
                          borderRadius: "5px",
                          margin: "10px 0",
                          border: "1px solid #ddd",
                        }}
                      >
                        <div
                          className="comment-header"
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <span
                            className="comment-author"
                            style={{ color: "#1A1A1A" }}
                          >
                            {comment.author_name || "Unknown"}
                          </span>
                          <span
                            className="comment-date"
                            style={{ color: "#666" }}
                          >
                            {new Date(comment.created_at).toLocaleString()}
                          </span>
                        </div>
                        <p
                          className="comment-content"
                          style={{ color: "#1A1A1A" }}
                        >
                          {comment.content}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="no-comments" style={{ color: "#1A1A1A" }}>
                    No comments yet.
                  </p>
                )}

                <div className="add-comment" style={{ marginTop: "15px" }}>
                  <textarea
                    placeholder="Add a comment or feedback..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
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
                    className="comment-btn"
                    onClick={() => handleAddComment(selectedIssue.id)}
                    disabled={!comment.trim() || submitting}
                    style={{
                      backgroundColor: "#008000",
                      color: "#fff",
                      padding: "10px 20px",
                      borderRadius: "5px",
                      border: "none",
                      marginTop: "10px",
                    }}
                  >
                    {submitting ? "Submitting..." : "Add Comment"}
                  </button>
                </div>
              </div>

              <div
                className="status-update-section"
                style={{ marginTop: "20px" }}
              >
                <h3 style={{ color: "#1A1A1A" }}>Update Status</h3>
                <div
                  className="status-buttons"
                  style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}
                >
                  {["pending", "in_progress", "resolved", "rejected"].map(
                    (status) => (
                      <button
                        key={status}
                        className={`status-btn ${status} ${
                          selectedIssue.status === status ? "active" : ""
                        }`}
                        onClick={() =>
                          handleStatusUpdate(selectedIssue.id, status)
                        }
                        disabled={selectedIssue.status === status || submitting}
                        style={{
                          backgroundColor:
                            selectedIssue.status === status
                              ? "#ccc"
                              : "#008000",
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
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedTab === "profile" && (
          <div className="profile-section">
            <h1 className="page-title" style={{ color: "#1A1A1A" }}>
              Lecturer Profile
            </h1>
            <ProfileContent
              createAuthAxios={createAuthAxios}
              setError={setError}
            />
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
          // Avoid logout here to prevent loop
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
          <div className="profile-avatar">
            {profile.profile_picture ? (
              <img
                src={profile.profile_picture}
                alt="Profile"
                style={{ width: "80px", height: "80px", borderRadius: "50%" }}
              />
            ) : (
              <div
                className="avatar-placeholder"
                style={{
                  width: "80px",
                  height: "80px",
                  borderRadius: "50%",
                  backgroundColor: "#008000",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "30px",
                }}
              >
                {profile.first_name ? profile.first_name.charAt(0) : "L"}
              </div>
            )}
          </div>
          <div className="profile-name">
            <h2 style={{ color: "#1A1A1A" }}>
              {profile.title || ""} {profile.first_name || ""}{" "}
              {profile.last_name || ""}
            </h2>
            <p className="profile-role" style={{ color: "#008000" }}>
              Lecturer
            </p>
          </div>
        </div>

        <div className="profile-details" style={{ marginTop: "20px" }}>
          {[
            { label: "Email", value: profile.email || "Not provided" },
            { label: "Phone", value: profile.phone || "Not provided" },
            {
              label: "Department",
              value: profile.department || "Not provided",
            },
            { label: "Faculty", value: profile.faculty || "Not provided" },
            { label: "Staff ID", value: profile.staff_id || "Not provided" },
            {
              label: "Office Location",
              value: profile.office_location || "Not provided",
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

        <div className="profile-bio" style={{ marginTop: "20px" }}>
          <h3 style={{ color: "#1A1A1A" }}>Bio</h3>
          <p
            style={{
              color: "#1A1A1A",
              backgroundColor: "#f4f4f4",
              padding: "10px",
              borderRadius: "5px",
            }}
          >
            {profile.bio || "No bio information available."}
          </p>
        </div>

        {profile.courses?.length > 0 && (
          <div className="profile-courses" style={{ marginTop: "20px" }}>
            <h3 style={{ color: "#1A1A1A" }}>Courses</h3>
            <ul
              className="courses-list"
              style={{ listStyle: "none", padding: 0 }}
            >
              {profile.courses.map((course, index) => (
                <li key={index} style={{ margin: "5px 0", color: "#1A1A1A" }}>
                  <span className="course-code" style={{ fontWeight: "bold" }}>
                    {course.course_code}
                  </span>
                  <span className="course-name" style={{ marginLeft: "10px" }}>
                    {course.course_name}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Lecturer;
