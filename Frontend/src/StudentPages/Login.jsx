import React, { useState, useEffect, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { FaUserCircle, FaLock } from "react-icons/fa";
import "./Login.css";
import { AuthContext } from "../context/authContext";

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
  const { login } = useContext(AuthContext);

  // If already logged in, redirect based on role
  useEffect(() => {
    const isAuth = localStorage.getItem("isAuthenticated") === "true";
    const role = localStorage.getItem("userRole");

    if (isAuth && role) {
      navigateBasedOnRole(role);
    }
  }, [navigate]);

  // Navigate based on user role - using lowercase routes for consistency
  const navigateBasedOnRole = (role) => {
    if (!role) return navigate("/dashboard");

    switch (role.toLowerCase()) {
      case "student":
        return navigate("/students");
      case "lecturer":
        return navigate("/lecturers"); // Consistent with App.jsx routes
      case "registrar":
      case "academic_registrar":
      case "academicregistrar":
        return navigate("/academicregistrar");
      default:
        return navigate("/dashboard");
    }
  };

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
      console.log("Login response:", data);

      // Extract tokens with fallbacks
      const token = data.tokens?.access || data.token || data.access;
      const refresh = data.tokens?.refresh || data.refresh;

      // Extract user role with fallbacks
      let userRole = 
        data.data?.user?.role || 
        data.data?.role || 
        data.user?.role || 
        data.role;

      if (!token) {
        throw new Error("Authentication failed: No token received");
      }

      if (!userRole) {
        console.warn("User role not found in response, defaulting to 'student'");
        userRole = "student";
      }

      // Update auth context
      await login({
        token,
        refreshToken: refresh,
        username,
        role: userRole,
      });

      // Store authentication data
      localStorage.setItem("accessToken", token);
      if (refresh) localStorage.setItem("refreshToken", refresh);
      localStorage.setItem("userRole", userRole);
      localStorage.setItem("isAuthenticated", "true");

      // Handle remember me
      if (rememberMe) {
        localStorage.setItem("rememberedUsername", username);
      } else {
        localStorage.removeItem("rememberedUsername");
      }

      console.log("Login successful, navigating to:", userRole);
      navigateBasedOnRole(userRole);
    } catch (err) {
      console.error("Login error:", err);

      // Error handling
      if (err.response) {
        const errorData = err.response.data;
        setErrorMessage(
          errorData.detail ||
          errorData.message ||
          errorData.error ||
          "Invalid credentials. Please try again."
        );
      } else if (err.request) {
        setErrorMessage(
          "No response from server. Please check your internet connection."
        );
      } else {
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
            <Link to="/forgot-password" className="forgot-password-link">
              Forgot Password?
            </Link>
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
              Don't have an account? <Link to="/register">Register</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
