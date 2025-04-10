import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Students.css";
import { AuthContext } from "@/context/authContext";

const ENDPOINTS = {
  studentIssues:
    "https://academic-6ea365e4b745.herokuapp.com/api/student-issues/",
  raiseIssue: "https://academic-6ea365e4b745.herokuapp.com/api/raise-issue/",
  registrars: "https://academic-6ea365e4b745.herokuapp.com/api/registrars/",
  programmes: "https://academic-6ea365e4b745.herokuapp.com/api/programmes/",
};

// Department choices - matching the backend model
const DEPT_CHOICES = [
  { value: "computer_science", label: "Computer Science Department" },
  { value: "networks", label: "Networks Department" },
  { value: "information_systems", label: "Information Systems" },
  { value: "information_technology", label: "Information Technology" },
];

// Category choices - matching the backend model
const CATEGORY_CHOICES = [
  { value: "Missing_Marks", label: "Missing marks" },
  { value: "Wrong_grading", label: "Wrong grading" },
  { value: "wrong_marks", label: "Wrong marks" },
  { value: "other", label: "Other" },
];

// Year of study choices - matching the backend model
const YEAR_CHOICES = [
  { value: "year_1", label: "Year 1" },
  { value: "year_2", label: "Year 2" },
  { value: "year_3", label: "Year 3" },
  { value: "year_4", label: "Year 4" },
  { value: "year_5", label: "Year 5" },
];

