import React, { useState, useEffect, useContext, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Students.css";
import { AuthContext } from "@/context/authContext";

const ENDPOINTS = {
  studentIssues: "https://aits2-backend.onrender.com/api/student-issues/",
  raiseIssue: "https://aits2-backend.onrender.com/api/raise-issue/",
  registrars: "https://aits2-backend.onrender.com/api/registrars/", // Verify endpoint
  programmes: "https://aits2-backend.onrender.com/api/programmes/", // Verify endpoint
};

const DEPT_CHOICES = [
  { value: "computer_science", label: "Computer Science Department" },
  { value: "networks", label: "Networks Department" },
  { value: "information_systems", label: "Information Systems" },
  { value: "information_technology", label: "Information Technology" },
];

const CATEGORY_CHOICES = [
  { value: "Missing_Marks", label: "Missing marks" },
  { value: "Wrong_grading", label: "Wrong grading" },
  { value: "wrong_marks", label: "Wrong marks" },
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
    year_of_study: "",
    category: "",
    description: "",
    department: "",
    attachment: null,
    registrar: "",
    programme: "",
  });
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [selectedTab, setSelectedTab] = useState("home");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState("");
  const [profileData, setProfileData] = useState(null);
  const [dataFetched, setDataFetched] = useState(false);

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

  // Fetch data
  useEffect(() => {
    if (user && user.token && !dataFetched) {
      const fetchData = async () => {
        setLoading(true);
        try {
          // Fetch registrars
          try {
            const registrarsResponse = await axios.get(ENDPOINTS.registrars, {
              headers: { Authorization: `Bearer ${user.token}` },
            });
            if (registrarsResponse.data.success) {
              setRegistrars(registrarsResponse.data.data);
            } else {
              throw new Error("No registrar data returned");
            }
          } catch (error) {
            console.error("Error fetching registrars:", error);
            setError("Failed to fetch registrars. Using fallback data.");
            setRegistrars([{ value: "Emmanuella", label: "Emmanuella" }]);
          }

          // Fetch programmes
          try {
            const programmesResponse = await axios.get(ENDPOINTS.programmes, {
              headers: { Authorization: `Bearer ${user.token}` },
            });
            if (programmesResponse.data.success) {
              setProgrammes(programmesResponse.data.data);
            } else {
              throw new Error("No programme data returned");
            }
          } catch (error) {
            console.error("Error fetching programmes:", error);
            setError("Failed to fetch programmes. Using fallback data.");
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
            setIssues(issuesRes.data || []);
          } catch (err) {
            console.error("Error fetching issues:", err);
            setIssues([]);
            setError("Failed to fetch issues.");
          }

          setDataFetched(true);
        } catch (err) {
          console.error("Error fetching data:", err);
          setError("An error occurred while loading data.");
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [user, dataFetched]);

  // Fetch profile data
  const fetchProfileData = useCallback(() => {
    if (user && user.token && !profileData) {
      setProfileLoading(true);
      setProfileError("");
      try {
        setProfileData({
          username: user.username,
          email: user.email || "student@example.com",
          role: "Student",
          "student number":
            user.student_id || "STU" + Math.floor(Math.random() * 10000),
        });
      } catch (error) {
        console.error("Error fetching profile:", error);
        setProfileError("Failed to load profile data");
      } finally {
        setProfileLoading(false);
      }
    }
  }, [user, profileData]);

  useEffect(() => {
    if (selectedTab === "profile") {
      fetchProfileData();
    }
  }, [selectedTab, fetchProfileData]);

  // Form submission
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

    const registrarExists = registrars.some(
      (r) => r.value === formData.registrar
    );
    if (!registrarExists) {
      setError(`Registrar '${formData.registrar}' does not exist.`);
      setSubmitting(false);
      return;
    }

    const programmeExists = programmes.some(
      (p) => p.value === formData.programme
    );
    if (!programmeExists) {
      setError(`Programme '${formData.programme}' does not exist.`);
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

      setSuccessMsg("Issue raised successfully.");

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
      try {
        const issuesRes = await axios.get(ENDPOINTS.studentIssues, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setIssues(issuesRes.data || []);
      } catch (err) {
        console.error("Error refreshing issues:", err);
        setError("Failed to refresh issues list.");
      }

      // Stay on "Raise Issue" tab to avoid rendering issues until data is fixed
      // Remove setTimeout to prevent automatic tab switch
    } catch (err) {
      console.error("Error submitting issue:", err);
      if (err.response?.data) {
        let errorMessage = "Validation errors:";
        Object.entries(err.response.data).forEach(([field, errors]) => {
          errorMessage += `\n- ${field}: ${Array.isArray(errors) ? errors.join(", ") : errors}`;
        });
        setError(errorMessage);
      } else {
        setError(`Error: ${err.message || "Unknown error occurred"}`);
      }
    } finally {
      setSubmitting(false);
    }
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
                    <option value="" disabled>
                      Select an option
                    </option>
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
                    <option value="" disabled>
                      Select an option
                    </option>
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
                  <option value="" disabled>
                    Select an option
                  </option>
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
                    <option value="" disabled>
                      Select an option
                    </option>
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
                    <option value="" disabled>
                      Select an option
                    </option>
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
                        {(typeof issue.status === "string"
                          ? issue.status
                          : "Unknown"
                        ).replace("_", " ")}
                      </span>
                    </div>
                    <div className="issue-details">
                      <p className="issue-category">
                        <strong>Category:</strong>{" "}
                        {(typeof issue.category === "string"
                          ? issue.category
                          : "N/A"
                        ).replace("_", " ")}
                      </p>
                      <p className="issue-year">
                        <strong>Year:</strong>{" "}
                        {(typeof issue.year_of_study === "string"
                          ? issue.year_of_study
                          : "N/A"
                        ).replace("_", " ")}
                      </p>
                      <p className="issue-department">
                        <strong>Department:</strong>{" "}
                        {(typeof issue.department === "string"
                          ? issue.department
                          : "N/A"
                        ).replace("_", " ")}
                      </p>
                      <p className="issue-description">
                        <strong>Description:</strong>{" "}
                        {issue.description || "No description"}
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
                        {issue.created_at
                          ? new Date(issue.created_at).toLocaleDateString()
                          : "N/A"}
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

// Error Boundary Component

class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught in ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          className="error-boundary"
          style={{ padding: "20px", textAlign: "center" }}
        >
          <h2>Something went wrong.</h2>
          <p>{this.state.error?.message || "An unexpected error occurred."}</p>
          <button
            className="action-btn"
            onClick={() => window.location.reload()}
          ></button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function StudentsWithErrorBoundary() {
  return (
    <ErrorBoundary>
      <Students />
    </ErrorBoundary>
  );
}
