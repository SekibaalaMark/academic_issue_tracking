"use client";

import React, { useState, useEffect, useContext, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "@/context/authContext";
import "./lecturers.css";

// API endpoints
const API_ENDPOINTS = {
  lecturerIssues:
    "https://academic-6ea365e4b745.herokuapp.com/api/lecturer-issue-management/",
  lecturerDashboard:
    "https://academic-6ea365e4b745.herokuapp.com/api/lecturer-dashboard/",
  lecturerProfile:
    "https://academic-6ea365e4b745.herokuapp.com/api/lecturer-profile/",
  notificationEndpoint:
    "https://academic-6ea365e4b745.herokuapp.com/api/notifications/",
};

// Main Lecturer Component
const Lecturer = () => {
  // Context and navigation
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  // State management
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
  const [submitting, setSubmitting] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [lastRefreshed, setLastRefreshed] = useState(new Date());
  const [categoryFilter, setCategoryFilter] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState("desc");
  const [feedback, setFeedback] = useState("");
  const [hasNewAssignments, setHasNewAssignments] = useState(false);
  const [notifications, setNotifications] = useState([]);

  // Check if user is authenticated
  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [navigate]);

  // Online/offline detection
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      // Refresh data when coming back online
      fetchData();
    };

    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Clear messages after timeout
  useEffect(() => {
    if (successMsg) {
      const timer = setTimeout(() => setSuccessMsg(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [successMsg]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Logout handler
  const handleLogout = () => {
    if (auth && auth.logout) {
      auth.logout();
    } else {
      // Fallback if auth context is not available
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("userRole");
      localStorage.removeItem("username");
      navigate("/login");
    }
  };

  // Create authenticated axios instance
  const createAuthAxios = useCallback(() => {
    const token = auth?.user?.token || localStorage.getItem("accessToken");

    return axios.create({
      headers: {
        Authorization: token ? `Bearer ${token}` : undefined,
        "Content-Type": "application/json",
      },
      timeout: 10000,
    });
  }, [auth]);

  // Check for new assignments
  const checkForNewAssignments = useCallback(async () => {
    if (!isOnline) return;

    try {
      const authAxios = createAuthAxios();
      const lastCheckTime = localStorage.getItem("lastAssignmentCheck") || 0;

      // Fetch notifications
      const notificationsResponse = await authAxios.get(
        `${API_ENDPOINTS.notificationEndpoint}?since=${lastCheckTime}`
      );

      if (
        Array.isArray(notificationsResponse.data) &&
        notificationsResponse.data.length > 0
      ) {
        // Filter for assignment notifications
        const assignmentNotifications = notificationsResponse.data.filter(
          (notification) =>
            notification.type === "assignment" ||
            notification.message.includes("assigned")
        );

        if (assignmentNotifications.length > 0) {
          setHasNewAssignments(true);
          setNotifications((prev) =>
            [...assignmentNotifications, ...prev].slice(0, 10)
          ); // Keep last 10 notifications

          // Show notification to user
          if (Notification.permission === "granted") {
            new Notification("New Issue Assigned", {
              body: "You have been assigned a new issue to resolve.",
              icon: "/favicon.ico",
            });
          }
        }
      }

      // Update last check time
      localStorage.setItem("lastAssignmentCheck", Date.now().toString());
    } catch (err) {
      console.error("Error checking for new assignments:", err);
    }
  }, [isOnline, createAuthAxios]);

  // Fetch data from API
  const fetchData = useCallback(async () => {
    if (!auth) {
      setError("Authentication context not available");
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      // Check API availability first
      const isApiAvailable = await checkApiAvailability();

      if (!isApiAvailable) {
        setError(
          "API is currently unavailable. Showing cached data if available."
        );

        // Try to load cached data from localStorage
        try {
          const cachedIssues = localStorage.getItem("lecturer_issues");
          const cachedDashboard = localStorage.getItem("lecturer_dashboard");

          if (cachedIssues) {
            setIssues(JSON.parse(cachedIssues));
          }

          if (cachedDashboard) {
            setDashboardData(JSON.parse(cachedDashboard));
          }
        } catch (e) {
          console.error("Error loading cached data:", e);
        }

        setLoading(false);
        return;
      }

      // API is available, fetch fresh data
      const authAxios = createAuthAxios();

      try {
        // Fetch issues
        const issuesResponse = await authAxios.get(
          API_ENDPOINTS.lecturerIssues
        );

        if (Array.isArray(issuesResponse.data)) {
          // Check if there are new assignments since last fetch
          const previousIssues = JSON.parse(
            localStorage.getItem("lecturer_issues") || "[]"
          );
          const newIssues = issuesResponse.data.filter(
            (newIssue) =>
              !previousIssues.some((oldIssue) => oldIssue.id === newIssue.id)
          );

          if (newIssues.length > 0) {
            setHasNewAssignments(true);
            setSuccessMsg(
              `You have ${newIssues.length} new issue(s) assigned to you.`
            );
          }

          setIssues(issuesResponse.data);
          // Cache issues for offline use
          localStorage.setItem(
            "lecturer_issues",
            JSON.stringify(issuesResponse.data)
          );
        } else {
          console.warn("Issues response is not an array:", issuesResponse.data);
          setIssues([]);
        }
      } catch (err) {
        console.error("Error fetching issues:", err);
        // Try to use cached issues
        const cachedIssues = localStorage.getItem("lecturer_issues");
        if (cachedIssues) {
          setIssues(JSON.parse(cachedIssues));
        }
      }

      try {
        // Fetch dashboard data
        const dashboardResponse = await authAxios.get(
          API_ENDPOINTS.lecturerDashboard
        );
        const dashboardData = dashboardResponse.data.dashboard || {
          total_assigned: 0,
          in_progress_count: 0,
          resolved_count: 0,
        };

        setDashboardData(dashboardData);
        // Cache dashboard data for offline use
        localStorage.setItem(
          "lecturer_dashboard",
          JSON.stringify(dashboardData)
        );
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        // Try to use cached dashboard data
        const cachedDashboard = localStorage.getItem("lecturer_dashboard");
        if (cachedDashboard) {
          setDashboardData(JSON.parse(cachedDashboard));
        }
      }

      // Check for new assignments
      await checkForNewAssignments();

      setLastRefreshed(new Date());
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to fetch data. Please try again later.");

      if (err.response?.status === 401) {
        setError("Your session has expired. Please log in again.");
        handleLogout();
      }
    } finally {
      setLoading(false);
    }
  }, [auth, createAuthAxios, checkForNewAssignments]);

  // Check API availability
  const checkApiAvailability = async () => {
    try {
      const response = await fetch(
        "https://academic-6ea365e4b745.herokuapp.com/api/health-check/",
        {
          method: "GET",
          mode: "cors",
          cache: "no-cache",
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 5000,
        }
      );
      return response.status === 200;
    } catch (error) {
      console.warn("API health check failed:", error.message);
      return false;
    }
  };

  // Initial data loading
  useEffect(() => {
    fetchData();

    // Set up auto-refresh every 2 minutes if online
    const intervalId = setInterval(() => {
      if (isOnline) {
        fetchData();
      }
    }, 120000);

    // Request notification permission
    if (
      Notification.permission !== "granted" &&
      Notification.permission !== "denied"
    ) {
      Notification.requestPermission();
    }

    return () => clearInterval(intervalId);
  }, [fetchData, isOnline]);

  // Handle issue view
  const handleViewIssue = (issueId) => {
    const issue = issues.find((i) => i.id === issueId);
    setSelectedIssue(issue);
    setSelectedTab("issueDetail");
    setFeedback("");

    // Mark as read if it was a new assignment
    if (hasNewAssignments) {
      setHasNewAssignments(false);
    }
  };

  // Handle status update
  const handleStatusUpdate = async (issueId, status) => {
    if (!isOnline) {
      setError("Cannot update issue status while offline");
      return;
    }

    setSubmitting(true);
    setError("");
    setSuccessMsg("");

    try {
      const authAxios = createAuthAxios();

      // Send update to API
      await authAxios.patch(`${API_ENDPOINTS.lecturerIssues}${issueId}/`, {
        status,
        feedback: feedback || `Issue ${status.replace("_", " ")} by lecturer.`,
      });

      // Update local state
      const updatedIssues = issues.map((issue) =>
        issue.id === issueId ? { ...issue, status } : issue
      );

      setIssues(updatedIssues);
      localStorage.setItem("lecturer_issues", JSON.stringify(updatedIssues));

      // Update dashboard counts
      const newDashboard = { ...dashboardData };
      const oldStatus = issues.find((i) => i.id === issueId)?.status;

      // Decrement old status count
      if (oldStatus === "in_progress") {
        newDashboard.in_progress_count = Math.max(
          0,
          newDashboard.in_progress_count - 1
        );
      } else if (oldStatus === "resolved") {
        newDashboard.resolved_count = Math.max(
          0,
          newDashboard.resolved_count - 1
        );
      }

      // Increment new status count
      if (status === "in_progress") {
        newDashboard.in_progress_count += 1;
      } else if (status === "resolved") {
        newDashboard.resolved_count += 1;
      }

      setDashboardData(newDashboard);
      localStorage.setItem("lecturer_dashboard", JSON.stringify(newDashboard));

      // Update selected issue if it's the one being modified
      if (selectedIssue && selectedIssue.id === issueId) {
        setSelectedIssue({ ...selectedIssue, status });
      }

      setSuccessMsg(
        status === "resolved"
          ? "Issue resolved. Emails sent to student and registrar."
          : status === "in_progress"
            ? "Issue set to in progress. Email sent to student."
            : "Issue status updated successfully."
      );

      setFeedback("");

      // Refresh data to ensure everything is in sync
      fetchData();
    } catch (err) {
      console.error("Error updating issue status:", err);
      setError("Failed to update issue status. Please try again.");

      if (err.response?.status === 401) {
        setError("Your session has expired. Please log in again.");
        handleLogout();
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Handle bulk resolve
  const handleBulkResolve = async () => {
    if (!isOnline) {
      setError("Cannot perform bulk resolve while offline");
      return;
    }

    const pendingIssues = issues.filter((issue) => issue.status === "pending");

    if (pendingIssues.length === 0) {
      setError("No pending issues to resolve.");
      return;
    }

    setSubmitting(true);
    setError("");
    setSuccessMsg("");

    try {
      let resolvedCount = 0;

      for (const issue of pendingIssues) {
        try {
          const authAxios = createAuthAxios();

          // Send update to API
          await authAxios.patch(`${API_ENDPOINTS.lecturerIssues}${issue.id}/`, {
            status: "resolved",
            feedback: "Issue resolved in bulk operation by lecturer.",
          });

          resolvedCount++;
        } catch (err) {
          console.error(`Error resolving issue ${issue.id}:`, err);
        }
      }

      setSuccessMsg(
        `Successfully resolved ${resolvedCount} of ${pendingIssues.length} issues.`
      );

      // Refresh data to get updated state
      fetchData();
    } catch (err) {
      console.error("Bulk resolve error:", err);
      setError("Failed to resolve some issues. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Get unique categories and years for filters
  const categories = [
    ...new Set(issues.map((issue) => issue.category).filter(Boolean)),
  ];
  const years = [
    ...new Set(issues.map((issue) => issue.year_of_study).filter(Boolean)),
  ];

  // Filter issues
  const filteredIssues = issues
    .filter((issue) => {
      // Search term filter
      const matchesSearch =
        searchTerm === "" ||
        (issue.course_code || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        (issue.course_name || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        (issue.student?.username || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        (issue.description || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      // Status filter
      const matchesStatus =
        filterStatus === "" || (issue.status || "") === filterStatus;

      // Category filter
      const matchesCategory =
        categoryFilter === "" || (issue.category || "") === categoryFilter;

      // Year filter
      const matchesYear =
        yearFilter === "" || (issue.year_of_study || "") === yearFilter;

      return matchesSearch && matchesStatus && matchesCategory && matchesYear;
    })
    .sort((a, b) => {
      // Sort by the selected field
      if (sortBy === "created_at") {
        return sortOrder === "asc"
          ? new Date(a.created_at || 0) - new Date(b.created_at || 0)
          : new Date(b.created_at || 0) - new Date(a.created_at || 0);
      }

      if (sortBy === "course_code") {
        return sortOrder === "asc"
          ? (a.course_code || "").localeCompare(b.course_code || "")
          : (b.course_code || "").localeCompare(a.course_code || "");
      }

      if (sortBy === "student") {
        return sortOrder === "asc"
          ? (a.student?.username || "").localeCompare(b.student?.username || "")
          : (b.student?.username || "").localeCompare(
              a.student?.username || ""
            );
      }

      if (sortBy === "status") {
        return sortOrder === "asc"
          ? (a.status || "").localeCompare(b.status || "")
          : (b.status || "").localeCompare(a.status || "");
      }

      // Default sort by date
      return sortOrder === "asc"
        ? new Date(a.created_at || 0) - new Date(b.created_at || 0)
        : new Date(b.created_at || 0) - new Date(a.created_at || 0);
    });

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";

    try {
      const date = new Date(dateString);
      return date.toLocaleString();
    } catch (e) {
      return dateString;
    }
  };

  // Render loading state
  if (loading && !issues.length) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading Lecturer Dashboard...</p>
        <button
          onClick={() => window.location.reload()}
          className="btn btn-primary"
        >
          Refresh Page
        </button>
      </div>
    );
  }

  // Main render
  return (
    <div className="lecturer-dashboard">
      <aside className="sidebar">
        <h2 className="sidebar-title">Lecturer Dashboard</h2>
        <ul className="sidebar-nav">
          {["home", "issues", "profile", "logout"].map((tab) => (
            <li
              key={tab}
              onClick={() =>
                tab === "logout" ? handleLogout() : setSelectedTab(tab)
              }
              className={selectedTab === tab ? "active" : ""}
            >
              {tab === "issues" && hasNewAssignments && (
                <span className="notification-badge">New</span>
              )}
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </li>
          ))}
        </ul>
      </aside>

      <main className="main-content">
        {!isOnline && (
          <div className="alert alert-warning">
            <p>
              <strong>You are offline.</strong> Some features may be limited.
              Changes will be synchronized when you're back online.
            </p>
          </div>
        )}

        {successMsg && (
          <div className="alert alert-success">
            <p>{successMsg}</p>
            <button
              onClick={() => setSuccessMsg("")}
              className="alert-close"
              aria-label="Close"
            >
              ×
            </button>
          </div>
        )}

        {error && (
          <div className="alert alert-danger">
            <p>{error}</p>
            <button
              onClick={() => setError("")}
              className="alert-close"
              aria-label="Close"
            >
              ×
            </button>
          </div>
        )}

        {selectedTab === "home" && (
          <div>
            <h1>Lecturer Dashboard</h1>

            <div className="filters-container">
              <button
                onClick={fetchData}
                disabled={loading || !isOnline}
                className="btn btn-primary"
              >
                {loading ? "Refreshing..." : "Refresh Issues"}
              </button>

              <button
                onClick={handleBulkResolve}
                disabled={
                  submitting ||
                  !issues.some((issue) => issue.status === "pending") ||
                  !isOnline
                }
                className="btn btn-secondary"
              >
                {submitting ? "Processing..." : "Bulk Resolve All Pending"}
              </button>
            </div>

            <div className="user-welcome">
              <p>
                Welcome,{" "}
                {auth?.user?.username ||
                  localStorage.getItem("username") ||
                  "Lecturer"}
              </p>
              <p className="text-light">
                Last refreshed: {formatDate(lastRefreshed)}
              </p>
            </div>

            {hasNewAssignments && (
              <div className="alert alert-info">
                <p>
                  <strong>New assignments!</strong> You have new issues assigned
                  to you that need your attention.
                </p>
                <button
                  onClick={() => setSelectedTab("issues")}
                  className="btn btn-primary btn-sm"
                  style={{ marginTop: "10px" }}
                >
                  View Issues
                </button>
              </div>
            )}

            <div className="dashboard-summary">
              <div className="summary-card total">
                <span className="summary-label">Total Assigned</span>
                <span className="summary-value total">
                  {dashboardData.total_assigned || 0}
                </span>
              </div>

              <div className="summary-card in-progress">
                <span className="summary-label">In Progress</span>
                <span className="summary-value in-progress">
                  {dashboardData.in_progress_count || 0}
                </span>
              </div>

              <div className="summary-card resolved">
                <span className="summary-label">Resolved</span>
                <span className="summary-value resolved">
                  {dashboardData.resolved_count || 0}
                </span>
              </div>
            </div>

            <div>
              <h2 className="section-title">Recent Issues</h2>

              {issues.length === 0 ? (
                <div className="card">
                  <p className="text-center">No issues assigned to you yet.</p>
                </div>
              ) : (
                <div className="issues-grid">
                  {issues.slice(0, 4).map((issue) => (
                    <div
                      key={issue.id}
                      className={`issue-card ${issue.status}`}
                    >
                      {issue.isNew && <span className="new-badge">New</span>}
                      <div className="issue-header">
                        <h3 className="issue-title">
                          {issue.course_code || "N/A"}:{" "}
                          {issue.course_name || "N/A"}
                        </h3>
                        <span className={`status-badge ${issue.status}`}>
                          {issue.status?.replace("_", " ") || "Unknown"}
                        </span>
                      </div>

                      <p className="issue-description">
                        {issue.description?.substring(0, 100) ||
                          "No description"}
                        {issue.description?.length > 100 ? "..." : ""}
                      </p>

                      <div className="issue-meta">
                        <span className="student-name">
                          {issue.student?.username || "Unknown"}
                        </span>
                        <button
                          onClick={() => handleViewIssue(issue.id)}
                          className="btn btn-primary btn-sm"
                        >
                          View Details
                        </button>
                      </div>

                      <div className="issue-date">
                        {formatDate(issue.created_at)}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {issues.length > 4 && (
                <div className="text-center mt-4">
                  <button
                    onClick={() => setSelectedTab("issues")}
                    className="btn btn-primary"
                  >
                    View All Issues ({issues.length})
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {selectedTab === "issues" && (
          <div>
            <h1>Manage Issues</h1>

            <div className="filters-container">
              <p>
                Showing {filteredIssues.length} of {issues.length} issues
              </p>

              <div className="filter-actions">
                <button
                  onClick={fetchData}
                  disabled={loading || !isOnline}
                  className="btn btn-primary btn-sm"
                >
                  {loading ? "Refreshing..." : "Refresh"}
                </button>

                <button
                  onClick={handleBulkResolve}
                  disabled={
                    submitting ||
                    !issues.some((issue) => issue.status === "pending") ||
                    !isOnline
                  }
                  className="btn btn-secondary btn-sm"
                >
                  {submitting ? "Processing..." : "Bulk Resolve All"}
                </button>
              </div>
            </div>

            <div className="filters-container">
              <div className="search-box">
                <input
                  type="text"
                  placeholder="Search by course, student, or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="form-control"
                />
              </div>

              <div className="filter-item">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="form-select"
                >
                  <option value="">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>

              <div className="filter-item">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="form-select"
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category.replace("_", " ")}
                    </option>
                  ))}
                </select>
              </div>

              <div className="filter-item">
                <select
                  value={yearFilter}
                  onChange={(e) => setYearFilter(e.target.value)}
                  className="form-select"
                >
                  <option value="">All Years</option>
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year.replace("_", " ")}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="sort-controls">
              <span className="sort-label">Sort by:</span>
              <select
                id="sortBy"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="form-select"
              >
                <option value="created_at">Date</option>
                <option value="status">Status</option>
                <option value="course_code">Course</option>
                <option value="student">Student</option>
              </select>

              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="form-select"
              >
                <option value="desc">Descending</option>
                <option value="asc">Ascending</option>
              </select>
            </div>

            {filteredIssues.length === 0 ? (
              <div className="card">
                <p className="text-center">
                  No issues match your search criteria.
                </p>
              </div>
            ) : (
              <div className="table-container">
                <table className="table">
                  <thead>
                    <tr>
                      {[
                        "ID",
                        "Course",
                        "Student",
                        "Category",
                        "Date Submitted",
                        "Status",
                        "Actions",
                      ].map((header) => (
                        <th key={header}>{header}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredIssues.map((issue) => (
                      <tr key={issue.id} className={issue.status}>
                        <td>{issue.id}</td>
                        <td>
                          {issue.course_code || "N/A"}:{" "}
                          {issue.course_name || "N/A"}
                        </td>
                        <td>{issue.student?.username || "Unknown"}</td>
                        <td>
                          {issue.category?.replace("_", " ") || "Unknown"}
                        </td>
                        <td>{formatDate(issue.created_at)}</td>
                        <td>
                          <span className={`status-badge ${issue.status}`}>
                            {issue.status?.replace("_", " ") || "Unknown"}
                          </span>
                        </td>
                        <td>
                          <button
                            onClick={() => handleViewIssue(issue.id)}
                            className="btn btn-primary btn-sm"
                          >
                            View
                          </button>
                          {issue.status === "pending" && isOnline && (
                            <button
                              onClick={() =>
                                handleStatusUpdate(issue.id, "resolved")
                              }
                              className="btn btn-success btn-sm"
                              style={{ marginLeft: "5px" }}
                            >
                              Quick Resolve
                            </button>
                          )}
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
            <div className="detail-header">
              <button
                onClick={() => setSelectedTab("issues")}
                className="btn btn-outline back-btn"
              >
                ← Back to Issues
              </button>
              <h1>Issue Details</h1>
            </div>

            <div className="detail-section">
              <div className="card-header">
                <h2>
                  {selectedIssue.course_code || "N/A"}:{" "}
                  {selectedIssue.course_name || "N/A"}
                </h2>
                <span className={`status-badge ${selectedIssue.status}`}>
                  {selectedIssue.status?.replace("_", " ") || "Unknown"}
                </span>
              </div>

              <div className="detail-grid">
                <div className="detail-item">
                  <span className="detail-label">Student:</span>
                  <span className="detail-value">
                    {selectedIssue.student?.username || "Unknown"}
                  </span>
                </div>

                <div className="detail-item">
                  <span className="detail-label">Category:</span>
                  <span className="detail-value">
                    {selectedIssue.category?.replace("_", " ") || "Unknown"}
                  </span>
                </div>

                <div className="detail-item">
                  <span className="detail-label">Year of Study:</span>
                  <span className="detail-value">
                    {selectedIssue.year_of_study?.replace("_", " ") ||
                      "Unknown"}
                  </span>
                </div>

                <div className="detail-item">
                  <span className="detail-label">Date Submitted:</span>
                  <span className="detail-value">
                    {formatDate(selectedIssue.created_at)}
                  </span>
                </div>
              </div>
            </div>

            <div className="detail-section">
              <h3>Issue Description</h3>
              <div className="description-box">
                {selectedIssue.description || "No description provided"}
              </div>
            </div>

            <div className="detail-section">
              <h3>Update Status</h3>
              <p>
                When you update an issue status, automatic notifications will be
                sent to the student and registrar.
              </p>

              <div className="form-group">
                <label className="form-label">Feedback</label>
                <textarea
                  placeholder="Enter feedback for this status update..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  disabled={submitting}
                  className="form-textarea"
                />
              </div>

              <div className="status-buttons">
                {["pending", "in_progress", "resolved"].map((status) => (
                  <button
                    key={status}
                    onClick={() => handleStatusUpdate(selectedIssue.id, status)}
                    disabled={
                      selectedIssue.status === status || submitting || !isOnline
                    }
                    className={`status-btn ${status} ${selectedIssue.status === status ? "active" : ""}`}
                  >
                    {status.replace("_", " ").charAt(0).toUpperCase() +
                      status.replace("_", " ").slice(1)}
                  </button>
                ))}
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
                  <span>👨‍🏫</span>
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

// Error Boundary Component
class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null, errorInfo: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught in ErrorBoundary:", error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h2>Something went wrong.</h2>
          <p>{this.state.error?.message || "An unexpected error occurred."}</p>

          <div className="error-actions">
            <button
              onClick={() => window.location.reload()}
              className="btn btn-success"
            >
              Refresh Page
            </button>
            <button
              onClick={() => {
                localStorage.clear();
                window.location.href = "/login";
              }}
              className="btn btn-danger"
            >
              Clear Data & Login
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// Export the component with error boundary
export default function LecturerWithErrorBoundary() {
  return (
    <ErrorBoundary>
      <Lecturer />
    </ErrorBoundary>
  );
}
