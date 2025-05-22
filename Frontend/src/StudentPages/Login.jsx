import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaUserCircle, FaLock } from "react-icons/fa";
import "./Login.css";
import { AuthContext } from "../context/authContext";
import LoadingAnimation from "@/components/LoadingAnimation";

const Login = () => {
  const { user, loading, login, error: authError } = useContext(AuthContext);
  const navigate = useNavigate();

  // Prevent rendering Login if user is authenticated
  if (!loading && user) {
    return null; // AuthProvider handles navigation
  }

  const [username, setUsername] = useState(
    localStorage.getItem("rememberedUsername") || ""
  );
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(
    !!localStorage.getItem("rememberedUsername")
  );
  const [showAnimation, setShowAnimation] = useState(true);

  // Add animation timeout effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAnimation(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  // Function to get user-friendly error message
  const getUserFriendlyError = (error) => {
    if (!error) return null;

    // Network or server errors
    if (!error.response) {
      return "Unable to connect to the server. Please check your internet connection and try again.";
    }

    // Handle specific status codes
    switch (error.response.status) {
      case 400:
        return "Please check your username and password and try again.";
      case 401:
        return "Invalid username or password. Please try again.";
      case 403:
        return "Access denied. Please contact support if you think this is a mistake.";
      case 404:
        return "Login service is temporarily unavailable. Please try again later.";
      case 500:
        return "We're experiencing technical difficulties. Please try again later.";
      default:
        return "Unable to log in at the moment. Please try again later.";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    // Basic validation
    if (!username.trim() || !password.trim()) {
      setErrorMessage("Please enter both username and password.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        "https://academic-issue-tracking-now.onrender.com/api/login/",
        { username, password }
      );

      const data = response.data;

      const token = data.tokens?.access || data.token || data.access;
      const refresh = data.tokens?.refresh || data.refresh;
      let userRole = data.data?.user?.role || data.data?.role || data.user?.role || data.role;

      if (!token) {
        setErrorMessage("Unable to complete login. Please try again.");
        return;
      }

      // Normalize role
      userRole = userRole?.toLowerCase().replace(/[_ ]/g, "") || "student";
      if (userRole === "academicregistrar" || userRole === "registrar") {
        userRole = "academicregistrar";
      }

      // Update auth context
      await login(
        {
          token,
          refresh,
          username,
          user_role: userRole,
        },
        userRole
      );

      // Handle remember me
      if (rememberMe) {
        localStorage.setItem("rememberedUsername", username);
      } else {
        localStorage.removeItem("rememberedUsername");
      }

    } catch (err) {
      const friendlyError = getUserFriendlyError(err);
      setErrorMessage(friendlyError);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {showAnimation && <LoadingAnimation />}
      <div className="login-page">
        <div className="login-container">
          <form className="login-form" onSubmit={handleSubmit}>
            <h1>Welcome Back!</h1>
            <p className="login-subtitle">Please enter your credentials to continue</p>

            <div className="form-group">
              <label className="form-label">Username</label>
              <div className="input-wrapper">
                <FaUserCircle className="input-icon" />
                <input
                  type="text"
                  className="custom-input username-input"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setErrorMessage("");
                  }}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="input-wrapper">
                <FaLock className="input-icon" />
                <input
                  type="password"
                  className="custom-input password-input"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrorMessage("");
                  }}
                  required
                />
              </div>
            </div>

            <div className="form-options">
              <label className="checkbox-container">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                />
                <span className="checkmark"></span>
                <span className="checkbox-label">Remember me</span>
              </label>
              <Link to="/forgot-password" className="forgot-link">
                Forgot Password?
              </Link>
            </div>

            {errorMessage && (
              <div className="error-message">{errorMessage}</div>
            )}

            <button 
              type="submit" 
              className="sign-in-button"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </button>

            <p className="register-prompt">
              New to the platform? {" "}
              <Link to="/register" className="register-link">
                Create an account
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
