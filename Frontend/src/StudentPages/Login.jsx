import React, { useState, useEffect, useCallback, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaUserCircle, FaLock } from "react-icons/fa";
import "./Login.css";
import { AuthContext } from "../context/authContext"; // Updated import path

const Login = () => {
  const [username, setUsername] = useState(
    localStorage.getItem("rememberedUsername") || ""
  );
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(
    !!localStorage.getItem("rememberedUsername")
  );
  
  const navigate = useNavigate();
  const { login } = useContext(AuthContext); // Use the login function from AuthContext

  // Define navigateBasedOnRole with useCallback to avoid dependency issues
  const navigateBasedOnRole = useCallback(
    (role) => {
      if (!role) return navigate("/dashboard");
      
      switch (role.toLowerCase()) {
        case "student":
          return navigate("/Students");
        case "lecturer":
          return navigate("/lecturer"); // Fixed path to match your routes
        case "registrar":
        case "academic_registrar":
          return navigate("/academicregistrar"); // Fixed path to match your routes
        default:
          return navigate("/dashboard");
      }
    },
    [navigate]
  );

  // If already logged in, redirect once
  useEffect(() => {
    const isAuth = localStorage.getItem("isAuthenticated") === "true";
    const role = localStorage.getItem("userRole");
    
    if (isAuth && role) {
      navigateBasedOnRole(role);
    }
  }, [navigateBasedOnRole]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setIsLoading(true);
    
    try {
      const response = await axios.post(
        "https://academic-6ea365e4b745.herokuapp.com/api/login/",
        { username, password }
      );
      
      const data = response.data;
      console.log("Login response:", data); // Debug log
      
      // More robust token extraction
      let token, refresh, userRole;
      
      // Try different possible response structures
      if (data.tokens) {
        token = data.tokens.access;
        refresh = data.tokens.refresh;
      } else {
        token = data.token || data.access;
        refresh = data.refresh;
      }
      
      // Try different possible user role locations
      if (data.data && data.data.user) {
        userRole = data.data.user.role;
      } else if (data.data) {
        userRole = data.data.role;
      } else if (data.user) {
        userRole = data.user.role;
      } else {
        userRole = data.role;
      }
      
      if (!token) {
        throw new Error("Authentication failed: No token received");
      }
      
      if (!userRole) {
        // If userRole is not found, let's default to "student" for testing
        console.warn("User role not found in response, defaulting to 'student'");
        userRole = "student";
      }
      
      // Important: Update the AuthContext with user info
      await login({
        token,
        refreshToken: refresh,
        username,
        role: userRole,
      });
      
      // Persist
      localStorage.setItem("accessToken", token);
      if (refresh) localStorage.setItem("refreshToken", refresh);
      localStorage.setItem("userRole", userRole);
      localStorage.setItem("isAuthenticated", "true");
      
      if (rememberMe) {
        localStorage.setItem("rememberedUsername", username);
      } else {
        localStorage.removeItem("rememberedUsername");
      }
      
      console.log("Login successful, navigating to:", userRole);
      navigateBasedOnRole(userRole);
    } catch (err) {
      console.error("Login error:", err);
      
      // More comprehensive error handling
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        const errorData = err.response.data;
        setErrorMessage(
          errorData.detail ||
            errorData.message ||
            errorData.error ||
            "Invalid credentials. Please try again."
        );
      } else if (err.request) {
        // The request was made but no response was received
        setErrorMessage(
          "No response from server. Please check your internet connection."
        );
      } else {
        // Something happened in setting up the request that triggered an Error
        setErrorMessage(err.message || "An unexpected error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="login-container">
        <form className="login-form" onSubmit={handleSubmit}>
          <h1>Login</h1>
          
          {/* Username */}
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
              />
              <FaUserCircle className="input-icon" />
            </div>
          </div>
          
          {/* Password */}
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
              />
              <FaLock className="input-icon" />
            </div>
          </div>
          
          {/* Remember me */}
          <div className="remember-me">
            <label className="remember-checkbox">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
              />
              <span className="checkbox-text">Remember me</span>
            </label>
            <a href="/forgot-password" className="forgot-password-link">
              Forgot Password?
            </a>
          </div>
          
          {/* Error */}
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          
          {/* Submit */}
          <button type="submit" className="login-btn" disabled={isLoading}>
            {isLoading ? (
              <>
                <span className="spinner"></span>
                <span>Logging in...</span>
              </>
            ) : (
              "Login"
            )}
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
