import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css";

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    userType: "",
    studentNumberOrStaffId: "",
    useremail: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ 
      ...formData, 
      [e.target.name]: e.target.value 
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: API call for registration can be placed here.
    console.log("Submitted data:", formData);
    
    // Redirect based on selected userType
    switch(formData.userType) {
      case "Student":
        navigate("/students");
        break;
      case "Lecturer":
        navigate("/lecturers");
        break;
      case "AcademicRegistrar":
        navigate("/academic-registrar");
        break;
      default:
        navigate("/dashboard");
    }
  };

  return (
    <div className="register-container">
      <div className="register-header">Register</div>
      <form className="register-form" onSubmit={handleSubmit}>
        <label>First Name*</label>
        <input
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          required
        />

        <label>Last Name*</label>
        <input
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          required
        />

        <label>User Type*</label>
        <select 
          name="userType" 
          value={formData.userType} 
          onChange={handleChange}
          required
        >
          <option value="">Select</option>
          <option value="Student">Student</option>
          <option value="Lecturer">Lecturer</option>
          <option value="AcademicRegistrar">Academic Registrar</option>
        </select>

        <label>Student Number or Staff Id*</label>
        <input
          type="number"
          name="studentNumberOrStaffId"
          value={formData.studentNumberOrStaffId}
          onChange={handleChange}
          required
        />

        <label>User Email*</label>
        <input
          type="text"
          name="useremail"
          value={formData.useremail}
          onChange={handleChange}
          required
        />

        <label>Username*</label>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          required
        />

        <label>Password*</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <label>Confirm Password*</label>
        <input
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />

        <button type="submit">Register</button>

        <div className="register-footer">
          Already have an account? <a href="/login">Login here</a>
        </div>
      </form>
    </div>
  );
};

export default Register;
