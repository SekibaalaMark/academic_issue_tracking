import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { FaUserCircle, FaLock } from "react-icons/fa";
import "./Login.css";
import { AuthContext } from "../context/authContext";

const Login = () => {
  const { user, loading, login, error } = useContext(AuthContext);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    try {
      const response = await axios.post(
        "https://academic-issue-tracking-now.onrender.com/api/login/",
        { username, password }
      );

      const data = response.data;
      console.log("Login response:", JSON.stringify(data, null, 2));

      const token = data.tokens?.access || data.token || data.access;
      const refresh = data.tokens?.refresh || data.refresh;

      let userRole =
        data.data?.user?.role ||
        data.data?.role ||
        data.user?.role ||
        data.role;

      if (!token) {
        throw new Error("Authentication failed: No token received");
      }

      if (!userRole) {
        console.warn(
          "User role not found in response, defaulting to 'student'"
        );
        userRole = "student";
      }

      // Normalize role
      userRole = userRole.toLowerCase().replace(/[_ ]/g, "");
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

      console.log("Login successful, role:", userRole);
    } catch (err) {
      console.error("Login error:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
      });

      if (err.response) {
        const errorData = err.response.data;
        setErrorMessage(
          errorData.detail ||
            errorData.message ||
            errorData.error ||
            "Invalid credentials. Please try again."
        );
      } else if (err.response?.status === 401) {
        setErrorMessage("Invalid credentials. Please try again.");
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

          {error && <p className="error-message">{error}</p>}
          {errorMessage && <p className="error-message">{errorMessage}</p>}

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