// Fallback data in case API is down - matching the backend model
const FALLBACK_DATA = {
  registrars: [
    { id: 1, username: "registrar1", name: "Registrar One", role: "registrar" },
    { id: 2, username: "registrar2", name: "Registrar Two", role: "registrar" },
  ],
  programmes: [
    {
      id: 1,
      programme_name: "computer_science",
      name: "Bachelor of Science in Computer Science",
    },
    {
      id: 2,
      programme_name: "software_engineering",
      name: "Bachelor of Science in Software Engineering",
    },
    {
      id: 3,
      programme_name: "BIST",
      name: "Bachelor Information Systems and Technology",
    },
    {
      id: 4,
      programme_name: "BLIS",
      name: "Bachelor of Library and Information Sciences",
    },
  ],
};

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
    category: "Missing_Marks",
    description: "",
    department: "computer_science",
    attachment: null,
    registrar: "",
    programme: "",
  });

  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [selectedTab, setSelectedTab] = useState("home");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Function to log available options
  const logAvailableOptions = () => {
    console.log("Available registrars:", registrars);
    console.log("Available programmes:", programmes);
  };

  // Function to validate form data against available options
  const validateFormAgainstOptions = () => {
    // Check if the selected registrar exists in the available registrars
    const registrarExists = registrars.some(
      (r) => r.username === formData.registrar || r.id === formData.registrar
    );

    // Check if the selected programme exists in the available programmes
    const programmeExists = programmes.some(
      (p) =>
        p.id === formData.programme || p.programme_name === formData.programme
    );

    // Log validation results
    console.log("Validation results:", {
      registrarExists,
      programmeExists,
      selectedRegistrar: formData.registrar,
      selectedProgramme: formData.programme,
      availableRegistrars: registrars.map((r) => r.username || r.id),
      availableProgrammes: programmes.map((p) => p.programme_name || p.id),
    });

    return { registrarExists, programmeExists };
  };

  // Add the handleChange function
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "attachment" && files && files[0]) {
      // Validate file type for attachment
      const file = files[0];
      const validImageTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/jpg",
      ];
      if (!validImageTypes.includes(file.type)) {
        setError("Attachment must be a valid image file (JPEG, PNG, or GIF)");
        return;
      }
      // Check file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (file.size > maxSize) {
        setError("Attachment file size must be less than 5MB");
        return;
      }
      setError(""); // Clear error if validation passes
    }
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  // Fetch data on component mount
  useEffect(() => {
    if (user && user.token) {
      // Fetch registrars, programmes, and issues
      const fetchData = async () => {
        try {
          // Try to fetch registrars
          try {
            const registrarsRes = await axios.get(ENDPOINTS.registrars, {
              headers: { Authorization: `Bearer ${user.token}` },
            });
            if (registrarsRes.data && registrarsRes.data.length > 0) {
              console.log("Available registrars from API:", registrarsRes.data);
              setRegistrars(registrarsRes.data);
            } else {
              console.warn(
                "No registrars returned from API, using fallback data"
              );
              setRegistrars(FALLBACK_DATA.registrars);
            }
          } catch (err) {
            console.warn(
              "Could not fetch registrars, using fallback data:",
              err
            );
            setRegistrars(FALLBACK_DATA.registrars);
          }

          // Try to fetch programmes
          try {
            const programmesRes = await axios.get(ENDPOINTS.programmes, {
              headers: { Authorization: `Bearer ${user.token}` },
            });
            if (programmesRes.data && programmesRes.data.length > 0) {
              console.log("Available programmes from API:", programmesRes.data);
              setProgrammes(programmesRes.data);
            } else {
              console.warn(
                "No programmes returned from API, using fallback data"
              );
              setProgrammes(FALLBACK_DATA.programmes);
            }
          } catch (err) {
            console.warn(
              "Could not fetch programmes, using fallback data:",
              err
            );
            setProgrammes(FALLBACK_DATA.programmes);
          }

          // Log available options after fetching
          setTimeout(logAvailableOptions, 500);

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
  }, [user, navigate]);

  // Set registrar after registrars are loaded
  useEffect(() => {
    if (registrars.length > 0 && !formData.registrar) {
      setFormData((prev) => ({
        ...prev,
        registrar: registrars[0].username || registrars[0].id,
      }));
      console.log(
        "Setting initial registrar to:",
        registrars[0].username || registrars[0].id
      );
    }
  }, [registrars]);

  // Set programme after programmes are loaded
  useEffect(() => {
    if (programmes.length > 0 && !formData.programme) {
      const programmeValue = programmes[0].programme_name || programmes[0].id;
      setFormData((prev) => ({
        ...prev,
        programme: programmeValue,
      }));
      console.log("Setting initial programme to:", programmeValue);
    }
  }, [programmes]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    setSubmitting(true);

    // Log current form data and available options
    console.log("Current form data:", formData);
    logAvailableOptions();

    // Validate form data
    if (
      !formData.course_name ||
      !formData.course_code ||
      !formData.description
    ) {
      setError("Please fill in all required fields");
      setSubmitting(false);
      return;
    }

    // Validate against available options
    const { registrarExists, programmeExists } = validateFormAgainstOptions();

    // If the selected registrar or programme doesn't exist, use the first available one
    let updatedFormData = { ...formData };
    let formDataChanged = false;

    if (!registrarExists && registrars.length > 0) {
      updatedFormData.registrar = registrars[0].username || registrars[0].id;
      formDataChanged = true;
      console.log("Updated registrar to:", updatedFormData.registrar);
    }

    if (!programmeExists && programmes.length > 0) {
      updatedFormData.programme =
        programmes[0].programme_name || programmes[0].id;
      formDataChanged = true;
      console.log("Updated programme to:", updatedFormData.programme);
    }

    // If form data was changed, update it and return
    if (formDataChanged) {
      setFormData(updatedFormData);
      setError(
        "Form data has been updated with valid options. Please submit again."
      );
      setSubmitting(false);
      return;
    }

    const data = new FormData();
    // Add all form fields to FormData
    Object.entries(updatedFormData).forEach(([key, value]) => {
      if (value !== null && value !== "") {
        data.append(key, value);
        console.log(`Adding to FormData: ${key} = ${value}`);
      }
    });

    try {
      console.log("Submitting with registrar:", updatedFormData.registrar);
      console.log("Submitting with programme:", updatedFormData.programme);
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
        category: "Missing_Marks",
        description: "",
        department: "computer_science",
        attachment: null,
        registrar: registrars[0]?.username || registrars[0]?.id || "",
        programme: programmes[0]?.programme_name || programmes[0]?.id || "",
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
          if (Array.isArray(errors)) {
            errorMessage += `\n- ${field}: ${errors.join(", ")}`;
          } else {
            errorMessage += `\n- ${field}: ${errors}`;
          }
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
                  <label htmlFor="course_code">Course Code*</label>
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
                  <label htmlFor="year_of_study">Year of Study*</label>
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
                  <label htmlFor="category">Issue Category*</label>
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
                <label htmlFor="department">Department*</label>
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
                  <label htmlFor="registrar">Academic Registrar*</label>
                  <select
                    id="registrar"
                    name="registrar"
                    value={formData.registrar}
                    onChange={handleChange}
                    required
                    disabled={submitting}
                  >
                    {registrars.map((reg) => (
                      <option
                        key={reg.id || reg.username}
                        value={reg.username || reg.id}
                      >
                        {reg.name || reg.username}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="programme">Programme*</label>
                  <select
                    id="programme"
                    name="programme"
                    value={formData.programme}
                    onChange={handleChange}
                    required
                    disabled={submitting}
                  >
                    {programmes.map((prog) => (
                      <option key={prog.id} value={prog.id}>
                        {prog.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="description">Description*</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows="4"
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
                    <li key={reg.id || reg.username}>
                      {reg.username} - {reg.name || "No name"}
                    </li>
                  ))}
                </ul>
                <p>
                  <strong>Available Programmes:</strong>
                </p>
                <ul>
                  {programmes.map((prog) => (
                    <li key={prog.id}>
                      {prog.id} - {prog.name}
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
