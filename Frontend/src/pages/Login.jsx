import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
<<<<<<< HEAD
import "@/styles/Login.css";
import { FaUserCircle, FaLock } from "react-icons/fa";
import PageTemplate from "./PageTemplate";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
=======
import axios from "axios";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
>>>>>>> origin/main
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    try {
<<<<<<< HEAD
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
=======
      const response = await axios.post("http://127.0.0.1:8000/admin", {
        email,
        password,
      });

      if (response.data.token) {
        localStorage.setItem("authToken", response.data.token);
        localStorage.setItem("userRole", response.data.role);

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
      setError("Invalid email or password");
>>>>>>> origin/main
    }
  };

  return (
<<<<<<< HEAD
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
=======
    <div className="login-page">
      <h2 className="site-title">ACADEMIC ISSUE TRACKING</h2>

      <div className="login-container">
        <div className="login-header">Login</div>
        <div className="login-form">
          <form onSubmit={handleSubmit}>
            <label htmlFor="email">E-Mail Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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

            <button type="submit" className="login-btn">Login</button>
          </form>

          <div className="login-links">
            <a href="#">Forgot Your Password?</a>
          </div>
        </div>
      </div>

      <div className="auth-links">
        <a href="#">Login</a> | <a href="#">Register</a>
      </div>
    </div>
>>>>>>> origin/main
  );
};

export default LoginForm;
