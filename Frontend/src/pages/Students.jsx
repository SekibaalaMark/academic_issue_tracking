import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Students.css";
import { AuthContext } from "@/context/authContext";
import { initDb, runQuery } from "../db/sqlHelper";

const ENDPOINTS = {
  studentIssues:
    "https://academic-6ea365e4b745.herokuapp.com/api/student-issues/",
  raiseIssue: "https://academic-6ea365e4b745.herokuapp.com/api/raise-issue/",
  registrars: "https://academic-6ea365e4b745.herokuapp.com/api/registrars/",
  programmes: "https://academic-6ea365e4b745.herokuapp.com/api/programmes/",
};

// Department choices
const DEPT_CHOICES = [
  { value: "computer_science", label: "Computer Science Department" },
  { value: "networks", label: "Networks Department" },
  { value: "information_systems", label: "Information Systems" },
  { value: "information_technology", label: "Information Technology" },
];

// Category choices - corrected format based on API error
const CATEGORY_CHOICES = [
  { value: "missing_marks", label: "Missing Marks" },
  { value: "wrong_marks", label: "Wrong Marks" },
  { value: "registration", label: "Registration Issue" },
  { value: "other", label: "Other" },
];

const Students = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [issues, setIssues] = useState([]);
  const [registrars, setRegistrars] = useState([]);
  const [programmes, setProgrammes] = useState([]);
  const [formData, setFormData] = useState({
    course_name: "",
    course_code: "",
    year_of_study: "year_1",
    category: "missing_marks",
    description: "",
    department: "computer_science",
    attachment: null,
    registrar: "", // Will be set after fetching registrars
    programme: "", // Will be set after fetching programmes
  });
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [selectedTab, setSelectedTab] = useState("home");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState("");
  const [profileData, setProfileData] = useState(null);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "attachment" && files && files[0]) {
      setFormData({
        ...formData,
        attachment: files[0],
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    if (user && user.token) {
      // Fetch registrars, programmes, and issues
      const fetchData = async () => {
        setLoading(true);

        try {
          // Fetch registrars
          try {
            const registrarsResponse = await axios.get(ENDPOINTS.registrars, {
              headers: {
                Authorization: `Bearer ${user.token}`,
              },
            });

            if (registrarsResponse.data.success) {
              setRegistrars(registrarsResponse.data.data);
            }
          } catch (error) {
            console.error("Error fetching registrars:", error);
            // Fallback data in case API fails
            setRegistrars([{ value: "nairah", label: "nairah" }]);
          }

          // Fetch programmes
          try {
            const programmesResponse = await axios.get(ENDPOINTS.programmes, {
              headers: {
                Authorization: `Bearer ${user.token}`,
              },
            });

            if (programmesResponse.data.success) {
              setProgrammes(programmesResponse.data.data);
            }
          } catch (error) {
            console.error("Error fetching programmes:", error);
            // Fallback data in case API fails
            setProgrammes([
              {
                value: "computer_science",
                label: "Bachelor of Science in Computer Science",
              },
              {
                value: "software_engineering",
                label: "Bachelor of Science in Software Engineering",
              },
              {
                value: "BIST",
                label: "Bachelor Information Systems and Technology",
              },
              {
                value: "BLIS",
                label: "Bachelor of Library and Information Sciences",
              },
            ]);
          }

          // Fetch student issues
          try {
            const issuesRes = await axios.get(ENDPOINTS.studentIssues, {
              headers: { Authorization: `Bearer ${user.token}` },
            });
            setIssues(issuesRes.data);
          } catch (err) {
            console.error("Error fetching issues:", err);
            setIssues([]);
          }
        } catch (err) {
          console.error("Error fetching data:", err);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    } else {
      navigate("/login");
    }
  }, [user, navigate]); // Keep dependencies minimal to avoid infinite loops

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    setSubmitting(true);

    // Validate form data
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

    // Validate registrar exists
    const registrarExists = registrars.some(
      (r) => r.value === formData.registrar
    );

    if (!registrarExists) {
      setError(
        `Registrar with username '${formData.registrar}' does not exist.`
      );
      setSubmitting(false);
      return;
    }

    // Validate programme exists
    const programmeExists = programmes.some(
      (p) => p.value === formData.programme
    );

    if (!programmeExists) {
      setError(`Programme '${formData.programme}' does not exist.`);
      setSubmitting(false);
      return;
    }

    const data = new FormData();

    // Add all form fields to FormData
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null && value !== "") {
        data.append(key, value);
        console.log(`Adding to FormData: ${key} = ${value}`);
      }
    });

    try {
      console.log("Submitting with registrar:", formData.registrar);
      console.log("Submitting with programme:", formData.programme);

      const response = await axios.post(ENDPOINTS.raiseIssue, data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${user.token}`,
        },
      });

      console.log("Issue submission response:", response);
      setSuccessMsg("Issue raised successfully.");

      // Reset form after successful submission
      setFormData({
        course_name: "",
        course_code: "",
        year_of_study: "year_1",
        category: "missing_marks",
        description: "",
        department: "computer_science",
        attachment: null,
        registrar: registrars[0]?.value || "",
        programme: programmes[0]?.value || "",
      });

      // Refresh issues list
      try {
        const issuesRes = await axios.get(ENDPOINTS.studentIssues, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setIssues(issuesRes.data);
      } catch (err) {
        console.error("Error refreshing issues:", err);
      }

      // Switch to My Issues tab after a short delay
      setTimeout(() => {
        setSelectedTab("myIssues");
      }, 2000);
    } catch (err) {
      console.error("Error submitting issue:", err);
      if (err.response?.data) {
        const errorData = err.response.data;
        console.log("API error response:", errorData);
        // Format error message more clearly
        let errorMessage = "Validation errors:";
        Object.entries(errorData).forEach(([field, errors]) => {
          errorMessage += `\n- ${field}: ${errors.join(", ")}`;
        });
        setError(errorMessage);
      } else {
        setError(`Error: ${err.message || "Unknown error occurred"}`);
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="students-container">
      <header className="dashboard-header">
        <h1>Student Dashboard</h1>
        <div className="user-info">
          <span>Welcome, {user?.username || "Student"}</span>
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
          className={`tab-button ${selectedTab === "profile" ? "active" : ""}`}
          onClick={() => setSelectedTab("profile")}
        >
          My Profile
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
        {/* Profile Tab Content */}
        {selectedTab === "profile" && (
          <section className="tab-content">
            <h2>My Profile</h2>
            {profileLoading ? (
              <div className="loading-spinner">Loading profile...</div>
            ) : profileError ? (
              <div className="error-message">{profileError}</div>
            ) : profileData ? (
              <div className="profile-card">
                <div className="profile-header">
                  <div className="profile-avatar">
                    <span>
                      {profileData.username
                        ? profileData.username[0].toUpperCase()
                        : "S"}
                    </span>
                  </div>
                  <div className="profile-title">
                    <h3>{profileData.username}</h3>
                    <span className="role-badge">{profileData.role}</span>
                  </div>
                </div>
                <div className="profile-details">
                  <div className="detail-item">
                    <span className="detail-label">Email:</span>
                    <span className="detail-value">{profileData.email}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Student Number:</span>
                    <span className="detail-value">
                      {profileData["student number"]}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Account Status:</span>
                    <span className="detail-value status-active">Active</span>
                  </div>
                </div>
                <div className="profile-summary">
                  <h4>Issues Summary</h4>
                  <div className="summary-stats">
                    <div className="summary-stat">
                      <span className="stat-value">{issues.length}</span>
                      <span className="stat-label">Total Issues</span>
                    </div>
                    <div className="summary-stat">
                      <span className="stat-value">
                        {
                          issues.filter((issue) => issue.status === "pending")
                            .length
                        }
                      </span>
                      <span className="stat-label">Pending</span>
                    </div>
                    <div className="summary-stat">
                      <span className="stat-value">
                        {
                          issues.filter(
                            (issue) => issue.status === "in_progress"
                          ).length
                        }
                      </span>
                      <span className="stat-label">In Progress</span>
                    </div>
                    <div className="summary-stat">
                      <span className="stat-value">
                        {
                          issues.filter((issue) => issue.status === "resolved")
                            .length
                        }
                      </span>
                      <span className="stat-label">Resolved</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="no-profile">
                Profile information not available
              </div>
            )}
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
                  <label htmlFor="course_name">Course Name*</label>
                  <input
                    type="text"
                    id="course_name"
                    name="course_name"
                    value={formData.course_name}
                    onChange={handleChange}
                    required
                    placeholder="Enter course name"
                    disabled={submitting}
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
                    disabled={submitting}
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
                    disabled={submitting}
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
                    disabled={submitting}
                  >
                    {CATEGORY_CHOICES.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
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
                  required
                  disabled={submitting}
                >
                  {DEPT_CHOICES.map((dept) => (
                    <option key={dept.value} value={dept.value}>
                      {dept.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="registrar">Academic Registrar</label>
                  <select
                    id="registrar"
                    name="registrar"
                    value={formData.registrar}
                    onChange={handleChange}
                    required
                    disabled={loading || submitting}
                  >
                    <option value="">Select a registrar</option>
                    {registrars.map((reg) => (
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
                    disabled={loading || submitting}
                  >
                    <option value="">Select a programme</option>
                    {programmes.map((prog) => (
                      <option key={prog.value} value={prog.value}>
                        {prog.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows="6"
                  placeholder="Describe your issue in detail..."
                  disabled={submitting}
                ></textarea>
              </div>
              <div className="form-group">
                <label htmlFor="attachment">
                  Attachment (Optional - JPG/PNG only)
                </label>
                <input
                  type="file"
                  id="attachment"
                  name="attachment"
                  onChange={handleChange}
                  accept="image/jpeg,image/png,image/gif,image/jpg"
                  disabled={submitting}
                />
                <small>Upload any relevant images (JPG, PNG only)</small>
              </div>
              <div className="form-actions">
                <button
                  type="submit"
                  className="submit-btn"
                  disabled={submitting}
                >
                  {submitting ? "Submitting..." : "Submit Issue"}
                </button>
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setSelectedTab("home")}
                  disabled={submitting}
                >
                  Cancel
                </button>
              </div>
            </form>
            {/* Add the debug section here, right after the form */}
            {process.env.NODE_ENV === "development" && (
              <div
                className="debug-info"
                style={{
                  marginTop: "20px",
                  padding: "10px",
                  border: "1px solid #ccc",
                  borderRadius: "5px",
                }}
              >
                <h4>Debug Information</h4>
                <p>
                  <strong>Available Registrars:</strong>
                </p>
                <ul>
                  {registrars.map((reg) => (
                    <li key={reg.value || reg.id}>
                      {reg.label || reg.username} - {reg.name || "No name"}
                    </li>
                  ))}
                </ul>
                <p>
                  <strong>Available Programmes:</strong>
                </p>
                <ul>
                  {programmes.map((prog) => (
                    <li key={prog.value || prog.id}>
                      {prog.value || prog.id} - {prog.label || prog.name}
                    </li>
                  ))}
                </ul>
                <p>
                  <strong>Current Form Data:</strong>
                </p>
                <pre>{JSON.stringify(formData, null, 2)}</pre>
              </div>
            )}
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
                        {issue.status.replace("_", " ")}
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
                        {issue.department.replace("_", " ")}
                      </p>
                      <p className="issue-description">
                        <strong>Description:</strong> {issue.description}
                      </p>
                      {issue.attachment && (
                        <div className="issue-attachment">
                          <strong>Attachment:</strong>
                          <a
                            href={issue.attachment}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            View Attachment
                          </a>
                        </div>
                      )}
                      <p className="issue-date">
                        <strong>Date Submitted:</strong>{" "}
                        {new Date(issue.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
};

export default Students;
