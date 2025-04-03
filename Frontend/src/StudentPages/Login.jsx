import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaUserCircle, FaLock } from "react-icons/fa";
import "./Login.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(""); // Clear previous errors
    setIsLoading(true);
    
    try {
      // Using axios for the API call
      const response = await axios.post("https://academic-6ea365e4b745.herokuapp.com/api/login/", {
        username,
        password,
      });
      
      console.log("Login response:", response.data);
      
      // Check the response structure and handle accordingly
      if (response.data) {
        // Store the entire response for debugging
        localStorage.setItem("loginResponse", JSON.stringify(response.data));
        
        // Handle token - could be in different formats
        if (response.data.tokens) {
          localStorage.setItem("accessToken", response.data.tokens.access);
          localStorage.setItem("refreshToken", response.data.tokens.refresh);
        } else if (response.data.token) {
          localStorage.setItem("accessToken", response.data.token);
        } else if (response.data.access) {
          localStorage.setItem("accessToken", response.data.access);
          localStorage.setItem("refreshToken", response.data.refresh || "");
        }
        
        // Handle user data - could be in different formats
        if (response.data.user) {
          localStorage.setItem("userRole", response.data.user.role);
          localStorage.setItem("userId", response.data.user.id);
          localStorage.setItem("username", response.data.user.username);
        } else {
          // If user data is at the top level
          localStorage.setItem("userRole", response.data.role || "");
          localStorage.setItem("userId", response.data.id || "");
          localStorage.setItem("username", response.data.username || username);
        }
        
        localStorage.setItem("isAuthenticated", "true");
        
        // Remember me functionality
        if (rememberMe) {
          localStorage.setItem("rememberedUsername", username);
        } else {
          localStorage.removeItem("rememberedUsername");
        }
        
        // Get the user role for navigation
        const userRole = response.data.user?.role || response.data.role || "";
        
        // Navigate based on role
        switch (userRole) {
          case "student":
            navigate("/students");
            break;
          case "lecturer":
            navigate("/lecturers");
            break;
          case "registrar":
            navigate("/academic-registrar");
            break;
          default:
            // If we can't determine the role, try to extract it from the token
            try {
              const token = response.data.tokens?.access || response.data.token || response.data.access;
              if (token) {
                // Decode JWT token to get user info
                const tokenParts = token.split('.');
                if (tokenParts.length === 3) {
                  const payload = JSON.parse(atob(tokenParts[1]));
                  if (payload.role) {
                    navigateBasedOnRole(payload.role);
                  } else {
                    navigate("/dashboard");
                  }
                } else {
                  navigate("/dashboard");
                }
              } else {
                navigate("/dashboard");
              }
            } catch (error) {
              console.error("Error decoding token:", error);
              navigate("/dashboard");
            }
        }
      } else {
        // Handle empty response
        setErrorMessage("Login successful but received empty response");
      }
    } catch (err) {
      console.error("Login error:", err);
      
      // Handle different types of error responses
      if (err.response && err.response.data) {
        if (typeof err.response.data === 'string') {
          setErrorMessage(err.response.data);
        } else if (err.response.data.detail) {
          setErrorMessage(err.response.data.detail);
        } else if (err.response.data.message) {
          setErrorMessage(err.response.data.message);
        } else if (err.response.data.error) {
          setErrorMessage(err.response.data.error);
        } else if (err.response.data.non_field_errors) {
          setErrorMessage(err.response.data.non_field_errors.join(', '));
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
          setErrorMessage(errorMessages.join('; ') || "Login failed");
        }
      } else {
        setErrorMessage("Invalid username or password. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to navigate based on role
  const navigateBasedOnRole = (role) => {
    switch (role) {
      case "student":
        navigate("/students");
        break;
      case "lecturer":
        navigate("/lecturers");
        break;
      case "registrar":
        navigate("/academic-registrar");
        break;
      default:
        navigate("/dashboard");
    }
  };

  // Check for remembered username on component mount
  useEffect(() => {
    const rememberedUsername = localStorage.getItem("rememberedUsername");
    if (rememberedUsername) {
      setUsername(rememberedUsername);
      setRememberMe(true);
    }
    
    // Check if user is already authenticated
    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
    if (isAuthenticated) {
      const userRole = localStorage.getItem("userRole");
      navigateBasedOnRole(userRole);
    }
  }, [navigate]);

  return (
    <div className="container">
      <div className="login-container">
        <form className="login-form" onSubmit={handleSubmit}>
          <h1>Login</h1>
          <div className="input-wrapper">
            <label htmlFor="username" className="form-label">
              Username
            </label>
            <div className="input-icon-container">
              <input
                type="text"
                id="username"
                className="form-input with-icon"
                placeholder="Username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{ backgroundColor: "lightyellow" }}
              />
              <FaUserCircle className="input-icon" />
            </div>
          </div>
          <div className="input-wrapper">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <div className="input-icon-container">
              <input
                type="password"
                id="password"
                className="form-input with-icon"
                placeholder="Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ backgroundColor: "lightyellow" }}
              />
              <FaLock className="input-icon" />
            </div>
          </div>
          <div className="remember-me">
            <label>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
              />
              Remember me
            </label>
            <a href="/forgot-password" className="forgot-password-link">
              Forgot Password?
            </a>
          </div>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          <button type="submit" className="login-btn" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </button>
          <div className="redirect-text">
            <p>
              Don't have an account? <a href="/register">Register</a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
