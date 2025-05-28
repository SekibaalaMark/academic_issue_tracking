import React, { useState, useEffect, useContext, useCallback } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import "./Lecturers.css";
import { AuthContext } from "@/context/authContext";
import LoadingAnimation from "@/components/LoadingAnimation";

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

const PROGRAMME_CHOICES = [
  {
    value: "computer_science",
    label: "Bachelor of Science in Computer Science",
  },
  {
    value: "software_engineering",
    label: "Bachelor of Science in Software Engineering",
  },
  { value: "BIST", label: "Bachelor Information Systems and Technology" },
  { value: "BLIS", label: "Bachelor of Library and Information Sciences" },
];

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
  const location = useLocation();
  const [issues, setIssues] = useState([]);
  const [filterType, setFilterType] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [dashboardData, setDashboardData] = useState({
    total_assigned: 0,
    in_progress_count: 0,
    resolved_count: 0,
    categories: {
      Missing_Marks: 0,
      Wrong_grading: 0,
      wrong_marks: 0,
      other: 0
    },
    statuses: {
      in_progress: 0,
      resolved: 0
    }
  });
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [selectedTab, setSelectedTab] = useState("home");
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState("");
  const [emailMessage, setEmailMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showAnimation, setShowAnimation] = useState(true);

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

  useEffect(() => {
    // Hide animation after it completes
    const timer = setTimeout(() => {
      setShowAnimation(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

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
        // Sort issues by creation date (newest first)
        const sortedIssues = issuesRes.data.sort((a, b) => 
          new Date(b.created_at) - new Date(a.created_at)
        );
        setIssues(sortedIssues);

        // Calculate category and status counts
        const categoryCounts = {
          Missing_Marks: 0,
          Wrong_grading: 0,
          wrong_marks: 0,
          other: 0
        };
        const statusCounts = {
          in_progress: 0,
          resolved: 0
        };

        sortedIssues.forEach(issue => {
          // Count categories
          if (issue.category) {
            categoryCounts[issue.category] = (categoryCounts[issue.category] || 0) + 1;
          }
          // Count non-pending statuses
          if (issue.status && issue.status !== 'pending') {
            statusCounts[issue.status] = (statusCounts[issue.status] || 0) + 1;
          }
        });

        // Calculate total assigned (all issues assigned to the lecturer)
        const totalAssigned = sortedIssues.length;

        setDashboardData(prevData => ({
          ...prevData,
          total_assigned: totalAssigned,
          categories: categoryCounts,
          statuses: statusCounts
        }));
      }
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
    const interval = setInterval(fetchLecturerData, 300000);
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
          feedback: feedback || "Issue resolved by lecturer.",
        });
        setSuccessMsg("Issue resolved. Emails sent to you, student, and registrar.");
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
        setError("Failed to resolve issue. Please try again.");
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

  // Filter issues
  const filteredIssues = issues.filter((issue) => {
    const matchesType = !filterType || issue.category === filterType;
    const matchesStatus = !filterStatus || issue.status === filterStatus;
    const matchesSearch = !searchTerm || 
      (issue.course_code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
       issue.course_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
       issue.description?.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesType && matchesStatus && matchesSearch;
  });

  // Navigation handlers
  const handleBack = () => {
    navigate(-1);
  };

  const handleForward = () => {
    navigate(1);
  };

  const handleRefresh = () => {
    fetchLecturerData();
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      {showAnimation && <LoadingAnimation />}
      <div className="lecturer-dashboard">
        <aside className="sidebar">
          <h2 className="sidebar-title">
            Lecturer Dashboard
          </h2>
          <ul className="sidebar-nav">
            <li className="active">
              Home
            </li>
            <li onClick={handleLogout}>
              Logout
            </li>
          </ul>
        </aside>

        <main className="main-content">
          <div className="navigation-controls" style={{
            display: 'flex',
            gap: '10px',
            padding: '10px',
            backgroundColor: '#e8f5e9',
            borderRadius: '8px',
            marginBottom: '20px'
          }}>
            <button
              onClick={handleBack}
              className="action-button"
              style={{ backgroundColor: '#2d5a3c' }}
            >
              ← Back
            </button>
            <button
              onClick={handleForward}
              className="action-button"
              style={{ backgroundColor: '#2d5a3c' }}
            >
              Forward →
            </button>
            <button
              onClick={handleRefresh}
              className="action-button"
              style={{ backgroundColor: '#2d5a3c' }}
            >
              ↻ Refresh
            </button>
          </div>

          {successMsg && (
            <div className="success-message">
              <p>{successMsg}</p>
              <button className="close-btn" onClick={() => setSuccessMsg("")}>
                ×
              </button>
            </div>
          )}
          {error && (
            <div className="error-message">
              <p>{error}</p>
              <button className="close-btn" onClick={() => setError("")}>
                ×
              </button>
            </div>
          )}

          <div className="welcome-section">
            <h2 className="welcome-title">
              Welcome back, {user?.username || "Lecturer"}!
            </h2>
            <p className="welcome-message">
              Your expertise is valuable in resolving student academic issues. Review and address the issues assigned to you,
              ensuring each student receives the attention they deserve.
            </p>
          </div>

          <div className="dashboard-summary">
            {/* Status Counters */}
            <div className="summary-item">
              <span className="summary-label">Total Assigned</span>
              <span className="summary-value">{dashboardData.total_assigned}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">In Progress</span>
              <span className="summary-value">{dashboardData.statuses.in_progress}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Resolved</span>
              <span className="summary-value">{dashboardData.statuses.resolved}</span>
            </div>
          </div>

          {/* Category Counters */}
          <div className="category-summary">
            <h3 className="section-title">Issues by Category</h3>
            <div className="dashboard-summary">
              <div className="summary-item">
                <span className="summary-label">Missing Marks</span>
                <span className="summary-value">{dashboardData.categories.Missing_Marks}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Wrong Grading</span>
                <span className="summary-value">{dashboardData.categories.Wrong_grading}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Wrong Marks</span>
                <span className="summary-value">{dashboardData.categories.wrong_marks}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Other</span>
                <span className="summary-value">{dashboardData.categories.other}</span>
              </div>
            </div>
          </div>

          <div className="filter-container">
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem',
              alignItems: 'end'
            }}>
              <div>
                <label>Issue Category</label>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                >
                  <option value="">All Categories</option>
                  <option value="Missing_Marks">Missing Marks</option>
                  <option value="Wrong_grading">Wrong Grading</option>
                  <option value="wrong_marks">Wrong Marks</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label>Status</label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>

              <div>
                <label>Search</label>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by course or description..."
                />
              </div>
            </div>
          </div>

          <div className="issues-list">
            <h2>
              <span>Issues ({filteredIssues.length})</span>
              <button
                onClick={fetchLecturerData}
                className="action-button"
              >
                Refresh Issues
              </button>
            </h2>

            {filteredIssues.length === 0 ? (
              <div className="no-issues">
                <p>No issues match your filter criteria.</p>
              </div>
            ) : (
              <div className="issues-grid">
                {filteredIssues.map((issue) => (
                  <div
                    key={issue.id}
                    className={`issue-card ${issue.status || ""}`}
                  >
                    <div className="issue-header">
                      <h3>{issue.course_code || "N/A"}: {issue.course_name || "Unknown Course"}</h3>
                      <span className={`status-badge ${issue.status || ""}`}>
                        {(issue.status || "unknown").replace("_", " ")}
                      </span>
                    </div>

                    <div className="issue-meta">
                      <div className="meta-item">
                        <span className="meta-label">Programme</span>
                        <span className="meta-value">
                          {PROGRAMME_CHOICES.find(prog => prog.value === issue.programme)?.label || issue.programme || "Not specified"}
                        </span>
                      </div>
                      <div className="meta-item">
                        <span className="meta-label">Category</span>
                        <span className="meta-value">
                          {issue.category?.replace(/_/g, ' ') || 'Not specified'}
                        </span>
                      </div>
                    </div>

                    <div className="issue-description">
                      {issue.description || "No description provided"}
                    </div>

                    <div className="issue-meta">
                      <div className="meta-item">
                        <span className="meta-label">Student</span>
                        <span className="meta-value">
                          {formatStudent(issue.student) || "Unknown Student"}
                        </span>
                      </div>
                      <div className="meta-item">
                        <span className="meta-label">Submitted</span>
                        <span className="meta-value">
                          {issue.created_at ? new Date(issue.created_at).toLocaleString() : "N/A"}
                        </span>
                      </div>
                    </div>

                    {issue.attachment && (
                      <div className="attachment-section">
                        <a 
                          href={issue.attachment}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="attachment-link"
                        >
                          📎 View Attachment
                        </a>
                      </div>
                    )}

                    <div className="issue-footer">
                      {issue.status !== "resolved" && (
                        <button
                          onClick={() => handleStatusUpdate(issue.id, "resolved")}
                          className="action-button resolve"
                          disabled={submitting}
                        >
                          {submitting ? "Resolving..." : "Resolve Issue"}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </ErrorBoundary>
  );
};

export default Lecturer;
