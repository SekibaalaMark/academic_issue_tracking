import { useState, useEffect } from "react";
import { FaSignOutAlt, FaUser } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import { FaFileAlt } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Use React Router's navigation
// import "./student-dashboard.css";

// Create axios instance with base URL
const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
});

// Add request interceptor to include auth token in all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Issue related API calls
const issueService = {
  // Get all issues for the current user
  getIssues: async () => {
    try {
      const response = await api.get("/issues/");
      return response.data;
    } catch (error) {
      console.error("Error fetching issues:", error);
      throw error;
    }
  },
  // Get a single issue by ID
  getIssueById: async (id) => {
    try {
      const response = await api.get(`/issues/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching issue ${id}:`, error);
      throw error;
    }
  },
  // Create a new issue
  createIssue: async (issueData) => {
    try {
      const response = await api.post("/issues/", issueData);
      return response.data;
    } catch (error) {
      console.error("Error creating issue:", error);
      throw error;
    }
  },
  // Update an existing issue
  updateIssue: async (id, issueData) => {
    try {
      const response = await api.put(`/issues/${id}/`, issueData);
      return response.data;
    } catch (error) {
      console.error(`Error updating issue ${id}:`, error);
      throw error;
    }
  },
};

// User related API calls
const userService = {
  // Get current user profile
  getProfile: async () => {
    try {
      const response = await api.get("/profile/");
      return response.data;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      throw error;
    }
  },
  // Logout user
  logout: async () => {
    try {
      localStorage.removeItem("authToken");
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("userRole");
      // Optional: call backend logout endpoint if needed
      // await api.post('/auth/logout/');
      return true;
    } catch (error) {
      console.error("Error during logout:", error);
      throw error;
    }
  },
};

// Simple UI components
const Card = ({ className = "", children, ...props }) => (
  <div className={`card ${className}`} {...props}>
    {children}
  </div>
);

const CardHeader = ({ className = "", children, ...props }) => (
  <div className={`card-header ${className}`} {...props}>
    {children}
  </div>
);

const CardTitle = ({ className = "", children, ...props }) => (
  <h3 className={`card-title ${className}`} {...props}>
    {children}
  </h3>
);

const CardContent = ({ className = "", children, ...props }) => (
  <div className={`card-content ${className}`} {...props}>
    {children}
  </div>
);

const Button = ({
  children,
  variant = "default",
  className = "",
  ...props
}) => {
  const variantClass = variant ? `btn-${variant}` : "";
  return (
    <button className={`btn ${variantClass} ${className}`} {...props}>
      {children}
    </button>
  );
};

const Badge = ({ variant = "default", className = "", children, ...props }) => {
  const variantClass = variant ? `badge-${variant}` : "";
  return (
    <div className={`badge ${variantClass} ${className}`} {...props}>
      {children}
    </div>
  );
};

// Loading spinner component
const LoadingSpinner = () => (
  <div className="loading-spinner-container">
    <div className="loading-spinner"></div>
    <p>Loading...</p>
  </div>
);

// Error message component
const ErrorMessage = ({ message }) => (
  <div className="error-message">
    <p>{message}</p>
    <Button variant="primary" onClick={() => window.location.reload()}>
      Try Again
    </Button>
  </div>
);

