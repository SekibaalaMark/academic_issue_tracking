import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import "./Students.css";

const ENDPOINTS = {
  departments: "https://your-api.com/api/departments/",
  studentIssues: "https://your-api.com/api/student-issues/",
  raiseIssue: "https://your-api.com/api/raise-issue/",
  userProfile: "https://your-api.com/api/user/profile/"  // Added endpoint for role checking
};

const Students = () => {
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
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchUserRole = async () => {
      try {
        const response = await axios.get(ENDPOINTS.userProfile, {
          headers: { Authorization: `Token ${user.token}` }
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
      }
    };

    const fetchStudentData = async () => {
      try {
        const [deptRes, issuesRes] = await Promise.all([
          axios.get(ENDPOINTS.departments, {
            headers: { Authorization: `Token ${user.token}` }
          }),
          axios.get(ENDPOINTS.studentIssues, {
            headers: { Authorization: `Token ${user.token}` }
          })
        ]);

        setDepartments(deptRes.data);
        setIssues(issuesRes.data);

        if (deptRes.data.length > 0) {
          setFormData(prev => ({ ...prev, department: deptRes.data[0].id }));
        }
      } catch (err) {
        console.error("Error fetching student data:", err);
      }
    };

    fetchUserRole();
  }, [user, navigate, logout]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value
    });
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
          Authorization: `Token ${user.token}`
        }
      });

      setSuccessMsg("Issue raised successfully.");
      
      // Refresh issues list
      const issuesRes = await axios.get(ENDPOINTS.studentIssues, {
        headers: { Authorization: `Token ${user.token}` }
      });
      setIssues(issuesRes.data);

      // Reset form (keep department selection)
      setFormData({
        ...formData,
        course_name: "",
        course_code: "",
        description: "",
        attachment: null
      });
    } catch (err) {
      setError("Failed to raise issue. Please try again.");
      console.error("Error submitting issue:", err);
    }
  };

  if (!user || loading) {
    return <div className="loading">Loading...</div>;
  }

  if (userRole !== "student") {
    return null; // Already redirected by useEffect
  }   
};

export default Students;