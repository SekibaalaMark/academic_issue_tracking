"use client";

import React, { useState, useEffect, useContext, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "@/context/authContext";

// API endpoints
const API_ENDPOINTS = {
  lecturerIssues: "/lecturer-issue-management/",
  lecturerDashboard: "/lecturer-dashboard/",
  lecturerProfile: "/lecturer-profile/",
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

  // Fetch data from API
  const fetchData = useCallback(async () => {
    if (!auth || !auth.createAuthAxios) {
      setError("Authentication context not available");
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      // Check API availability first
      const isApiAvailable = await auth.checkApiAvailability();

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
      const authAxios = auth.createAuthAxios();

      try {
        // Fetch issues
        const issuesResponse = await authAxios.get(
          API_ENDPOINTS.lecturerIssues
        );
        if (Array.isArray(issuesResponse.data)) {
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
  }, [auth]);

  // Initial data loading
  useEffect(() => {
    fetchData();

    // Set up auto-refresh every 2 minutes if online
    const intervalId = setInterval(() => {
      if (isOnline && auth?.apiAvailable) {
        fetchData();
      }
    }, 120000);

    return () => clearInterval(intervalId);
  }, [fetchData, isOnline, auth]);

  // Handle issue view
  const handleViewIssue = (issueId) => {
    const issue = issues.find((i) => i.id === issueId);
    setSelectedIssue(issue);
    setSelectedTab("issueDetail");
  };

  // Handle status update
  const handleStatusUpdate = async (issueId, status) => {
    if (!auth || !auth.createAuthAxios) {
      setError("Authentication context not available");
      return;
    }

    if (!auth.apiAvailable) {
      setError("Cannot update issue status while API is unavailable");
      return;
    }

    setSubmitting(true);
    setError("");
    setSuccessMsg("");

    try {
      const authAxios = auth.createAuthAxios();

      // Send update to API
      await authAxios.patch(`${API_ENDPOINTS.lecturerIssues}${issueId}/`, {
        status,
        feedback: `Issue ${status.replace("_", " ")} by lecturer.`,
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
        `Issue ${status}. Automatic emails sent to student and registrar.`
      );

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
    if (!auth || !auth.apiAvailable) {
      setError("Cannot perform bulk resolve while API is unavailable");
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
          const authAxios = auth.createAuthAxios();

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
      <div style={{ textAlign: "center", padding: "50px" }}>
        <p>Loading Lecturer Dashboard...</p>
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
          Refresh Page
        </button>
      </div>
    );
  }

  // Main render
  return (
    <div className="lecturer-dashboard">
      <aside
        className="sidebar"
        style={{
          backgroundColor: "#f4f4f4",
          padding: "20px",
          width: "200px",
          height: "100vh",
          position: "fixed",
        }}
      >
        <h2 style={{ color: "#1A1A1A", marginBottom: "20px" }}>
          Lecturer Dashboard
        </h2>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {["home", "issues", "profile", "logout"].map((tab) => (
            <li
              key={tab}
              onClick={() =>
                tab === "logout" ? handleLogout() : setSelectedTab(tab)
              }
              style={{
                color: selectedTab === tab ? "#008000" : "#1A1A1A",
                cursor: "pointer",
                padding: "10px",
                marginBottom: "5px",
                backgroundColor:
                  selectedTab === tab ? "#e6f7e6" : "transparent",
                borderRadius: "5px",
              }}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </li>
          ))}
        </ul>
      </aside>

      <main style={{ marginLeft: "220px", padding: "20px" }}>
        {!isOnline && (
          <div
            style={{
              backgroundColor: "#ff9900",
              color: "#fff",
              padding: "10px",
              borderRadius: "5px",
              marginBottom: "15px",
            }}
          >
            <p style={{ margin: 0 }}>
              <strong>You are offline.</strong> Some features may be limited.
              Changes will be synchronized when you're back online.
            </p>
          </div>
        )}

        {isOnline && !auth?.apiAvailable && (
          <div
            style={{
              backgroundColor: "#ff9900",
              color: "#fff",
              padding: "10px",
              borderRadius: "5px",
              marginBottom: "15px",
            }}
          >
            <p style={{ margin: 0 }}>
              <strong>API is currently unavailable.</strong> Showing cached
              data. Some features may be limited.
            </p>
          </div>
        )}

        {successMsg && (
          <div
            style={{
              backgroundColor: "#008000",
              color: "#fff",
              padding: "10px",
              borderRadius: "5px",
              position: "relative",
              marginBottom: "15px",
            }}
          >
            <p>{successMsg}</p>
            <button
              onClick={() => setSuccessMsg("")}
              style={{
                position: "absolute",
                top: "5px",
                right: "10px",
                color: "#fff",
                background: "none",
                border: "none",
                fontSize: "18px",
                cursor: "pointer",
              }}
            >
              ×
            </button>
          </div>
        )}

        {error && (
          <div
            style={{
              backgroundColor: "#ff0000",
              color: "#fff",
              padding: "10px",
              borderRadius: "5px",
              position: "relative",
              marginBottom: "15px",
            }}
          >
            <p>{error}</p>
            <button
              onClick={() => setError("")}
              style={{
                position: "absolute",
                top: "5px",
                right: "10px",
                color: "#fff",
                background: "none",
                border: "none",
                fontSize: "18px",
                cursor: "pointer",
              }}
            >
              ×
            </button>
          </div>
        )}

        {selectedTab === "home" && (
          <div>
            <h1 style={{ marginBottom: "20px" }}>Lecturer Dashboard</h1>

            <div
              style={{
                display: "flex",
                gap: "10px",
                marginBottom: "20px",
                flexWrap: "wrap",
              }}
            >
              <button
                onClick={fetchData}
                disabled={loading || !isOnline || !auth?.apiAvailable}
                style={{
                  backgroundColor: "#008000",
                  color: "#fff",
                  padding: "10px 20px",
                  borderRadius: "5px",
                  border: "none",
                  opacity:
                    loading || !isOnline || !auth?.apiAvailable ? 0.7 : 1,
                  cursor:
                    loading || !isOnline || !auth?.apiAvailable
                      ? "not-allowed"
                      : "pointer",
                }}
              >
                {loading ? "Refreshing..." : "Refresh Issues"}
              </button>

              <button
                onClick={handleBulkResolve}
                disabled={
                  submitting ||
                  !issues.some((issue) => issue.status === "pending") ||
                  !isOnline ||
                  !auth?.apiAvailable
                }
                style={{
                  backgroundColor: "#8800cc",
                  color: "#fff",
                  padding: "10px 20px",
                  borderRadius: "5px",
                  border: "none",
                  opacity:
                    submitting ||
                    !issues.some((issue) => issue.status === "pending") ||
                    !isOnline ||
                    !auth?.apiAvailable
                      ? 0.7
                      : 1,
                  cursor:
                    submitting ||
                    !issues.some((issue) => issue.status === "pending") ||
                    !isOnline ||
                    !auth?.apiAvailable
                      ? "not-allowed"
                      : "pointer",
                }}
              >
                {submitting ? "Processing..." : "Bulk Resolve All Pending"}
              </button>
            </div>

            <div style={{ marginBottom: "20px" }}>
              <p>
                Welcome,{" "}
                {auth?.user?.username ||
                  localStorage.getItem("username") ||
                  "Lecturer"}
              </p>
              <p style={{ color: "#666", fontSize: "14px" }}>
                Last refreshed: {formatDate(lastRefreshed)}
              </p>
            </div>

            <div
              style={{
                display: "flex",
                gap: "20px",
                marginBottom: "30px",
                flexWrap: "wrap",
              }}
            >
              {[
                {
                  label: "Total Assigned",
                  value: dashboardData.total_assigned || 0,
                  color: "#0066cc",
                },
                {
                  label: "In Progress",
                  value: dashboardData.in_progress_count || 0,
                  color: "#ff9900",
                },
                {
                  label: "Resolved",
                  value: dashboardData.resolved_count || 0,
                  color: "#008000",
                },
              ].map(({ label, value, color }) => (
                <div
                  key={label}
                  style={{
                    backgroundColor: "#fff",
                    padding: "15px",
                    borderRadius: "5px",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                    minWidth: "150px",
                    borderLeft: `4px solid ${color}`,
                  }}
                >
                  <span style={{ color: "#1A1A1A" }}>{label}:</span>
                  <span
                    style={{
                      color,
                      fontWeight: "bold",
                      fontSize: "24px",
                      display: "block",
                    }}
                  >
                    {value}
                  </span>
                </div>
              ))}
            </div>

            <div>
              <h2 style={{ marginBottom: "15px" }}>Recent Issues</h2>

              {issues.length === 0 ? (
                <p
                  style={{
                    padding: "20px",
                    backgroundColor: "#f9f9f9",
                    borderRadius: "5px",
                    textAlign: "center",
                  }}
                >
                  No issues assigned to you yet.
                </p>
              ) : (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fill, minmax(300px, 1fr))",
                    gap: "15px",
                  }}
                >
                  {issues.slice(0, 4).map((issue) => (
                    <div
                      key={issue.id}
                      style={{
                        backgroundColor:
                          issue.status === "pending" ? "#fff8e6" : "#fff",
                        padding: "15px",
                        borderRadius: "5px",
                        border: "1px solid #ddd",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: "10px",
                        }}
                      >
                        <h3 style={{ margin: 0, fontSize: "16px" }}>
                          {issue.course_code || "N/A"}:{" "}
                          {issue.course_name || "N/A"}
                        </h3>
                        <span
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
                            fontSize: "12px",
                            fontWeight: "bold",
                          }}
                        >
                          {issue.status?.replace("_", " ") || "Unknown"}
                        </span>
                      </div>

                      <p style={{ margin: "10px 0", fontSize: "14px" }}>
                        {issue.description?.substring(0, 100) ||
                          "No description"}
                        {issue.description?.length > 100 ? "..." : ""}
                      </p>

                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginTop: "15px",
                        }}
                      >
                        <span style={{ color: "#666", fontSize: "13px" }}>
                          {issue.student?.username || "Unknown"}
                        </span>
                        <button
                          onClick={() => handleViewIssue(issue.id)}
                          style={{
                            backgroundColor: "#008000",
                            color: "#fff",
                            padding: "8px 15px",
                            borderRadius: "5px",
                            border: "none",
                            cursor: "pointer",
                            fontSize: "13px",
                          }}
                        >
                          View Details
                        </button>
                      </div>

                      <div
                        style={{
                          fontSize: "12px",
                          color: "#888",
                          marginTop: "10px",
                          textAlign: "right",
                        }}
                      >
                        {formatDate(issue.created_at)}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {issues.length > 4 && (
                <div style={{ marginTop: "20px", textAlign: "center" }}>
                  <button
                    onClick={() => setSelectedTab("issues")}
                    style={{
                      backgroundColor: "#008000",
                      color: "#fff",
                      padding: "10px 20px",
                      borderRadius: "5px",
                      border: "none",
                      cursor: "pointer",
                    }}
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
            <h1 style={{ marginBottom: "20px" }}>Manage Issues</h1>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "15px",
                flexWrap: "wrap",
                gap: "10px",
              }}
            >
              <p style={{ margin: 0 }}>
                Showing {filteredIssues.length} of {issues.length} issues
              </p>

              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  onClick={fetchData}
                  disabled={loading || !isOnline || !auth?.apiAvailable}
                  style={{
                    backgroundColor: "#008000",
                    color: "#fff",
                    padding: "8px 15px",
                    borderRadius: "5px",
                    border: "none",
                    opacity:
                      loading || !isOnline || !auth?.apiAvailable ? 0.7 : 1,
                    cursor:
                      loading || !isOnline || !auth?.apiAvailable
                        ? "not-allowed"
                        : "pointer",
                  }}
                >
                  {loading ? "Refreshing..." : "Refresh"}
                </button>

                <button
                  onClick={handleBulkResolve}
                  disabled={
                    submitting ||
                    !issues.some((issue) => issue.status === "pending") ||
                    !isOnline ||
                    !auth?.apiAvailable
                  }
                  style={{
                    backgroundColor: "#8800cc",
                    color: "#fff",
                    padding: "8px 15px",
                    borderRadius: "5px",
                    border: "none",
                    opacity:
                      submitting ||
                      !issues.some((issue) => issue.status === "pending") ||
                      !isOnline ||
                      !auth?.apiAvailable
                        ? 0.7
                        : 1,
                    cursor:
                      submitting ||
                      !issues.some((issue) => issue.status === "pending") ||
                      !isOnline ||
                      !auth?.apiAvailable
                        ? "not-allowed"
                        : "pointer",
                  }}
                >
                  {submitting ? "Processing..." : "Bulk Resolve All"}
                </button>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                gap: "10px",
                marginBottom: "20px",
                flexWrap: "wrap",
              }}
            >
              <div style={{ flex: 1, minWidth: "200px" }}>
                <input
                  type="text"
                  placeholder="Search by course, student, or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "5px",
                    border: "1px solid #ddd",
                  }}
                />
              </div>

              <div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  style={{
                    padding: "10px",
                    borderRadius: "5px",
                    border: "1px solid #ddd",
                  }}
                >
                  <option value="">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>

              <div>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  style={{
                    padding: "10px",
                    borderRadius: "5px",
                    border: "1px solid #ddd",
                  }}
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category.replace("_", " ")}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <select
                  value={yearFilter}
                  onChange={(e) => setYearFilter(e.target.value)}
                  style={{
                    padding: "10px",
                    borderRadius: "5px",
                    border: "1px solid #ddd",
                  }}
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

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginBottom: "10px",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <label htmlFor="sortBy">Sort by:</label>
                <select
                  id="sortBy"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  style={{
                    padding: "8px",
                    borderRadius: "5px",
                    border: "1px solid #ddd",
                  }}
                >
                  <option value="created_at">Date</option>
                  <option value="status">Status</option>
                  <option value="course_code">Course</option>
                  <option value="student">Student</option>
                </select>

                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  style={{
                    padding: "8px",
                    borderRadius: "5px",
                    border: "1px solid #ddd",
                  }}
                >
                  <option value="desc">Descending</option>
                  <option value="asc">Ascending</option>
                </select>
              </div>
            </div>

            {filteredIssues.length === 0 ? (
              <p
                style={{
                  padding: "20px",
                  backgroundColor: "#f9f9f9",
                  borderRadius: "5px",
                  textAlign: "center",
                }}
              >
                No issues match your search criteria.
              </p>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                  }}
                >
                  <thead>
                    <tr style={{ backgroundColor: "#f4f4f4" }}>
                      {[
                        "ID",
                        "Course",
                        "Student",
                        "Category",
                        "Date Submitted",
                        "Status",
                        "Actions",
                      ].map((header) => (
                        <th
                          key={header}
                          style={{
                            padding: "10px",
                            border: "1px solid #ddd",
                            textAlign: "left",
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
                        style={{
                          backgroundColor:
                            issue.status === "pending" ? "#fff8e6" : "#fff",
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
                          {issue.course_code || "N/A"}:{" "}
                          {issue.course_name || "N/A"}
                        </td>
                        <td
                          style={{ padding: "10px", border: "1px solid #ddd" }}
                        >
                          {issue.student?.username || "Unknown"}
                        </td>
                        <td
                          style={{ padding: "10px", border: "1px solid #ddd" }}
                        >
                          {issue.category?.replace("_", " ") || "Unknown"}
                        </td>
                        <td
                          style={{ padding: "10px", border: "1px solid #ddd" }}
                        >
                          {formatDate(issue.created_at)}
                        </td>
                        <td
                          style={{ padding: "10px", border: "1px solid #ddd" }}
                        >
                          <span
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
                              fontSize: "12px",
                              fontWeight: "bold",
                              display: "inline-block",
                            }}
                          >
                            {issue.status?.replace("_", " ") || "Unknown"}
                          </span>
                        </td>
                        <td
                          style={{ padding: "10px", border: "1px solid #ddd" }}
                        >
                          <button
                            onClick={() => handleViewIssue(issue.id)}
                            style={{
                              backgroundColor: "#008000",
                              color: "#fff",
                              padding: "8px 15px",
                              borderRadius: "5px",
                              border: "none",
                              cursor: "pointer",
                            }}
                          >
                            View
                          </button>
                          {issue.status === "pending" &&
                            isOnline &&
                            auth?.apiAvailable && (
                              <button
                                onClick={() =>
                                  handleStatusUpdate(issue.id, "resolved")
                                }
                                style={{
                                  backgroundColor: "#0066cc",
                                  color: "#fff",
                                  padding: "8px 15px",
                                  borderRadius: "5px",
                                  border: "none",
                                  marginLeft: "5px",
                                  cursor: "pointer",
                                }}
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
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "20px",
              }}
            >
              <button
                onClick={() => setSelectedTab("issues")}
                style={{
                  backgroundColor: "#008000",
                  color: "#fff",
                  padding: "8px 15px",
                  borderRadius: "5px",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                ← Back to Issues
              </button>
              <h1 style={{ margin: 0 }}>Issue Details</h1>
            </div>

            <div>
              <div
                style={{
                  backgroundColor: "#fff",
                  padding: "20px",
                  borderRadius: "5px",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  marginBottom: "20px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    flexWrap: "wrap",
                    gap: "10px",
                  }}
                >
                  <h2 style={{ margin: "0 0 15px 0" }}>
                    {selectedIssue.course_code || "N/A"}:{" "}
                    {selectedIssue.course_name || "N/A"}
                  </h2>
                  <span
                    style={{
                      backgroundColor:
                        selectedIssue.status === "resolved"
                          ? "#008000"
                          : selectedIssue.status === "pending"
                            ? "#ff9900"
                            : "#0066cc",
                      color: "#fff",
                      padding: "5px 15px",
                      borderRadius: "12px",
                      fontSize: "14px",
                      fontWeight: "bold",
                    }}
                  >
                    {selectedIssue.status?.replace("_", " ") || "Unknown"}
                  </span>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                    gap: "15px",
                    marginTop: "20px",
                  }}
                >
                  <div>
                    <span
                      style={{
                        color: "#666",
                        fontSize: "14px",
                        display: "block",
                      }}
                    >
                      Student:
                    </span>
                    <span style={{ fontWeight: "bold" }}>
                      {selectedIssue.student?.username || "Unknown"}
                    </span>
                  </div>

                  <div>
                    <span
                      style={{
                        color: "#666",
                        fontSize: "14px",
                        display: "block",
                      }}
                    >
                      Category:
                    </span>
                    <span style={{ fontWeight: "bold" }}>
                      {selectedIssue.category?.replace("_", " ") || "Unknown"}
                    </span>
                  </div>

                  <div>
                    <span
                      style={{
                        color: "#666",
                        fontSize: "14px",
                        display: "block",
                      }}
                    >
                      Year of Study:
                    </span>
                    <span style={{ fontWeight: "bold" }}>
                      {selectedIssue.year_of_study?.replace("_", " ") ||
                        "Unknown"}
                    </span>
                  </div>

                  <div>
                    <span
                      style={{
                        color: "#666",
                        fontSize: "14px",
                        display: "block",
                      }}
                    >
                      Date Submitted:
                    </span>
                    <span style={{ fontWeight: "bold" }}>
                      {formatDate(selectedIssue.created_at)}
                    </span>
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: "20px" }}>
                <h3 style={{ marginBottom: "10px" }}>Issue Description</h3>
                <p
                  style={{
                    backgroundColor: "#fff",
                    padding: "15px",
                    borderRadius: "5px",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                    lineHeight: "1.6",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {selectedIssue.description || "No description provided"}
                </p>
              </div>

              <div style={{ marginTop: "20px" }}>
                <h3 style={{ marginBottom: "10px" }}>Update Status</h3>
                <p style={{ color: "#666", marginBottom: "15px" }}>
                  When you update an issue status, automatic notifications will
                  be sent to the student and registrar.
                </p>
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                  {["pending", "in_progress", "resolved"].map((status) => (
                    <button
                      key={status}
                      onClick={() =>
                        handleStatusUpdate(selectedIssue.id, status)
                      }
                      disabled={
                        selectedIssue.status === status ||
                        submitting ||
                        !isOnline ||
                        !auth?.apiAvailable
                      }
                      style={{
                        backgroundColor:
                          selectedIssue.status === status
                            ? "#ccc"
                            : status === "resolved"
                              ? "#008000"
                              : status === "pending"
                                ? "#ff9900"
                                : "#0066cc",
                        color: "#fff",
                        padding: "12px 25px",
                        borderRadius: "5px",
                        border: "none",
                        opacity:
                          selectedIssue.status === status ||
                          submitting ||
                          !isOnline ||
                          !auth?.apiAvailable
                            ? 0.6
                            : 1,
                        cursor:
                          selectedIssue.status === status ||
                          submitting ||
                          !isOnline ||
                          !auth?.apiAvailable
                            ? "not-allowed"
                            : "pointer",
                        fontWeight: "bold",
                        fontSize: "14px",
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
            <h1 style={{ marginBottom: "20px" }}>Lecturer Profile</h1>
            <div
              style={{
                backgroundColor: "#fff",
                padding: "30px",
                borderRadius: "5px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                maxWidth: "600px",
                margin: "0 auto",
              }}
            >
              <h2 style={{ marginBottom: "20px" }}>
                {auth?.user?.name ||
                  auth?.user?.username ||
                  localStorage.getItem("username") ||
                  "Lecturer"}
              </h2>
              <div>
                <div
                  style={{
                    display: "flex",
                    margin: "15px 0",
                    borderBottom: "1px solid #eee",
                    paddingBottom: "15px",
                  }}
                >
                  <span
                    style={{
                      width: "150px",
                      fontWeight: "bold",
                    }}
                  >
                    Email:
                  </span>
                  <span>{auth?.user?.email || "Not available"}</span>
                </div>
                <div
                  style={{
                    display: "flex",
                    margin: "15px 0",
                    borderBottom: "1px solid #eee",
                    paddingBottom: "15px",
                  }}
                >
                  <span
                    style={{
                      width: "150px",
                      fontWeight: "bold",
                    }}
                  >
                    Username:
                  </span>
                  <span>
                    {auth?.user?.username ||
                      localStorage.getItem("username") ||
                      "Not available"}
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    margin: "15px 0",
                    borderBottom: "1px solid #eee",
                    paddingBottom: "15px",
                  }}
                >
                  <span
                    style={{
                      width: "150px",
                      fontWeight: "bold",
                    }}
                  >
                    Role:
                  </span>
                  <span>
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
                  <div
                    style={{
                      display: "flex",
                      margin: "15px 0",
                      borderBottom: "1px solid #eee",
                      paddingBottom: "15px",
                    }}
                  >
                    <span
                      style={{
                        width: "150px",
                        fontWeight: "bold",
                      }}
                    >
                      Staff ID:
                    </span>
                    <span>{auth.user.staff_id}</span>
                  </div>
                )}
              </div>
              <div style={{ marginTop: "30px", textAlign: "center" }}>
                <button
                  onClick={handleLogout}
                  style={{
                    backgroundColor: "#ff0000",
                    color: "#fff",
                    padding: "10px 20px",
                    borderRadius: "5px",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
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
        <div
          style={{
            padding: "20px",
            textAlign: "center",
            maxWidth: "800px",
            margin: "0 auto",
            backgroundColor: "#fff8f8",
            border: "1px solid #ffcccc",
            borderRadius: "5px",
          }}
        >
          <h2 style={{ color: "#cc0000" }}>Something went wrong.</h2>
          <p>{this.state.error?.message || "An unexpected error occurred."}</p>

          <div style={{ marginTop: "20px" }}>
            <button
              onClick={() => window.location.reload()}
              style={{
                backgroundColor: "#008000",
                color: "#fff",
                padding: "10px 20px",
                borderRadius: "5px",
                border: "none",
                marginRight: "10px",
              }}
            >
              Refresh Page
            </button>
            <button
              onClick={() => {
                localStorage.clear();
                window.location.href = "/login";
              }}
              style={{
                backgroundColor: "#cc0000",
                color: "#fff",
                padding: "10px 20px",
                borderRadius: "5px",
                border: "none",
              }}
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
