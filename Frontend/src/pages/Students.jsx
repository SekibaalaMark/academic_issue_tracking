import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Students.css";
import { AuthContext } from "../context/authContext";

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

  // Debugging in fetchData
  useEffect(() => {
    if (user && user.token && !dataFetched) {
      const fetchData = async () => {
        setLoading(true);
        try {
          const issuesRes = await axios.get(ENDPOINTS.studentIssues, {
            headers: { Authorization: `Bearer ${user.token}` },
          });
          console.log("Fetched issues:", issuesRes.data); // Debugging log
          setIssues(issuesRes.data || []);
          setDataFetched(true);
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
      <div className="students-header">
        <h1>Student Dashboard</h1>
        <button onClick={logout} className="logout-btn">
          Logout
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
        <div className="issues-list">
          <h2>Your Issues</h2>
          {issues.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📝</div>
              <h3>No Issues Found</h3>
              <p>You haven't raised any issues yet. Click the button below to get started.</p>
              <button 
                className="empty-state-action"
                onClick={() => setSelectedTab("raiseIssue")}
              >
                Raise New Issue
              </button>
            </div>
          ) : (
            issues.map((issue) => (
              <IssueCard key={issue.id} issue={issue} />
            ))
          )}
        </div>
      )}

      {selectedTab === "raiseIssue" && (
        <form onSubmit={handleSubmit} className="issue-form">
          <h2>Raise a New Issue</h2>
          {error && <p className="error">{error}</p>}
          <div className="form-group">
            <label htmlFor="course_name">Course Name</label>
            <input
              type="text"
              id="course_name"
              name="course_name"
              value={formData.course_name}
              onChange={handleChange}
              required
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
            />
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
    </div>
  );
};

export default Students;
