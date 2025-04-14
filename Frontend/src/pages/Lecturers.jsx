import React, { useState, useEffect, useContext, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Lecturers.css";
import { AuthContext } from "@/context/authContext";

// API Endpoints
const ENDPOINTS = {
  lecturerIssues: "https://academic-6ea365e4b745.herokuapp.com/api/lecturer-issue-management/",
  lecturerDashboard: "https://academic-6ea365e4b745.herokuapp.com/api/lecturer-dashboard/",
  userProfile: "https://academic-6ea365e4b745.herokuapp.com/api/user/profile/",
  lecturerProfile: "https://academic-6ea365e4b745.herokuapp.com/api/lecturer-profile/",
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
      const timer = setTimeout(() => {
        setSuccessMsg("");
      }, MESSAGE_TIMEOUT);
      return () => clearTimeout(timer);
    }
  }, [successMsg]);
  
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError("");
      }, MESSAGE_TIMEOUT);
      return () => clearTimeout(timer);
    }
  }, [error]);
  
  // Create axios instance with authentication
  const createAuthAxios = useCallback(() => {
    const token = user?.token || localStorage.getItem("accessToken");
    return axios.create({
      headers: {
        Authorization: `Token ${token}`,
      },
    });
  }, [user]);
  
  // Function to fetch lecturer data
  const fetchLecturerData = useCallback(async () => {
    try {
      setLoading(true);
      const authAxios = createAuthAxios();
      
      const [issuesRes, dashboardRes] = await Promise.all([
        authAxios.get(ENDPOINTS.lecturerIssues),
        authAxios.get(ENDPOINTS.lecturerDashboard),
      ]);
      
      setIssues(Array.isArray(issuesRes.data) ? issuesRes.data : []);
      setDashboardData(dashboardRes.data.dashboard || {
        total_assigned: 0,
        in_progress_count: 0,
        resolved_count: 0,
      });
      
      setLoading(false);
    } catch (err) {
      console.error("Error fetching lecturer data:", err);
      setError("Failed to load data. Please try again.");
      setLoading(false);
      
      if (err.response?.status === 401) {
        handleLogout();
      }
    }
  }, [createAuthAxios]);
  
  // Check authentication and user role on component mount
  useEffect(() => {
    console.log("Lecturers component mounted");
    
    const checkAuthAndFetchData = async () => {
      // Check if user is authenticated
      const token = user?.token || localStorage.getItem("accessToken");
      const storedRole = localStorage.getItem("userRole");
      
      if (!token) {
        console.log("No token found, redirecting to login");
        navigate("/login");
        setLoading(false);
        setAuthChecked(true);
        return;
      }
      
      try {
        // If we already know the role from localStorage, use it
        if (storedRole) {
          setUserRole(storedRole);
          
          // Redirect based on stored role if not lecturer
          if (storedRole !== "lecturer") {
            if (storedRole === "academic_registrar" || storedRole === "registrar") {
              navigate("/AcademicRegistrar");
            } else if (storedRole === "student") {
              navigate("/students");
            } else {
              navigate("/dashboard");
            }
            setLoading(false);
            setAuthChecked(true);
            return;
          }
        } else {
          // Fetch user profile to determine role
          const authAxios = createAuthAxios();
          const response = await authAxios.get(ENDPOINTS.userProfile);
          const role = response.data.role;
          
          setUserRole(role);
          localStorage.setItem("userRole", role);
          
          // Redirect based on role if not lecturer
          if (role !== "lecturer") {
            if (role === "academic_registrar" || role === "registrar") {
              navigate("/AcademicRegistrar");
            } else if (role === "student") {
              navigate("/students");
            } else {
              navigate("/dashboard");
            }
            setLoading(false);
            setAuthChecked(true);
            return;
          }
        }
        
        // Only fetch lecturer data if user is actually a lecturer
        await fetchLecturerData();
      } catch (err) {
        console.error("Error in authentication check:", err);
        
        if (err.response?.status === 401) {
          handleLogout();
        } else {
          setError("Authentication error. Please try logging in again.");
          setLoading(false);
          setAuthChecked(true);
        }
      }
    };
    
    checkAuthAndFetchData();
  }, [user, navigate, fetchLecturerData, createAuthAxios]);
  
  // Handle logout function
  const handleLogout = useCallback(() => {
    // Clear localStorage
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userRole");
    localStorage.removeItem("username");
    
    // Use context logout
    if (logout) {
      logout();
    }
    
    navigate("/login");
  }, [logout, navigate]);
  
  // Handle view issue
  const handleViewIssue = useCallback((issueId) => {
    const issue = issues.find((i) => i.id === issueId);
    setSelectedIssue(issue);
    setSelectedTab("issueDetail");
  }, [issues]);
  
  // Handle status update
  const handleStatusUpdate = useCallback(async (issueId, status) => {
    setSubmitting(true);
    setError("");
    setSuccessMsg("");
    
    try {
      const authAxios = createAuthAxios();
      
      await authAxios.patch(
        `${ENDPOINTS.lecturerIssues}${issueId}/`,
        { status, feedback: comment }
      );
      
      setSuccessMsg("Issue updated successfully.");
      
      // Refresh issues list and dashboard data
      await fetchLecturerData();
      
      // Update selected issue if we're viewing it
      if (selectedIssue && selectedIssue.id === issueId) {
        const updatedIssue = await authAxios.get(`${ENDPOINTS.lecturerIssues}${issueId}/`);
        setSelectedIssue(updatedIssue.data);
      }
      
      setComment("");
    } catch (err) {
      setError("Failed to update issue. Please try again.");
      console.error("Error updating issue:", err);
    } finally {
      setSubmitting(false);
    }
  }, [comment, createAuthAxios, fetchLecturerData, selectedIssue]);
  
  // Handle add comment
  const handleAddComment = useCallback(async (issueId) => {
    if (!comment.trim()) return;
    
    setSubmitting(true);
    setError("");
    setSuccessMsg("");
    
    try {
      const authAxios = createAuthAxios();
      
      await authAxios.post(
        `${ENDPOINTS.lecturerIssues}${issueId}/comment/`,
        { content: comment }
      );
      
      setSuccessMsg("Comment added successfully.");
      
      // Refresh the selected issue to show the new comment
      const issueRes = await authAxios.get(`${ENDPOINTS.lecturerIssues}${issueId}/`);
      setSelectedIssue(issueRes.data);
      setComment("");
    } catch (err) {
      setError("Failed to add comment. Please try again.");
      console.error("Error adding comment:", err);
    } finally {
      setSubmitting(false);
    }
  }, [comment, createAuthAxios]);
  
  // Filter issues based on search term and status
  const filteredIssues = issues.filter((issue) => {
    const matchesSearch =
      searchTerm === "" ||
      issue.course_code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issue.course_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
        <p>Loading Lecturer Dashboard...</p>
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
        {successMsg && (
          <div className="success-message">
            <p>{successMsg}</p>
            <button className="close-btn" onClick={() => setSuccessMsg("")}>×</button>
          </div>
        )}
        
        {error && (
          <div className="error-message">
            <p>{error}</p>
            <button className="close-btn" onClick={() => setError("")}>×</button>
          </div>
        )}
        
        {/* Home Tab */}
        {selectedTab === "home" && (
          <div className="dashboard-home">
            <h1 className="page-title">Lecturer Dashboard</h1>
            <div className="user-welcome">
              <p>Welcome, {localStorage.getItem("username") || user?.name || "Lecturer"}</p>
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
                        {issue.description?.substring(0, 100)}...
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
                  placeholder="Search by course or student name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="status-filter">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
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
              <p className="no-issues">No issues match your search criteria.</p>
            ) : (
              <div className="issues-table-container">
                <table className="issues-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Course</th>
                      <th>Student</th>
                      <th>Date Submitted</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredIssues.map((issue) => (
                      <tr key={issue.id} className={issue.status}>
                        <td>{issue.id}</td>
                        <td>
                          {issue.course_code}: {issue.course_name}
                        </td>
                        <td>
                          {issue.student?.first_name} {issue.student?.last_name}
                        </td>
                        <td>
                          {new Date(issue.created_at).toLocaleDateString()}
                        </td>
                        <td>
                          <span className={`status-badge ${issue.status}`}>
                            {issue.status}
                          </span>
                        </td>
                        <td>
                          <button
                            className="view-btn"
                            onClick={() => handleViewIssue(issue.id)}
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
        
        {/* Issue Detail Tab */}
        {selectedTab === "issueDetail" && selectedIssue && (
          <div className="issue-detail">
            <div className="detail-header">
              <button
                className="back-btn"
                onClick={() => setSelectedTab("issues")}
              >
                ← Back to Issues
              </button>
              <h1 className="page-title">Issue Details</h1>
            </div>
            
            <div className="issue-info">
              <div className="info-section">
                <h2>
                  {selectedIssue.course_code}: {selectedIssue.course_name}
                </h2>
                <div className="info-row">
                  <span className="info-label">Status:</span>
                  <span className={`status-badge ${selectedIssue.status}`}>
                    {selectedIssue.status}
                  </span>
                </div>
                <div className="info-row">
                  <span className="info-label">Student:</span>
                  <span>
                    {selectedIssue.student?.first_name}{" "}
                    {selectedIssue.student?.last_name}
                  </span>
                </div>
                <div className="info-row">
                  <span className="info-label">Student ID:</span>
                  <span>{selectedIssue.student?.student_id}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Date Submitted:</span>
                  <span>
                    {new Date(selectedIssue.created_at).toLocaleString()}
                  </span>
                </div>
              </div>
              
              <div className="description-section">
                <h3>Issue Description</h3>
                <p>{selectedIssue.description}</p>
              </div>
              
              {selectedIssue.attachments && selectedIssue.attachments.length > 0 && (
                <div className="attachments-section">
                  <h3>Attachments</h3>
                  <ul className="attachments-list">
                    {selectedIssue.attachments.map((attachment, index) => (
                      <li key={index}>
                        <a
                          href={attachment.file}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {attachment.filename || `Attachment ${index + 1}`}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {/* Comments Section */}
              <div className="comments-section">
                <h3>Comments</h3>
                {selectedIssue.comments && selectedIssue.comments.length > 0 ? (
                  <div className="comments-list">
                    {selectedIssue.comments.map((comment, index) => (
                      <div key={index} className="comment">
                        <div className="comment-header">
                          <span className="comment-author">
                            {comment.author_name || "Unknown"}
                          </span>
                          <span className="comment-date">
                            {new Date(comment.created_at).toLocaleString()}
                          </span>
                        </div>
                        <p className="comment-content">{comment.content}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="no-comments">No comments yet.</p>
                )}
                
                <div className="add-comment">
                  <textarea
                    placeholder="Add a comment or feedback..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
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
              </div>
              
              {/* Status Update Section */}
              <div className="status-update-section">
                <h3>Update Status</h3>
                <div className="status-buttons">
                  <button
                    className={`status-btn pending ${
                      selectedIssue.status === "pending" ? "active" : ""
                    }`}
                    onClick={() => handleStatusUpdate(selectedIssue.id, "pending")}
                    disabled={
                      selectedIssue.status === "pending" || submitting
                    }
                  >
                    Pending
                  </button>
                  <button
                    className={`status-btn in_progress ${
                      selectedIssue.status === "in_progress" ? "active" : ""
                    }`}
                    onClick={() =>
                      handleStatusUpdate(selectedIssue.id, "in_progress")
                    }
                    disabled={
                      selectedIssue.status === "in_progress" || submitting
                    }
                  >
                    In Progress
                  </button>
                  <button
                    className={`status-btn resolved ${
                      selectedIssue.status === "resolved" ? "active" : ""
                    }`}
                    onClick={() =>
                      handleStatusUpdate(selectedIssue.id, "resolved")
                    }
                    disabled={
                      selectedIssue.status === "resolved" || submitting
                    }
                  >
                    Resolved
                  </button>
                  <button
                    className={`status-btn rejected ${
                      selectedIssue.status === "rejected" ? "active" : ""
                    }`}
                    onClick={() =>
                      handleStatusUpdate(selectedIssue.id, "rejected")
                    }
                    disabled={
                      selectedIssue.status === "rejected" || submitting
                    }
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Profile Tab */}
        {selectedTab === "profile" && (
          <div className="profile-section">
            <h1 className="page-title">Lecturer Profile</h1>
            <ProfileContent createAuthAxios={createAuthAxios} setError={setError} />
          </div>
        )}
      </main>
    </div>
  );
};

// Profile Content Component
const ProfileContent = ({ createAuthAxios, setError }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const authAxios = createAuthAxios();
        const response = await authAxios.get(ENDPOINTS.lecturerProfile);
        setProfile(response.data);
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("Failed to load profile data. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfile();
  }, [createAuthAxios, setError]);
  
  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading profile...</p>
      </div>
    );
  }
  
  if (!profile) {
    return <p>No profile information available.</p>;
  }
  
  return (
    <div className="profile-content">
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar">
            {profile.profile_picture ? (
              <img src={profile.profile_picture} alt="Profile" />
            ) : (
              <div className="avatar-placeholder">
                {profile.first_name ? profile.first_name.charAt(0) : "L"}
              </div>
            )}
          </div>
          <div className="profile-name">
            <h2>
              {profile.title || ""} {profile.first_name || ""} {profile.last_name || ""}
            </h2>
            <p className="profile-role">Lecturer</p>
          </div>
        </div>
        
        <div className="profile-details">
          <div className="detail-row">
            <span className="detail-label">Email:</span>
            <span className="detail-value">{profile.email || "Not provided"}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Phone:</span>
            <span className="detail-value">{profile.phone || "Not provided"}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Department:</span>
            <span className="detail-value">{profile.department || "Not provided"}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Faculty:</span>
            <span className="detail-value">{profile.faculty || "Not provided"}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Staff ID:</span>
            <span className="detail-value">{profile.staff_id || "Not provided"}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Office Location:</span>
            <span className="detail-value">{profile.office_location || "Not provided"}</span>
          </div>
        </div>
        
        <div className="profile-bio">
          <h3>Bio</h3>
          <p>{profile.bio || "No bio information available."}</p>
        </div>
        
        {profile.courses && profile.courses.length > 0 && (
          <div className="profile-courses">
            <h3>Courses</h3>
            <ul className="courses-list">
              {profile.courses.map((course, index) => (
                <li key={index}>
                  <span className="course-code">{course.course_code}</span>
                  <span className="course-name">{course.course_name}</span>
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
