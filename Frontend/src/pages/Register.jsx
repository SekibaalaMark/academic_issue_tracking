import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";


const Register = () => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    role: "",
    email: "",
    username: "",
    password: "",
    password_confirmation: "",
    staff_id_or_student_no: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [verificationNeeded, setVerificationNeeded] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  
  const navigate = useNavigate();

  // Valid IDs based on the serializer
  const STUDENT_IDENTIFICATION_NUMBERS = [0, 111, 222, 333, 444, 555, 1000, 2000, 3000];
  const REGISTRAR_IDS = [20, 30, 40, 50, 60];
  const LECTURER_IDS = [11, 22, 33, 44, 55];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Validate passwords match
    if (formData.password !== formData.password_confirmation) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    // Validate password length
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      setIsLoading(false);
      return;
    }

    // Validate email is gmail
    if (!formData.email.endsWith('@gmail.com')) {
      setError("Only Gmail accounts are allowed");
      setIsLoading(false);
      return;
    }

    // Validate staff_id_or_student_no based on role
    const idNumber = parseInt(formData.staff_id_or_student_no);
    if (isNaN(idNumber)) {
      setError("ID/Student number must be a number");
      setIsLoading(false);
      return;
    }

    if (formData.role === "student" && !STUDENT_IDENTIFICATION_NUMBERS.includes(idNumber)) {
      setError(`Student number must be one of: ${STUDENT_IDENTIFICATION_NUMBERS.join(', ')}`);
      setIsLoading(false);
      return;
    } else if (formData.role === "lecturer" && !LECTURER_IDS.includes(idNumber)) {
      setError(`Lecturer ID must be one of: ${LECTURER_IDS.join(', ')}`);
      setIsLoading(false);
      return;
    } else if (formData.role === "registrar" && !REGISTRAR_IDS.includes(idNumber)) {
      setError(`Registrar ID must be one of: ${REGISTRAR_IDS.join(', ')}`);
      setIsLoading(false);
      return;
    }

    try {
      // Create payload for backend
      const payload = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        role: formData.role,
        email: formData.email,
        username: formData.username,
        password: formData.password,
        password_confirmation: formData.password_confirmation,
        staff_id_or_student_no: formData.staff_id_or_student_no
      };

      console.log("Sending registration data:", payload);

      const response = await axios.post(
        "http://127.0.0.1:8000/api/registration/", 
        payload
      );

      console.log("Registration response:", response.data);

      if (response.data && (response.data.message === "User Created Successfully" || response.data.tokens)) {
        // Show verification needed screen
        setVerificationNeeded(true);
        setVerificationEmail(formData.email);
        alert("Registration successful! Please verify your email with the code sent to your inbox.");
      } else {
        // Something unexpected happened
        setError("Registration was not successful. Please try again.");
      }
    } catch (err) {
      console.error("Registration error:", err);
      
      // Handle different types of error responses
      if (err.response && err.response.data) {
        if (typeof err.response.data === 'string') {
          setError(err.response.data);
        } else if (err.response.data.message) {
          setError(err.response.data.message);
        } else {
          // Handle nested error objects
          const errorMessages = [];
          Object.entries(err.response.data).forEach(([key, value]) => {
            if (Array.isArray(value)) {
              errorMessages.push(`${key}: ${value.join(', ')}`);
            } else if (typeof value === 'string') {
              errorMessages.push(`${key}: ${value}`);
            }
          });
          setError(errorMessages.join('; '));
        }
      } else {
        setError("Registration failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyEmail = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/verify-email/", 
        {
          email: verificationEmail,
          code: verificationCode
        }
      );

      console.log("Verification response:", response.data);
      alert("Email verified successfully! You can now login.");
      navigate("/login");
    } catch (err) {
      console.error("Verification error:", err);
      setError(
        err.response?.data?.error || 
        "Verification failed. Please check your code and try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setError("");
    setIsLoading(true);

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/resend-verification-code/", 
        {
          email: verificationEmail
        }
      );

      console.log("Resend code response:", response.data);
      alert("Verification code has been resent to your email.");
    } catch (err) {
      console.error("Resend code error:", err);
      setError(
        err.response?.data?.Error || 
        "Failed to resend verification code. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // If verification is needed, show verification form
  if (verificationNeeded) {
    return (
      <div className="register-container">
        <div className="register-header">Verify Your Email</div>
        <form className="register-form" onSubmit={handleVerifyEmail}>
          <p>A verification code has been sent to {verificationEmail}. Please enter it below to complete your registration.</p>
          
          <label>Verification Code*</label>
          <input
            type="text"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            required
          />
          
          {error && <div className="error-message">{error}</div>}
          
          <button type="submit" disabled={isLoading}>
            {isLoading ? "Verifying..." : "Verify Email"}
          </button>
          
          <div className="register-footer">
            Didn't receive the code? 
            <button 
              type="button" 
              onClick={handleResendCode} 
              disabled={isLoading}
              className="resend-button"
            >
              Resend Code
            </button>
          </div>
        </form>
      </div>
    );
  }

  // Helper function to get valid IDs for the selected role
  const getValidIdsForRole = () => {
    switch(formData.role) {
      case "student":
        return STUDENT_IDENTIFICATION_NUMBERS;
      case "lecturer":
        return LECTURER_IDS;
      case "registrar":
        return REGISTRAR_IDS;
      default:
        return [];
    }
  };

  // Get label text based on role
  const getIdFieldLabel = () => {
    switch(formData.role) {
      case "student":
        return "Student Number*";
      case "lecturer":
        return "Staff ID*";
      case "registrar":
        return "Staff ID*";
      default:
        return "ID Number*";
    }
  };

  return (
    <div className="register-container">
      <div className="register-header">Register</div>
      <form className="register-form" onSubmit={handleSubmit}>
        <label>First Name*</label>
        <input
          type="text"
          name="first_name"
          value={formData.first_name}
          onChange={handleChange}
          required
        />
        
        <label>Last Name*</label>
        <input
          type="text"
          name="last_name"
          value={formData.last_name}
          onChange={handleChange}
          required
        />
        
        <label>User Type*</label>
        <select 
          name="role"
          value={formData.role}
          onChange={handleChange}
          required
        >
          <option value="">Select</option>
          <option value="student">Student</option>
          <option value="lecturer">Lecturer</option>
          <option value="registrar">Registrar</option>
        </select>
        
        {formData.role && (
          <>
            <label>{getIdFieldLabel()}</label>
            <select
              name="staff_id_or_student_no"
              value={formData.staff_id_or_student_no}
              onChange={handleChange}
              required
            >
              <option value="">Select {formData.role === "student" ? "Student Number" : "Staff ID"}</option>
              {getValidIdsForRole().map(id => (
                <option key={id} value={id}>{id}</option>
              ))}
            </select>
            <small className="help-text">
              {formData.role === "student" 
                ? "Valid student numbers: 0, 111, 222, 333, 444, 555, 1000, 2000, 3000" 
                : formData.role === "lecturer" 
                  ? "Valid lecturer IDs: 11, 22, 33, 44, 55"
                  : "Valid registrar IDs: 20, 30, 40, 50, 60"}
            </small>
          </>
        )}
        
        <label>Username*</label>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          required
        />
        
        <label>Email* (Gmail only)</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          placeholder="example@gmail.com"
        />
        <small className="help-text">Only Gmail accounts are allowed</small>
        
        <label>Password* (min 8 characters)</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
          minLength="8"
        />
        
        <label>Confirm Password*</label>
        <input
          type="password"
          name="password_confirmation"
          value={formData.password_confirmation}
          onChange={handleChange}
          required
          minLength="8"
        />
        
        {error && <div className="error-message">{error}</div>}
        
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Registering..." : "Register"}
        </button>
        
        <div className="register-footer">
          Already have an account? <a href="/login">Login here</a>
        </div>
      </form>
    </div>
  );
};

export default Register;
