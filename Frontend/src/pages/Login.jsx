import React, { useState } from "react";
import { Link } from "react-router-dom"; // Import Link for navigation
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/authContext"; // Corrected path for authContext
import { FaUserCircle, FaLock, FaEye, FaEyeSlash } from "react-icons/fa"; // Added necessary icons
import "../styles/Login.css"; // Updated path for Login.css

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (email === "" || password === "") {
      setError("Both fields are required.");
      return;
    }
    setError("");
    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Invalid credentials");
      }

      const data = await response.json();
      login(data); // Call login from authContext
      localStorage.setItem("authToken", data.token); // Store token
      navigate("/dashboard"); // Redirect after login
    } catch (error) {
      setError("Login failed. Please check your credentials and try again.");
    }
  };

  return (
    <div className="login-container">
      <h2>Welcome to AITS</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group">
          <label htmlFor="email">
            <FaUserCircle className="icon" /> Email:
          </label>
          <input
            type="email"
            id="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-input"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">
            <FaLock className="icon" /> Password:
          </label>
          <div style={{ position: "relative", width: "100%" }}>
            <input
              type={passwordVisible ? "text" : "password"}
              id="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              required
            />
            <span
              onClick={togglePasswordVisibility}
              style={{
                position: "absolute",
                right: "0.5rem",
                top: "50%",
                transform: "translateY(-50%)",
                cursor: "pointer",
              }}
            >
              {passwordVisible ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
        </div>
        {error && <p className="error-message">{error}</p>}
        <div className="remember-forget">
          <div style={{ display: "flex", gap: "10px" }}>
            <input type="checkbox" id="remember-me" />
            <label htmlFor="remember-me">Remember me</label>
          </div>
          <a href="#" className="forgot-password">
            Forgot Password?
          </a>
        </div>
        <button type="submit" className="login-btn">
          Login
        </button>
        <p className="redirect-text">
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
