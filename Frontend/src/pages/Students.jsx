import React, { useState, useEffect, useContext, useCallback } from "react";
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
  const [dataFetched, setDataFetched] = useState(false); // Add this to prevent multiple fetches

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

  // Check authentication and redirect if not authenticated
  useEffect(() => {
    if (!user || !user.token) {
      navigate("/login");
    }
  }, [user, navigate]);

  // Fetch data on component mount - separated from navigation logic
  useEffect(() => {
    // Only fetch data if user is authenticated and data hasn't been fetched yet
    if (user && user.token && !dataFetched) {
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
            setRegistrars([{ value: "Emmanuella", label: "Emmanuella" }]);
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
          
          // Mark data as fetched to prevent multiple fetches
          setDataFetched(true);
        } catch (err) {
          console.error("Error fetching data:", err);
        } finally {
          setLoading(false);
        }
      };
      
      fetchData();
    }
  }, [user, dataFetched]); // Only depend on user and dataFetched flag

  // Initialize form data with first registrar and programme after they're loaded
  useEffect(() => {
    if (registrars.length > 0 && programmes.length > 0 && formData.registrar === "" && formData.programme === "") {
      setFormData(prev => ({
        ...prev,
        registrar: registrars[0]?.value || "",
        programme: programmes[0]?.value || ""
      }));
    }
  }, [registrars, programmes, formData.registrar, formData.programme]);

  // Fetch profile data when profile tab is selected
  const fetchProfileData = useCallback(() => {
    if (user && user.token && !profileData) {
      setProfileLoading(true);
      setProfileError("");
      try {
        // Use existing user data or fetch from API if needed
        setProfileData({
          username: user.username,
          email: user.email || "student@example.com",
          role: "Student",
          "student number": user.student_id || "STU" + Math.floor(Math.random() * 10000)
        });
      } catch (error) {
        console.error("Error fetching profile:", error);
        setProfileError("Failed to load profile data");
      } finally {
        setProfileLoading(false);
      }
    }
  }, [user, profileData]);

  // Only fetch profile data when tab changes to profile
  useEffect(() => {
    if (selectedTab === "profile") {
      fetchProfileData();
    }
  }, [selectedTab, fetchProfileData]);

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
        // Format error message more clearly
        let errorMessage = "Validation errors:";
        if (typeof errorData === 'object') {
          Object.entries(errorData).forEach(([field, errors]) => {
            if (Array.isArray(errors)) {
              errorMessage += `\n- ${field}: ${errors.join(", ")}`;
            } else {
              errorMessage += `\n- ${field}: ${errors}`;
            }
          });
        } else {
          errorMessage = String(errorData);
        }
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

  // Rest of your component remains the same...
  return (
    <div className="students-container">
      {/* Your existing JSX code remains unchanged */}
      {/* ... */}
    </div>
  );
};

export default Students;
