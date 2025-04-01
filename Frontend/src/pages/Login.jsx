import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "@/styles/Login.css";
import { FaUserCircle, FaLock } from "react-icons/fa";
import PageTemplate from "./PageTemplate";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) throw new Error("Invalid username or password");

      const data = await response.json();
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("userRole", data.role);
      navigate("/student-complaints");
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <PageTemplate>
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
    </PageTemplate>
  );
};

export default LoginForm;
