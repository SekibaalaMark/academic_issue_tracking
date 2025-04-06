import React, { useState } from "react";
import "./Register.css";

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    gender: "",
    phone: "",
    userType: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({ 
      ...formData, 
      [e.target.name]: e.target.value 
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Password match validation
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    // API placeholder (to be replaced later)
    console.log("Submitted data:", formData);
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

        <label>Middle Name</label>
        <input
          type="text"
          name="middleName"
          value={formData.middleName}
          onChange={handleChange}
        />

        <label>Last Name*</label>
        <input
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          required
        />

        <label>Gender*</label>
        <select 
          name="gender" 
          value={formData.gender} 
          onChange={handleChange} 
          required
        >
          <option value="">Select</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>

        <label>Phone*</label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
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
          <option value="Registrar">Registrar</option>
        </select>

        <label>E-Mail Address*</label>
        <input
          type="email"
          name="email"
          value={formData.email}
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
          <a href="/forgot-password">Trouble Signing up?</a>
        </div>
      </form>
    </div>
  );
};

export default Register;
