import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Students.css";
import { AuthContext } from "../context/authContext";
import LoadingAnimation from "@/components/LoadingAnimation";

const ENDPOINTS = {
  studentIssues:
    "https://academic-issue-tracking-now.onrender.com/api/student-issues/",
  raiseIssue:
    "https://academic-issue-tracking-now.onrender.com/api/raise-issue/",
};

const DEPT_CHOICES = [
  { value: "computer_science", label: "Computer Science Department" },
  { value: "networks", label: "Networks Department" },
  { value: "information_systems", label: "Information Systems" },
  { value: "information_technology", label: "Information Technology" },
];

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

const CATEGORY_CHOICES = [
  { value: "Missing_Marks", label: "Missing marks" },
  { value: "Wrong_grading", label: "Wrong grading" },
  { value: "wrong_marks", label: "Wrong marks" },
  { value: "other", label: "Other" },
];

const REGISTRARS = [{ value: "SekibaalaMark", label: "SekibaalaMark" }];

const SuccessPopup = ({ message, onClose }) => (
  <div className="success-popup-overlay">
    <div className="success-popup">
      <div className="success-popup-content">
        <div className="success-icon">✓</div>
        <h2>Success!</h2>
        <p>{message}</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  </div>
);

const Students = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [issues, setIssues] = useState([]);
  const [filterStatus, setFilterStatus] = useState("");
  const [formData, setFormData] = useState({
    course_name: "",
    course_code: "",
    year_of_study: "",
    category: "",
    description: "",
    department: "",
    attachment: null,
    registrar: "",
    programme: "",
  });
  const [error, setError] = useState("");
  const [selectedTab, setSelectedTab] = useState("home");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [dataFetched, setDataFetched] = useState(false);
  const [showAnimation, setShowAnimation] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    total_issues: 0,
    categories: {
      Missing_Marks: 0,
      Wrong_grading: 0,
      wrong_marks: 0,
      other: 0
    },
    statuses: {
      pending: 0,
      in_progress: 0,
      resolved: 0
    }
  });

  // Navigation handlers
  const handleBack = () => {
    navigate(-1);
  };

  const handleForward = () => {
    navigate(1);
  };

  const handleRefresh = () => {
    if (user && user.token) {
      const fetchData = async () => {
        setLoading(true);
        try {
          const issuesRes = await axios.get(ENDPOINTS.studentIssues, {
            headers: { Authorization: `Bearer ${user.token}` },
          });
          setIssues(issuesRes.data || []);
        } catch (err) {
          console.error("Error fetching issues:", err);
          setIssues([]);
          setError("Failed to fetch issues.");
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "attachment" && files && files[0]) {
      setFormData({ ...formData, attachment: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Check authentication
  useEffect(() => {
    if (!user || !user.token) {
      navigate("/login");
    }
  }, [user, navigate]);

  // Update the useEffect that fetches issues to include counter calculations
  useEffect(() => {
    if (user && user.token && !dataFetched) {
      const fetchData = async () => {
        setLoading(true);
        try {
          const issuesRes = await axios.get(ENDPOINTS.studentIssues, {
            headers: { Authorization: `Bearer ${user.token}` },
          });
          console.log("Fetched issues:", issuesRes.data);
          const issuesData = issuesRes.data || [];
          
          // Sort issues by creation date in descending order (newest first)
          const sortedIssues = [...issuesData].sort((a, b) => 
            new Date(b.created_at) - new Date(a.created_at)
          );
          
          setIssues(sortedIssues);
          setDataFetched(true);

          // Calculate counters
          const categoryCounts = {
            Missing_Marks: 0,
            Wrong_grading: 0,
            wrong_marks: 0,
            other: 0
          };
          const statusCounts = {
            pending: 0,
            in_progress: 0,
            resolved: 0
          };

          sortedIssues.forEach(issue => {
            // Count categories
            if (issue.category) {
              categoryCounts[issue.category] = (categoryCounts[issue.category] || 0) + 1;
            }
            // Count statuses
            if (issue.status) {
              statusCounts[issue.status] = (statusCounts[issue.status] || 0) + 1;
            }
          });

          setDashboardData({
            total_issues: sortedIssues.length,
            categories: categoryCounts,
            statuses: statusCounts
          });

        } catch (err) {
          console.error("Error fetching issues:", err);
          setIssues([]);
          setError("Failed to fetch issues.");
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [user, dataFetched]);

  // Add animation timeout effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAnimation(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    if (
      !formData.course_name ||
      !formData.course_code ||
      !formData.description ||
      !formData.registrar ||
      !formData.programme
    ) {
      setError("Please fill in all required fields");
      setSubmitting(false);
      return;
    }

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null && value !== "") {
        data.append(key, value);
      }
    });

    try {
      const response = await axios.post(ENDPOINTS.raiseIssue, data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${user.token}`,
        },
      });
      console.log("Issue submitted successfully:", response.data);
      
      // Show alert and redirect to home tab
      alert("Issue raised successfully! You can track its status in the Home tab.");
      setSelectedTab("home");
      
      // Reset form
      setFormData({
        course_name: "",
        course_code: "",
        year_of_study: "",
        category: "",
        description: "",
        department: "",
        attachment: null,
        registrar: "",
        programme: "",
      });

      // Refresh issues list
      const issuesRes = await axios.get(ENDPOINTS.studentIssues, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setIssues(issuesRes.data || []);
    } catch (err) {
      console.error("Error submitting issue:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
      });

      if (err.response?.status === 400) {
        setError("Invalid data. Please check your input.");
      } else if (err.response?.status === 401) {
        setError("Unauthorized. Please log in again.");
        logout();
      } else if (err.response?.status === 500) {
        setError("Server error. Please try again later.");
      } else {
        setError("Failed to raise issue. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const IssueCard = ({ issue }) => {
    return (
      <div className={`issue-card ${issue.status?.toLowerCase() || 'pending'}`}>
        <div className="issue-header">
          <h3>{issue.course_name}</h3>
          <span className={`status-badge ${issue.status?.toLowerCase() || 'pending'}`}>
            {issue.status || 'Pending'}
          </span>
        </div>

        <div className="issue-meta">
          <div className="meta-item">
            <span className="meta-label">Course Code</span>
            <span className="meta-value">{issue.course_code}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Submitted</span>
            <span className="meta-value">{formatDate(issue.created_at)}</span>
          </div>
        </div>

        <div className="issue-content">
          <div className="issue-description">
            <p>{issue.description}</p>
          </div>

          {issue.marks && (
            <div className="issue-marks">
              <span className="marks-label">Marks:</span>
              <span className="marks-value">{issue.marks}</span>
            </div>
          )}

          <div className="issue-details">
            <div className="detail-item">
              <div className="detail-label">Department</div>
              <div className="detail-value">
                {DEPT_CHOICES.find(dept => dept.value === issue.department)?.label || issue.department}
              </div>
            </div>
            <div className="detail-item">
              <div className="detail-label">Programme</div>
              <div className="detail-value">
                {PROGRAMME_CHOICES.find(prog => prog.value === issue.programme)?.label || issue.programme}
              </div>
            </div>
            <div className="detail-item">
              <div className="detail-label">Category</div>
              <div className="detail-value">
                {CATEGORY_CHOICES.find(cat => cat.value === issue.category)?.label || issue.category}
              </div>
            </div>
            <div className="detail-item">
              <div className="detail-label">Year of Study</div>
              <div className="detail-value">
                {issue.year_of_study?.replace('_', ' ').toUpperCase() || 'Not specified'}
              </div>
            </div>
          </div>

          {issue.attachment && (
            <div className="issue-attachment">
              <span className="attachment-icon">📎</span>
              <a 
                href={issue.attachment} 
                target="_blank" 
                rel="noopener noreferrer"
                className="attachment-link"
              >
                View Attachment
              </a>
            </div>
          )}

          {issue.comments && issue.comments.length > 0 && (
            <div className="issue-timeline">
              {issue.comments.map((comment, index) => (
                <div key={index} className="timeline-item">
                  <div className="timeline-date">{formatDate(comment.created_at)}</div>
                  <div className="timeline-content">
                    <p>{comment.content}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  // Add filtered issues computation
  const filteredIssues = issues.filter(issue => {
    if (!filterStatus) return true;
    return issue.status === filterStatus;
  });

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <>
      {showAnimation && <LoadingAnimation />}
      <div className="students-container">
        <aside className="sidebar" style={{
          width: '240px',
          backgroundColor: '#fff',
          borderRight: '1px solid #e0e0e0',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          padding: '2rem 0',
          boxShadow: '2px 0 4px rgba(0,0,0,0.1)'
        }}>
          <h2 className="sidebar-title" style={{
            color: '#2d5a3c',
            fontSize: '1.5rem',
            padding: '0 1.5rem',
            marginBottom: '2rem'
          }}>
            Student Dashboard
          </h2>
          <ul style={{
            listStyle: 'none',
            padding: 0,
            margin: 0
          }}>
            <li 
              onClick={() => setSelectedTab("home")}
              style={{
                padding: '0.75rem 1.5rem',
                cursor: 'pointer',
                backgroundColor: selectedTab === "home" ? '#e8f5e9' : 'transparent',
                color: '#2d5a3c',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'background-color 0.2s',
                fontWeight: selectedTab === "home" ? '600' : 'normal',
                borderLeft: selectedTab === "home" ? '4px solid #2d5a3c' : '4px solid transparent'
              }}
            >
              🏠 Home
            </li>
            <li 
              onClick={() => setSelectedTab("raiseIssue")}
              style={{
                padding: '0.75rem 1.5rem',
                cursor: 'pointer',
                backgroundColor: selectedTab === "raiseIssue" ? '#e8f5e9' : 'transparent',
                color: '#2d5a3c',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'background-color 0.2s',
                fontWeight: selectedTab === "raiseIssue" ? '600' : 'normal',
                borderLeft: selectedTab === "raiseIssue" ? '4px solid #2d5a3c' : '4px solid transparent'
              }}
            >
              ✏️ Raise Issue
            </li>
            <li 
              onClick={logout}
              style={{
                padding: '0.75rem 1.5rem',
                cursor: 'pointer',
                color: '#dc3545',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'background-color 0.2s',
                marginTop: 'auto',
                position: 'absolute',
                bottom: '2rem',
                width: '100%',
                ':hover': {
                  backgroundColor: '#fff5f5'
                }
              }}
            >
              🚪 Logout
            </li>
          </ul>
        </aside>

        <main style={{
          marginLeft: '240px',
          padding: '2rem',
          backgroundColor: '#f8f9fa',
          minHeight: '100vh'
        }}>
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
              style={{ backgroundColor: '#2d5a3c', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }}
            >
              ← Back
            </button>
            <button
              onClick={handleForward}
              className="action-button"
              style={{ backgroundColor: '#2d5a3c', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }}
            >
              Forward →
            </button>
            <button
              onClick={handleRefresh}
              className="action-button"
              style={{ backgroundColor: '#2d5a3c', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }}
            >
              ↻ Refresh
            </button>
          </div>

          <div className="tabs">
            <button
              className={selectedTab === "home" ? "active" : ""}
              onClick={() => setSelectedTab("home")}
            >
              Home
            </button>
            <button
              className={selectedTab === "raiseIssue" ? "active" : ""}
              onClick={() => setSelectedTab("raiseIssue")}
            >
              Raise Issue
            </button>
          </div>

          {selectedTab === "home" && (
            <div className="dashboard-home">
              <div className="welcome-section" style={{ 
                backgroundColor: '#e8f5e9',
                padding: '1.5rem',
                borderRadius: '8px',
                marginBottom: '2rem',
                borderLeft: '4px solid #2d5a3c'
              }}>
                <h2 className="welcome-title" style={{ color: '#2d5a3c', marginBottom: '1rem' }}>
                  Welcome back, {user?.first_name || user?.username}!
                </h2>
                <p className="welcome-message" style={{ color: '#2c3e50', lineHeight: '1.5' }}>
                  Track your academic issues and their resolution status here. Use the "Raise Issue" tab to submit new concerns.
                </p>
              </div>

              {/* Dashboard Summary */}
              <div className="dashboard-summary" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                gap: '0.75rem',
                marginBottom: '1.5rem'
              }}>
                <div className="summary-item" style={{
                  backgroundColor: '#fff',
                  padding: '1rem',
                  borderRadius: '6px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  textAlign: 'center',
                  borderLeft: '4px solid #2d5a3c'
                }}>
                  <span className="summary-label" style={{ color: '#2d5a3c', display: 'block', marginBottom: '0.25rem', fontSize: '0.9rem' }}>Total Issues</span>
                  <span className="summary-value" style={{ fontSize: '1.5rem', color: '#2d5a3c', fontWeight: 'bold' }}>{dashboardData.total_issues}</span>
                </div>
                <div className="summary-item" style={{
                  backgroundColor: '#fff',
                  padding: '1rem',
                  borderRadius: '6px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  textAlign: 'center',
                  borderLeft: '4px solid #ffd700'
                }}>
                  <span className="summary-label" style={{ color: '#2d5a3c', display: 'block', marginBottom: '0.25rem', fontSize: '0.9rem' }}>Pending</span>
                  <span className="summary-value" style={{ fontSize: '1.5rem', color: '#2d5a3c', fontWeight: 'bold' }}>{dashboardData.statuses.pending}</span>
                </div>
                <div className="summary-item" style={{
                  backgroundColor: '#fff',
                  padding: '1rem',
                  borderRadius: '6px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  textAlign: 'center',
                  borderLeft: '4px solid #3498db'
                }}>
                  <span className="summary-label" style={{ color: '#2d5a3c', display: 'block', marginBottom: '0.25rem', fontSize: '0.9rem' }}>In Progress</span>
                  <span className="summary-value" style={{ fontSize: '1.5rem', color: '#2d5a3c', fontWeight: 'bold' }}>{dashboardData.statuses.in_progress}</span>
                </div>
                <div className="summary-item" style={{
                  backgroundColor: '#fff',
                  padding: '1rem',
                  borderRadius: '6px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  textAlign: 'center',
                  borderLeft: '4px solid #2ecc71'
                }}>
                  <span className="summary-label" style={{ color: '#2d5a3c', display: 'block', marginBottom: '0.25rem', fontSize: '0.9rem' }}>Resolved</span>
                  <span className="summary-value" style={{ fontSize: '1.5rem', color: '#2d5a3c', fontWeight: 'bold' }}>{dashboardData.statuses.resolved}</span>
                </div>
              </div>

              {/* Category Summary */}
              <div className="category-summary" style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ color: '#2d5a3c', marginBottom: '0.75rem', fontSize: '1.1rem' }}>Issues by Category</h3>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                  gap: '0.75rem'
                }}>
                  <div className="summary-item" style={{
                    backgroundColor: '#fff',
                    padding: '1rem',
                    borderRadius: '6px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    textAlign: 'center',
                    borderLeft: '4px solid #2d5a3c'
                  }}>
                    <span className="summary-label" style={{ color: '#2d5a3c', display: 'block', marginBottom: '0.25rem', fontSize: '0.9rem' }}>Missing Marks</span>
                    <span className="summary-value" style={{ fontSize: '1.5rem', color: '#2d5a3c', fontWeight: 'bold' }}>{dashboardData.categories.Missing_Marks}</span>
                  </div>
                  <div className="summary-item" style={{
                    backgroundColor: '#fff',
                    padding: '1rem',
                    borderRadius: '6px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    textAlign: 'center',
                    borderLeft: '4px solid #2d5a3c'
                  }}>
                    <span className="summary-label" style={{ color: '#2d5a3c', display: 'block', marginBottom: '0.25rem', fontSize: '0.9rem' }}>Wrong Grading</span>
                    <span className="summary-value" style={{ fontSize: '1.5rem', color: '#2d5a3c', fontWeight: 'bold' }}>{dashboardData.categories.Wrong_grading}</span>
                  </div>
                  <div className="summary-item" style={{
                    backgroundColor: '#fff',
                    padding: '1rem',
                    borderRadius: '6px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    textAlign: 'center',
                    borderLeft: '4px solid #2d5a3c'
                  }}>
                    <span className="summary-label" style={{ color: '#2d5a3c', display: 'block', marginBottom: '0.25rem', fontSize: '0.9rem' }}>Wrong Marks</span>
                    <span className="summary-value" style={{ fontSize: '1.5rem', color: '#2d5a3c', fontWeight: 'bold' }}>{dashboardData.categories.wrong_marks}</span>
                  </div>
                  <div className="summary-item" style={{
                    backgroundColor: '#fff',
                    padding: '1rem',
                    borderRadius: '6px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    textAlign: 'center',
                    borderLeft: '4px solid #2d5a3c'
                  }}>
                    <span className="summary-label" style={{ color: '#2d5a3c', display: 'block', marginBottom: '0.25rem', fontSize: '0.9rem' }}>Other</span>
                    <span className="summary-value" style={{ fontSize: '1.5rem', color: '#2d5a3c', fontWeight: 'bold' }}>{dashboardData.categories.other}</span>
                  </div>
                </div>
              </div>

              <div className="issues-list">
                <div style={{ marginBottom: '1rem' }}>
                  <h2 style={{ marginBottom: '1rem' }}>Your Issues</h2>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    marginBottom: '1rem'
                  }}>
                    <label style={{ 
                      color: '#2d5a3c',
                      fontSize: '0.9rem',
                      fontWeight: '500'
                    }}>
                      Filter by Status:
                    </label>
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      style={{
                        padding: '0.5rem',
                        borderRadius: '4px',
                        border: '1px solid #ccc',
                        color: '#2d5a3c',
                        backgroundColor: 'white',
                        fontSize: '0.9rem'
                      }}
                    >
                      <option value="">All Issues</option>
                      <option value="pending">Pending</option>
                      <option value="in_progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                    </select>
                    <span style={{ 
                      color: '#666',
                      fontSize: '0.9rem'
                    }}>
                      Showing {filteredIssues.length} issue{filteredIssues.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
                {filteredIssues.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-state-icon">📝</div>
                    <h3>No Issues Found</h3>
                    <p>{filterStatus ? `No ${filterStatus.replace('_', ' ')} issues found.` : "You haven't raised any issues yet."}</p>
                    {!filterStatus && (
                      <button 
                        className="empty-state-action"
                        onClick={() => setSelectedTab("raiseIssue")}
                      >
                        Raise New Issue
                      </button>
                    )}
                  </div>
                ) : (
                  filteredIssues.map((issue) => (
                    <IssueCard key={issue.id} issue={issue} />
                  ))
                )}
              </div>
            </div>
          )}

          {selectedTab === "raiseIssue" && (
            <form onSubmit={handleSubmit} className="issue-form">
              <h2>Raise a New Issue</h2>
              {error && <p className="error">{error}</p>}
              <div className="form-group">
                <label htmlFor="course_name">Course Name <span style={{ color: "#666", fontSize: "0.9em" }}>(e.g., Computer Architecture, Data Structures)</span></label>
                <input
                  type="text"
                  id="course_name"
                  name="course_name"
                  value={formData.course_name}
                  onChange={handleChange}
                  placeholder="Enter the full course name (e.g., Computer Architecture)"
                  required
                  style={{
                    width: "100%",
                    padding: "12px",
                    borderRadius: "8px",
                    border: "1px solid #E5E7EB",
                    fontSize: "16px"
                  }}
                />
              </div>
              <div className="form-group">
                <label htmlFor="course_code">Course Code <span style={{ color: "#666", fontSize: "0.9em" }}>(Format: XXX YYYY, e.g., CSC 1109)</span></label>
                <input
                  type="text"
                  id="course_code"
                  name="course_code"
                  value={formData.course_code}
                  onChange={handleChange}
                  placeholder="Enter course code (e.g., CSC 1109)"
                  pattern="[A-Za-z]{2,4}\s*\d{3,4}"
                  title="Please enter a valid course code (e.g., CSC 1109)"
                  required
                  style={{
                    width: "100%",
                    padding: "12px",
                    borderRadius: "8px",
                    border: "1px solid #E5E7EB",
                    fontSize: "16px"
                  }}
                />
                <small style={{ color: "#666", display: "block", marginTop: "4px" }}>
                  Format: Department Code (2-4 letters) followed by Course Number (3-4 digits)
                </small>
              </div>
              <div className="form-group">
                <label htmlFor="year_of_study">Year of Study</label>
                <select
                  id="year_of_study"
                  name="year_of_study"
                  value={formData.year_of_study}
                  onChange={handleChange}
                >
                  <option value="">Select Year</option>
                  <option value="year_1">Year 1</option>
                  <option value="year_2">Year 2</option>
                  <option value="year_3">Year 3</option>
                  <option value="year_4">Year 4</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="category">Category</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                >
                  <option value="">Select Category</option>
                  {CATEGORY_CHOICES.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>
              <div className="form-group">
                <label htmlFor="department">Department</label>
                <select
                  id="department"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                >
                  <option value="">Select Department</option>
                  {DEPT_CHOICES.map((dept) => (
                    <option key={dept.value} value={dept.value}>
                      {dept.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="registrar">Registrar</label>
                <select
                  id="registrar"
                  name="registrar"
                  value={formData.registrar}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Registrar</option>
                  {REGISTRARS.map((reg) => (
                    <option key={reg.value} value={reg.value}>
                      {reg.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="programme">Programme</label>
                <select
                  id="programme"
                  name="programme"
                  value={formData.programme}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Programme</option>
                  {PROGRAMME_CHOICES.map((prog) => (
                    <option key={prog.value} value={prog.value}>
                      {prog.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="attachment">Attachment</label>
                <input
                  type="file"
                  id="attachment"
                  name="attachment"
                  onChange={handleChange}
                />
              </div>
              <button type="submit" disabled={submitting}>
                {submitting ? "Submitting..." : "Submit"}
              </button>
            </form>
          )}
        </main>
      </div>
    </>
  );
};

export default Students;