export default function StudentDashboard() {
  const navigate = useNavigate(); // Use React Router's navigate
  const [activeTab, setActiveTab] = useState("dashboard");
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userProfile, setUserProfile] = useState(null);

  // Fetch issues from the backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch issues
        const issuesData = await issueService.getIssues();
        setIssues(issuesData);
        // Fetch user profile
        const profileData = await userService.getProfile();
        setUserProfile(profileData);
        setError("");
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Handle logout
  const handleLogout = async () => {
    try {
      await userService.logout();
      navigate("/login"); // Use React Router's navigate
    } catch (err) {
      console.error("Logout failed:", err);
      // Still redirect even if the API call fails
      navigate("/login");
    }
  };

  // Calculate issue counts
  const totalIssues = issues.length;
  const pendingCount = issues.filter((i) => i.status === "pending").length;
  const inProgressCount = issues.filter(
    (i) => i.status === "in_progress"
  ).length;
  const resolvedCount = issues.filter((i) => i.status === "resolved").length;

  // Status badge color mapping
  const statusColors = {
    pending: "badge-status-pending",
    in_progress: "badge-status-in-progress",
    resolved: "badge-status-resolved",
  };

  // Status display names
  const statusNames = {
    pending: "Pending",
    in_progress: "In Progress",
    resolved: "Resolved",
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <h2 className="sidebar-title">Issue Tracker</h2>
        </div>
        <nav className="sidebar-nav">
          <div className="sidebar-nav-items">
            <Button
              variant={activeTab === "dashboard" ? "secondary" : "ghost"}
              className="sidebar-nav-button"
              onClick={() => setActiveTab("dashboard")}
              data-active={activeTab === "dashboard"}
            >
              <MdDashboard className="sidebar-icon" />
              <span>Dashboard</span>
            </Button>
            <Button
              variant={activeTab === "issues" ? "secondary" : "default"}
              className="sidebar-nav-button"
              onClick={() => setActiveTab("issues")}
              data-active={activeTab === "issues"}
            >
              <FaFileAlt className="sidebar-icon" />
              <span>All Issues</span>
            </Button>
          </div>
        </nav>
        <div className="sidebar-footer">
          <Button
            variant="default"
            className="logout-button"
            onClick={handleLogout}
          >
            <FaSignOutAlt className="sidebar-icon" />
            <span>Log Out</span>
          </Button>
        </div>
      </div>
      {/* Main Content */}
      <div className="main-content">
        <header className="main-header">
          <h1 className="page-title">
            {activeTab === "dashboard" && "Dashboard"}
            {activeTab === "issues" && "All Issues"}
          </h1>
          <div className="header-actions">
            <Button variant="outline" size="sm">
              <FaUser className="button-icon" />
              {userProfile?.name || "Profile"}
            </Button>
          </div>
        </header>
        <main className="main-area">
          {/* Dashboard Tab */}
          {activeTab === "dashboard" && (
            <div className="dashboard-grid">
              {/* Stats Cards */}
              <div className="stats-grid">
                <Card>
                  <CardHeader className="card-header-compact">
                    <CardTitle className="card-title-small">
                      Total Issues
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="stat-value">{totalIssues}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="card-header-compact">
                    <CardTitle className="card-title-small">
                      Pending Issues
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="stat-value">{pendingCount}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="card-header-compact">
                    <CardTitle className="card-title-small">
                      In Progress
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="stat-value">{inProgressCount}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="card-header-compact">
                    <CardTitle className="card-title-small">
                      Resolved Issues
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="stat-value">{resolvedCount}</div>
                  </CardContent>
                </Card>
              </div>
              {/* Recent Issues */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Issues</CardTitle>
                </CardHeader>
                <CardContent>
                  {issues.length === 0 ? (
                    <p className="no-issues-message">
                      No issues found. Create your first issue!
                    </p>
                  ) : (
                    <div className="recent-issues">
                      {issues.slice(0, 5).map((issue) => (
                        <div key={issue.id} className="issue-item">
                          <div>
                            <p className="issue-title">{issue.title}</p>
                            <p className="issue-meta">
                              {issue.department} • {formatDate(issue.date)}
                            </p>
                          </div>
                          <Badge className={statusColors[issue.status]}>
                            {statusNames[issue.status]}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
          {/* All Issues Tab */}
          {activeTab === "issues" && (
            <Card>
              <CardHeader>
                <CardTitle>All Issues</CardTitle>
              </CardHeader>
              <CardContent>
                {issues.length === 0 ? (
                  <p className="no-issues-message">
                    No issues found. Create your first issue!
                  </p>
                ) : (
                  <div className="issues-table">
                    <div className="issues-table-header">
                      <div className="col-title">Title</div>
                      <div className="col-department">Department</div>
                      <div className="col-date">Date</div>
                      <div className="col-status">Status</div>
                    </div>
                    {issues.map((issue) => (
                      <div key={issue.id} className="issues-table-row">
                        <div className="col-title">{issue.title}</div>
                        <div className="col-department">{issue.department}</div>
                        <div className="col-date">{formatDate(issue.date)}</div>
                        <div className="col-status">
                          <Badge className={statusColors[issue.status]}>
                            {statusNames[issue.status]}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </div>
  );
}
