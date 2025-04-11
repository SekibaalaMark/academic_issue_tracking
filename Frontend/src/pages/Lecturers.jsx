import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Lecturers.css"; // You'll need to create this CSS file
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

const Lecturer = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState(null);
  const [issues, setIssues] = useState([]);
  const [dashboardData, setDashboardData] = useState({
    total_assigned: 0,
    in_progress_count: 0,
    resolved_count: 0,
  });
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [selectedTab, setSelectedTab] = useState("home");
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Function to fetch lecturer data
  const fetchLecturerData = async (token) => {
    try {
      const [issuesRes, dashboardRes] = await Promise.all([
        axios.get(ENDPOINTS.lecturerIssues, {
          headers: { Authorization: `Token ${token}` },
        }),
        axios.get(ENDPOINTS.lecturerDashboard, {
          headers: { Authorization: `Token ${token}` },
        }),
      ]);
      setIssues(issuesRes.data);
      setDashboardData(dashboardRes.data.dashboard);
    } catch (err) {
      console.error("Error fetching lecturer data:", err);
    }
  };

  // Check authentication and user role on component mount
  useEffect(() => {
    console.log("Lecturers component mounted, user:", user);
    const fetchUserRole = async () => {
      if (!user || !user.token) {
        console.log("No user or token found, redirecting to login");
        navigate("/login");
        setLoading(false);
        setAuthChecked(true);
        return;
      }
      try {
        console.log("Fetching user profile with token:", user.token);
        const response = await axios.get(ENDPOINTS.userProfile, {
          headers: { Authorization: `Token ${user.token}` },
        });
        console.log("User profile response:", response.data);
        const role = response.data.role;
        setUserRole(role);
        // Redirect based on role
        if (role === "academic_registrar" || role === "registrar") {
          console.log("User is registrar, redirecting");
          navigate("/AcademicRegistrar");
          return;
        } else if (role === "student") {
          console.log("User is student, redirecting");
          navigate("/students");
          return;
        } else if (role !== "lecturer") {
          console.log("Unknown role, redirecting to dashboard");
          navigate("/dashboard");
          return;
        }
        // Only fetch lecturer data if user is actually a lecturer
        console.log("User is lecturer, fetching lecturer data");
        await fetchLecturerData(user.token);
      } catch (err) {
        console.error("Error fetching user role:", err);
        console.error("Response data:", err.response?.data);
        console.error("Response status:", err.response?.status);
        if (err.response?.status === 401) {
          console.log("Unauthorized access, logging out");
          logout();
          navigate("/login");
        }
      } finally {
        setLoading(false);
        setAuthChecked(true);
      }
    };

    fetchUserRole();
  }, [user, navigate, logout]);

  // Handle logout function
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Handle view issue
  const handleViewIssue = (issueId) => {
    const issue = issues.find((i) => i.id === issueId);
    setSelectedIssue(issue);
    setSelectedTab("issueDetail");
  };

  // Handle status update
  const handleStatusUpdate = async (issueId, status) => {
    setSubmitting(true);
    setError("");
    setSuccessMsg("");
    try {
      await axios.patch(
        `${ENDPOINTS.lecturerIssues}${issueId}/`,
        { status, feedback: comment },
        {
          headers: {
            Authorization: `Token ${user.token}`,
          },
        }
      );
      setSuccessMessage("Issue updated successfully.");
      // Refresh issues list
      const issuesRes = await axios.get(ENDPOINTS.lecturerIssues, {
        headers: { Authorization: `Token ${user.token}` },
      });
      setIssues(issuesRes.data);
      // Refresh dashboard data
      const dashboardRes = await axios.get(ENDPOINTS.lecturerDashboard, {
        headers: { Authorization: `Token ${user.token}` },
      });
      setDashboardData(dashboardRes.data.dashboard);

      // Update selected issue if we're viewing it
      if (selectedIssue && selectedIssue.id === issueId) {
        const updatedIssue = issuesRes.data.find((i) => i.id === issueId);
        setSelectedIssue(updatedIssue);
      }

      setComment("");
    } catch (err) {
      setError("Failed to update issue. Please try again.");
      console.error("Error updating issue:", err);
    } finally {
      setSubmitting(false);
    }
  };

  // Handle add comment
  const handleAddComment = async (issueId) => {
    if (!comment.trim()) return;

    setSubmitting(true);
    setError("");
    setSuccessMsg("");
    try {
      await axios.post(
        `${ENDPOINTS.lecturerIssues}${issueId}/comment/`,
        { content: comment },
        {
          headers: {
            Authorization: `Token ${user.token}`,
          },
        }
      );
      setSuccessMessage("Comment added successfully.");
      // Refresh the selected issue to show the new comment
      const issueRes = await axios.get(
        `${ENDPOINTS.lecturerIssues}${issueId}/`,
        {
          headers: { Authorization: `Token ${user.token}` },
        }
      );
      setSelectedIssue(issueRes.data);
      setComment("");
    } catch (err) {
      setError("Failed to add comment. Please try again.");
      console.error("Error adding comment:", err);
    } finally {
      setSubmitting(false);
    }
  };

  // Filter issues based on search term and status
  const filteredIssues = issues.filter((issue) => {
    const matchesSearch =
      searchTerm === "" ||
      issue.course_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issue.course_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (issue.student?.first_name + " " + issue.student?.last_name)
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === "" || issue.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  // Show loading state
  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  // If authentication check is complete and no user, redirect to login
  if (authChecked && !user) {
    console.log("Auth checked, no user found, redirecting to login");
    navigate("/login");
    return null;
  }

  // If user role is not lecturer and auth check is complete, return null (already redirected)
  if (authChecked && userRole && userRole !== "lecturer") {
    console.log("User role is not lecturer, already redirected");
    return null;
  }

  return (
    <div className="lecturer-dashboard">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2 className="sidebar-title">Lecturer Dashboard</h2>
        <ul className="sidebar-nav">
          <li
            className={selectedTab === "home" ? "active" : ""}
            onClick={() => setSelectedTab("home")}
          >
            Home
          </li>
          <li
            className={selectedTab === "issues" ? "active" : ""}
            onClick={() => setSelectedTab("issues")}
          >
            Manage Issues
          </li>
          <li
            className={selectedTab === "profile" ? "active" : ""}
            onClick={() => setSelectedTab("profile")}
          >
            Profile
          </li>
          <li onClick={handleLogout}>Logout</li>
        </ul>
      </aside>
      {/* Main Content */}
      <main className="main-content">
        {successMessage && (
          <div className="success-message">
            <p>{successMessage}</p>
          </div>
        )}
        {error && (
          <div className="error-message">
            <p>{error}</p>
          </div>
        )}
        {/* Home Tab */}
        {selectedTab === "home" && (
          <div className="dashboard-home">
            <h1 className="page-title">Lecturer Dashboard</h1>
            <div className="user-welcome">
              <p>Welcome, {localStorage.getItem("username") || "Lecturer"}</p>
            </div>
            <div className="dashboard-summary">
              <div className="summary-item">
                <span className="summary-label">Total Assigned:</span>
                <span className="summary-value">
                  {dashboardData.total_assigned}
                </span>
              </div>
              <div className="summary-item">
                <span className="summary-label">In Progress:</span>
                <span className="summary-value">
                  {dashboardData.in_progress_count}
                </span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Resolved:</span>
                <span className="summary-value">
                  {dashboardData.resolved_count}
                </span>
              </div>
            </div>
            <div className="recent-issues">
              <h2 className="section-title">Recent Issues</h2>
              {issues.length === 0 ? (
                <p className="no-issues">No issues assigned to you yet.</p>
              ) : (
                <div className="issues-grid">
                  {issues.slice(0, 4).map((issue) => (
                    <div
                      key={issue.id}
                      className={`issue-card ${issue.status}`}
                    >
                      <div className="issue-header">
                        <h3>
                          {issue.course_code}: {issue.course_name}
                        </h3>
                        <span className={`status-badge ${issue.status}`}>
                          {issue.status}
                        </span>
                      </div>
                      <p className="issue-description">
                        {issue.description.substring(0, 100)}...
                      </p>
                      <div className="issue-footer">
                        <span className="student-name">
                          {issue.student?.first_name} {issue.student?.last_name}
                        </span>
                        <button
                          className="view-btn"
                          onClick={() => handleViewIssue(issue.id)}
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
                >
                  View All Issues
                </button>
              )}
            </div>
          </div>
        )}
        {/* Issues Management Tab */}
        {selectedTab === "issues" && (
          <div className="issues-management">
            <h1 className="page-title">Manage Issues</h1>
            <div className="filter-container">
              <div className="search-box">
                <input
                  type="text"
                  placeholder="Search issues..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="status-filter">
                <label>Filter by Status:</label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="">All</option>
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>
            </div>
            {filteredIssues.length === 0 ? (
              <div className="no-issues-container">
                <p>No issues found matching your criteria.</p>
              </div>
            ) : (
              <div className="issues-table-container">
                <table className="issues-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Course</th>
                      <th>Student</th>
                      <th>Category</th>
                      <th>Status</th>
                      <th>Last Updated</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredIssues.map((issue) => (
                      <tr key={issue.id} className={issue.status}>
                        <td>{issue.id}</td>
                        <td>
                          <div className="course-info">
                            <span className="course-code">
                              {issue.course_code}
                            </span>
                            <span className="course-name">
                              {issue.course_name}
                            </span>
                          </div>
                        </td>
                        <td>
                          {issue.student?.first_name} {issue.student?.last_name}
                        </td>
                        <td>{issue.category}</td>
                        <td>
                          <span className={`status-badge ${issue.status}`}>
                            {issue.status}
                          </span>
                        </td>
                        <td>
                          {new Date(issue.last_updated).toLocaleDateString()}
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button
                              className="view-btn"
                              onClick={() => handleViewIssue(issue.id)}
                            >
                              View
                            </button>
                            {issue.status === "pending" && (
                              <button
                                className="progress-btn"
                                onClick={() =>
                                  handleStatusUpdate(issue.id, "in_progress")
                                }
                                disabled={submitting}
                              >
                                Start
                              </button>
                            )}
                            {issue.status === "in_progress" && (
                              <button
                                className="resolve-btn"
                                onClick={() =>
                                  handleStatusUpdate(issue.id, "resolved")
                                }
                                disabled={submitting}
                              >
                                Resolve
                              </button>
                            )}
                            {issue.status === "resolved" && (
                              <button
                                className="reopen-btn"
                                onClick={() =>
                                  handleStatusUpdate(issue.id, "in_progress")
                                }
                                disabled={submitting}
                              >
                                Reopen
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
        {/* Issue Detail Tab */}
        {selectedTab === "issueDetail" && selectedIssue && (
          <div className="issue-detail">
            <div className="detail-header">
              <button
                className="back-btn"
                onClick={() => {
                  setSelectedIssue(null);
                  setSelectedTab("issues");
                }}
              >
                ← Back to Issues
              </button>
              <h1 className="page-title">Issue #{selectedIssue.id}</h1>
            </div>
            <div className="issue-detail-container">
              <div className="issue-info">
                <div className="info-header">
                  <h2>
                    {selectedIssue.course_code}: {selectedIssue.course_name}
                  </h2>
                  <span className={`status-badge ${selectedIssue.status}`}>
                    {selectedIssue.status}
                  </span>
                </div>
                <div className="info-section">
                  <h3>Issue Details</h3>
                  <div className="info-grid">
                    <div className="info-item">
                      <span className="info-label">Student:</span>
                      <span className="info-value">
                        {selectedIssue.student?.first_name}{" "}
                        {selectedIssue.student?.last_name}
                      </span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Category:</span>
                      <span className="info-value">
                        {selectedIssue.category}
                      </span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Department:</span>
                      <span className="info-value">
                        {selectedIssue.department?.name}
                      </span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Programme:</span>
                      <span className="info-value">
                        {selectedIssue.programme?.programme_name}
                      </span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Year of Study:</span>
                      <span className="info-value">
                        {selectedIssue.year_of_study}
                      </span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Date Submitted:</span>
                      <span className="info-value">
                        {new Date(
                          selectedIssue.created_at
                        ).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Last Updated:</span>
                      <span className="info-value">
                        {new Date(
                          selectedIssue.last_updated
                        ).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="description-section">
                  <h3>Description</h3>
                  <p className="description-text">
                    {selectedIssue.description}
                  </p>
                </div>
                {selectedIssue.attachment && (
                  <div className="attachment-section">
                    <h3>Attachment</h3>
                    <a
                      href={selectedIssue.attachment}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="attachment-link"
                    >
                      View Attachment
                    </a>
                  </div>
                )}
                <div className="status-actions">
                  <h3>Update Status</h3>
                  <div className="action-buttons">
                    {selectedIssue.status === "pending" && (
                      <button
                        className="progress-btn"
                        onClick={() =>
                          handleStatusUpdate(selectedIssue.id, "in_progress")
                        }
                        disabled={submitting}
                      >
                        Mark as In Progress
                      </button>
                    )}
                    {selectedIssue.status === "in_progress" && (
                      <button
                        className="resolve-btn"
                        onClick={() =>
                          handleStatusUpdate(selectedIssue.id, "resolved")
                        }
                        disabled={submitting}
                      >
                        Mark as Resolved
                      </button>
                    )}
                    {selectedIssue.status === "resolved" && (
                      <button
                        className="reopen-btn"
                        onClick={() =>
                          handleStatusUpdate(selectedIssue.id, "in_progress")
                        }
                        disabled={submitting}
                      >
                        Reopen Issue
                      </button>
                    )}
                  </div>
                </div>
                <div className="comment-section">
                  <h3>Add Comment</h3>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Type your comment here..."
                    rows={4}
                    disabled={submitting}
                  ></textarea>
                  <button
                    className="comment-btn"
                    onClick={() => handleAddComment(selectedIssue.id)}
                    disabled={!comment.trim() || submitting}
                  >
                    {submitting ? "Submitting..." : "Add Comment"}
                  </button>
                </div>
                {/* Comments display would go here if the API supports retrieving comments */}
                {selectedIssue.comments &&
                  selectedIssue.comments.length > 0 && (
                    <div className="comments-list">
                      <h3>Comments</h3>
                      {selectedIssue.comments.map((comment, index) => (
                        <div key={index} className="comment-item">
                          <div className="comment-header">
                            <span className="comment-author">
                              {comment.user?.first_name}{" "}
                              {comment.user?.last_name}
                            </span>
                            <span className="comment-date">
                              {new Date(comment.created_at).toLocaleString()}
                            </span>
                          </div>
                          <p className="comment-content">{comment.content}</p>
                        </div>
                      ))}
                    </div>
                  )}
              </div>
            </div>
          </div>
        )}
        {/* Profile Tab */}
        {selectedTab === "profile" && (
          <div className="profile-section">
            <h1 className="page-title">Lecturer Profile</h1>
            <div className="profile-card">
              <div className="profile-header">
                <div className="profile-avatar">
                  {localStorage.getItem("username")?.charAt(0).toUpperCase() ||
                    "L"}
                </div>
                <div className="profile-name">
                  <h2>{localStorage.getItem("username") || "Lecturer"}</h2>
                  <p className="profile-role">Lecturer</p>
                </div>
              </div>
              <div className="profile-details">
                <div className="profile-item">
                  <span className="profile-label">Email:</span>
                  <span className="profile-value">
                    {user?.email || "Not available"}
                  </span>
                </div>
                <div className="profile-item">
                  <span className="profile-label">Staff ID:</span>
                  <span className="profile-value">
                    {user?.staff_id || "Not available"}
                  </span>
                </div>
                <div className="profile-item">
                  <span className="profile-label">Department:</span>
                  <span className="profile-value">
                    {user?.department || "Not available"}
                  </span>
                </div>
              </div>
              <div className="profile-stats">
                <div className="stat-item">
                  <span className="stat-value">
                    {dashboardData.total_assigned}
                  </span>
                  <span className="stat-label">Total Issues</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">
                    {dashboardData.resolved_count}
                  </span>
                  <span className="stat-label">Resolved</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">
                    {dashboardData.total_assigned > 0
                      ? Math.round(
                          (dashboardData.resolved_count /
                            dashboardData.total_assigned) *
                            100
                        )
                      : 0}
                    %
                  </span>
                  <span className="stat-label">Resolution Rate</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Lecturer;

