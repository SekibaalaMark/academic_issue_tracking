import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css";

const Login = () => {
  const [username, setUsername] = useState(""); // Changed from email to username
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors
    setIsLoading(true);
    
    try {
      // Use the correct endpoint and field names
      const response = await axios.post("http://127.0.0.1:8000/login/", {
        username, // Now sending username as expected by backend
        password,
      });

      console.log(response);
      
      if (response.data.access) {
        // Store the tokens
        localStorage.setItem("authToken", response.data.access);
        localStorage.setItem("refreshToken", response.data.refresh);
        
        // Store user info
        if (response.data.data) {
          localStorage.setItem("userRole", response.data.data.role);
          localStorage.setItem("userEmail", response.data.data.email);
          localStorage.setItem("username", response.data.data.username);
        }
        
        // Navigate based on role
        if (response.data.data && response.data.data.role) {
          switch (response.data.data.role) {
            case "student":
              navigate("/Students");
              break;
            case "lecturer":
              navigate("/Lecturer");
              break;
            case "registrar":
              navigate("/AcademicRegistrar");
              break;
            default:
              navigate("/dashboard"); // Default fallback
          }
        } else {
          navigate("/dashboard"); // Default if role not found
        }
      } else {
        setError("Login failed. Please try again.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err.response?.data?.message || "Invalid username or password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <h2 className="site-title">ACADEMIC ISSUE TRACKING</h2>
      <div className="login-container">
        <div className="login-header">Login</div>
        <div className="login-form">
          <form onSubmit={handleSubmit}>
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <div className="remember-me">
              <input type="checkbox" id="remember" />
              <label htmlFor="remember">Remember Me</label>
            </div>
            {error && <div className="error-message">{error}</div>}
            <button type="submit" className="login-btn" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </form>
          <div className="login-links">
            <a href="#">Forgot Your Password?</a>
          </div>
        </div>
      </div>
      <div className="auth-links">
        <p>Don't have an account?</p>
        <a href="/register">Register here</a>
      </div>
    </div>
  );
};

export default Login;
