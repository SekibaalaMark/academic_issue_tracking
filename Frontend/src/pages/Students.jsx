import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
// import ErrorBoundary from "./components/ErrorBoundary";

import "./Students.css";
import { AuthContext } from "@/context/authContext";

const ENDPOINTS = {
  departments: "https://academic-6ea365e4b745.herokuapp.com/api/departments/",
  studentIssues:
    "https://academic-6ea365e4b745.herokuapp.com/api/student-issues/",
  raiseIssue: "https://academic-6ea365e4b745.herokuapp.com/api/raise-issue/",
  userProfile: "https://academic-6ea365e4b745.herokuapp.com/api/user/profile/",
};

const Students = () => {
  // <ErrorBoundary errorMessage="There was an error loading the dashboard. Please try again.">
  //   <Dashboard />
  // </ErrorBoundary>;
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [userRole, setUserRole] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [issues, setIssues] = useState([]);
  const [formData, setFormData] = useState({
    course_name: "",
    course_code: "",
    year_of_study: "year_1",
    category: "Missing_Marks",
    description: "",
    department: "",
    attachment: null,
  });
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [selectedTab, setSelectedTab] = useState("home");
  const [loading, setLoading] = useState(true);

  // Check authentication and user role on component mount
  useEffect(() => {
    console.log("User:", user);
    // if (!user) {
    //   navigate("/login");
    //   return;
  

    const fetchUserRole = async () => {
      if (user) {
        const token = user.token;
        try {
          const response = await axios.get(ENDPOINTS.userProfile, {
            headers: { Authorization: `Token ${user.token}` },
          });

          setUserRole(response.data.role);

          // Redirect based on role
          if (response.data.role === "academic_registrar") {
            navigate("/AcademicRegistrar");
            return;
          }

          // Only fetch student data if user is actually a student
          if (response.data.role === "student") {
            await fetchStudentData();
          }
        } catch (err) {
          console.error("Error fetching user role:", err);
          if (err.response?.status === 401) {
            logout();
          }
        } finally {
          setLoading(false);
          //   }else {
          // console.error("User  is not authenticated.");
          // navigate("/login"); // Redirect to login if user is not authenticated
          // }      setLoading(false);
        }
      }  
    };

    const fetchStudentData = async () => {
      try {
        const [deptRes, issuesRes] = await Promise.all([
          axios.get(ENDPOINTS.departments, {
            headers: { Authorization: `Token ${user.token}` },
          }),
          axios.get(ENDPOINTS.studentIssues, {
            headers: { Authorization: `Token ${user.token}` },
          }),
        ]);

        setDepartments(deptRes.data);
        setIssues(issuesRes.data);

        if (deptRes.data.length > 0) {
          setFormData((prev) => ({ ...prev, department: deptRes.data[0].id }));
        }
      } catch (err) {
        console.error("Error fetching student data:", err);
      }
    };

    fetchUserRole();
  }, [user, navigate, logout]);

  const handleChange = (e) => {
    const { target } = e; 
     // Store e.target in a variable
  if (!target) return; // Earl
    const { name, value, files } = target;
    setFormData((prevFormData) => ({
    ...prevFormData,
    
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null && value !== "") {
        data.append(key, value);
      }
    });

    try {
      await axios.post(ENDPOINTS.raiseIssue, data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Token ${user.token}`,
        },
      });

      setSuccessMsg("Issue raised successfully.");

      // Refresh issues list
      const issuesRes = await axios.get(ENDPOINTS.studentIssues, {
        headers: { Authorization: `Token ${user.token}` },
      });
      setIssues(issuesRes.data);

      // Reset form (keep department selection)
      setFormData({
        ...formData,
        course_name: "",
        course_code: "",
        description: "",
        attachment: null,
      });
    } catch (err) {
      setError("Failed to raise issue. Please try again.");
      console.error("Error submitting issue:", err);
    }
  };

  if (!user || loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (userRole !== "student") {
    return null; // Already redirected by useEffect
  }

  // JSX for the student dashboard
  return (
    <div className="students-container">
      <header className="dashboard-header">
        <h1>Student Dashboard</h1>
        <div className="user-info">
          <span>Welcome, {user.username || "Student"}</span>
          <button onClick={logout} className="logout-btn">
            Logout
          </button>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="tabs">
        <button
          className={`tab-button ${selectedTab === "home" ? "active" : ""}`}
          onClick={() => setSelectedTab("home")}
        >
          Home
        </button>
        <button
          className={`tab-button ${selectedTab === "raiseIssue" ? "active" : ""}`}
          onClick={() => setSelectedTab("raiseIssue")}
        >
          Raise Issue
        </button>
        <button
          className={`tab-button ${selectedTab === "myIssues" ? "active" : ""}`}
          onClick={() => setSelectedTab("myIssues")}
        >
          My Issues
        </button>
      </nav>

      <main className="dashboard-content">
        {/* Home Tab Content */}
        {selectedTab === "home" && (
          <section className="tab-content">
            <div className="welcome-banner">
              <h2>Welcome to the Student Dashboard</h2>
              <p>Here you can raise and track academic issues.</p>
            </div>

            <div className="stats-container">
              <div className="stat-card">
                <h3>Total Issues</h3>
                <p className="stat-number">{issues.length}</p>
              </div>
              <div className="stat-card">
                <h3>Pending Issues</h3>
                <p className="stat-number">
                  {issues.filter((issue) => issue.status === "pending").length}
                </p>
              </div>
              <div className="stat-card">
                <h3>Resolved Issues</h3>
                <p className="stat-number">
                  {issues.filter((issue) => issue.status === "resolved").length}
                </p>
              </div>
            </div>

            <div className="quick-actions">
              <h3>Quick Actions</h3>
              <div className="action-buttons">
                <button
                  className="action-btn"
                  onClick={() => setSelectedTab("raiseIssue")}
                >
                  Raise New Issue
                </button>
                <button
                  className="action-btn"
                  onClick={() => setSelectedTab("myIssues")}
                >
                  View My Issues
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Raise Issue Tab Content */}
        {selectedTab === "raiseIssue" && (
          <section className="tab-content">
            <h2>Raise a New Issue</h2>

            {successMsg && (
              <div className="success-message">
                <p>{successMsg}</p>
              </div>
            )}

            {error && (
              <div className="error-message">
                <p>{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="issue-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="course_name">Course Name</label>
                  <input
                    type="text"
                    id="course_name"
                    name="course_name"
                    value={formData.course_name}
                    onChange={handleChange}
                    required
                    placeholder="Enter course name"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="course_code">Course Code</label>
                  <input
                    type="text"
                    id="course_code"
                    name="course_code"
                    value={formData.course_code}
                    onChange={handleChange}
                    required
                    placeholder="e.g., CS101"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="year_of_study">Year of Study</label>
                  <select
                    id="year_of_study"
                    name="year_of_study"
                    value={formData.year_of_study}
                    onChange={handleChange}
                  >
                    <option value="year_1">Year 1</option>
                    <option value="year_2">Year 2</option>
                    <option value="year_3">Year 3</option>
                    <option value="year_4">Year 4</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="category">Issue Category</label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                  >
                    <option value="Missing_Marks">Missing Marks</option>
                    <option value="Wrong_Marks">Wrong Marks</option>
                    <option value="Registration">Registration Issue</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="department">Department</label>
                <select
                  id="department"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                >
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
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
                  rows="4"
                  placeholder="Describe your issue in detail..."
                ></textarea>
              </div>

              <div className="form-group">
                <label htmlFor="attachment">Attachment (Optional)</label>
                <input
                  type="file"
                  id="attachment"
                  name="attachment"
                  onChange={handleChange}
                />
                <small>Upload any relevant documents (PDF, JPG, PNG)</small>
              </div>

              <div className="form-actions">
                <button type="submit" className="submit-btn">
                  Submit Issue
                </button>
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setSelectedTab("home")}
                >
                  Cancel
                </button>
              </div>
            </form>
          </section>
        )}

        {/* My Issues Tab Content */}
        {selectedTab === "myIssues" && (
          <section className="tab-content">
            <h2>My Issues</h2>

            {issues.length === 0 ? (
              <div className="empty-state">
                <p>You haven't raised any issues yet.</p>
                <button
                  className="action-btn"
                  onClick={() => setSelectedTab("raiseIssue")}
                >
                  Raise Your First Issue
                </button>
              </div>
            ) : (
              <div className="issues-list">
                {issues.map((issue) => (
                  <div key={issue.id} className={`issue-card ${issue.status}`}>
                    <div className="issue-header">
                      <h3>
                        {issue.course_name} ({issue.course_code})
                      </h3>
                      <span className={`status-badge ${issue.status}`}>
                        {issue.status}
                      </span>
                    </div>

                    <div className="issue-details">
                      <p className="issue-category">
                        <strong>Category:</strong>{" "}
                        {issue.category.replace("_", " ")}
                      </p>
                      <p className="issue-year">
                        <strong>Year:</strong>{" "}
                        {issue.year_of_study.replace("_", " ")}
                      </p>
                      <p className="issue-department">
                        <strong>Department:</strong>{" "}
                        {departments.find((d) => d.id === issue.department)
                          ?.name || "Unknown"}
                      </p>
                    </div>

                    <div className="issue-description">
                      <strong>Description:</strong>
                      <p>{issue.description}</p>
                    </div>

                    {issue.feedback && (
                      <div className="issue-feedback">
                        <strong>Feedback:</strong>
                        <p>{issue.feedback}</p>
                      </div>
                    )}

                    <div className="issue-footer">
                      <span className="issue-date">
                        Submitted:{" "}
                        {new Date(issue.created_at).toLocaleDateString()}
                      </span>

                      {issue.attachment && (
                        <a
                          href={issue.attachment}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="attachment-link"
                        >
                          View Attachment
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </main>

      <footer className="dashboard-footer">
        <p>&copy; {new Date().getFullYear()} Academic Issue Tracking System</p>
      </footer>
    </div>
  );
};

export default Students;
