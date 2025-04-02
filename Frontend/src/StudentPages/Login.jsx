import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaUserCircle, FaLock } from "react-icons/fa";
import "./Login.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(""); // Clear previous errors

    try {
      // Using axios for the API call
      const response = await axios.post("http://127.0.0.1:8000/api/login/", {
        username,
        password,
      });

      if (response.data.token) {
        // Store authentication data
        localStorage.setItem("authToken", response.data.token);
        localStorage.setItem("userRole", response.data.role);
        localStorage.setItem("isAuthenticated", "true");

        // Remember me functionality
        if (rememberMe) {
          localStorage.setItem("rememberedUsername", username);
        } else {
          localStorage.removeItem("rememberedUsername");
        }

        // Navigate based on role
        switch (response.data.role) {
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
            navigate("/dashboard"); // Default fallback
        }
      }
    } catch (err) {
      console.error("Login error:", err);
      setErrorMessage(
        err.response?.data?.message || "Invalid username or password"
      );
    }
  };

  // Check for remembered username on component mount
  React.useEffect(() => {
    const rememberedUsername = localStorage.getItem("rememberedUsername");
    if (rememberedUsername) {
      setUsername(rememberedUsername);
      setRememberMe(true);
    }
  }, []);

  return (
    // <PageTemplate>
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
            <button type="submit" className="login-btn">
              Login
            </button>
            <div className="redirect-text">
              <p>
                Don't have an account? <a href="/register">Register</a>
              </p>
            </div>
          </form>
        </div>
      </div>
    // </PageTemplate>
  );
};

export default Login;
