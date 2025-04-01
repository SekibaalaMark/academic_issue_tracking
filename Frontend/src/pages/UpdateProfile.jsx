// src/pages/UpdateProfile.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./UpdateProfile.css";

const UpdateProfile = () => {
  const [profile, setProfile] = useState({
    email: "",
    firstName: "",
    middleName: "",
    lastName: "",
    gender: "",
    phone: "",
    studentNumber: "",
    registrationNumber: "",
    course: "Computer Science",
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("/api/profile/")
      .then((response) => {
        setProfile({
          email: response.data.email || "",
          firstName: response.data.first_name || "",
          middleName: response.data.middle_name || "",
          lastName: response.data.last_name || "",
          gender: response.data.gender || "",
          phone: response.data.phone || "",
          studentNumber: response.data.student_number || "",
          registrationNumber: response.data.registration_number || "",
          course: response.data.course || "Computer Science",
        });
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to fetch profile.");
        setLoading(false);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    axios
      .put("/api/profile/", {
        email: profile.email,
        first_name: profile.firstName,
        middle_name: profile.middleName,
        last_name: profile.lastName,
        gender: profile.gender,
        phone: profile.phone,
        student_number: profile.studentNumber,
        registration_number: profile.registrationNumber,
        course: profile.course,
      })
      .then((response) => {
        setMessage("Profile updated successfully!");
      })
      .catch((err) => {
        setError("Failed to update profile.");
      });
  };

  if (loading) {
    return <div className="update-profile-page">Loading...</div>;
  }

  return (
    <div className="update-profile-page">
      <header className="page-header">
        <h1>Academic Issue Tracking</h1>
        <nav>
          <ul>
            <li onClick={() => navigate("/")}>Home</li>
            <li onClick={() => navigate("/students")}>Dashboard</li>
            <li onClick={() => navigate("/update-profile")}>Profile</li>
          </ul>
        </nav>
      </header>
      <div className="update-profile-container">
        <div className="profile-content">
          <h2 className="profile-header">Edit Your Profile</h2>
          {message && <div className="success-message">{message}</div>}
          {error && <div className="error-message">{error}</div>}
          <form className="profile-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>E-mail</label>
              <input
                type="email"
                name="email"
                value={profile.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>First Name</label>
              <input
                type="text"
                name="firstName"
                value={profile.firstName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Middle Name</label>
              <input
                type="text"
                name="middleName"
                value={profile.middleName}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Last Name</label>
              <input
                type="text"
                name="lastName"
                value={profile.lastName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Gender</label>
              <select name="gender" value={profile.gender} onChange={handleChange}>
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input
                type="text"
                name="phone"
                value={profile.phone}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Student Number</label>
              <input
                type="text"
                name="studentNumber"
                value={profile.studentNumber}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Registration Number</label>
              <input
                type="text"
                name="registrationNumber"
                value={profile.registrationNumber}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Course</label>
              <select name="course" value={profile.course} onChange={handleChange}>
                <option value="Computer Science">Computer Science</option>
                <option value="Software Engineering">Software Engineering</option>
                <option value="BIST">BIST</option>
                <option value="BLIS">BLIS</option>
              </select>
            </div>
            <button type="submit" className="btn-update">
              Update Profile
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateProfile;
