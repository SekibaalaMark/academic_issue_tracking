import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaUserCircle, FaLock } from "react-icons/fa";
import { AuthContext } from "../context/AuthContext";
import "./Login.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  useEffect(() => {
    const rememberedUsername = localStorage.getItem("rememberedUsername");
    if (rememberedUsername) {
      setUsername(rememberedUsername);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    try {
      const response = await axios.post(
        "https://academic-6ea365e4b745.herokuapp.com/api/login/",
        { username, password }
      );

      if (response.data) {
        if (rememberMe) {
          localStorage.setItem("rememberedUsername", username);
        } else {
          localStorage.removeItem("rememberedUsername");
        }

        login(response.data); // Role-based redirection handled here
      } else {
        setErrorMessage("Login successful but received empty response");
      }
    } catch (err) {
      console.error("Login error:", err);
      setErrorMessage(
        err.response?.data?.detail ||
          "Invalid username or password. Please try again."
      );
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
            <label htmlFor="username" className="form-label">Username</label>
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
            <label htmlFor="password" className="form-label">Password</label>
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
            <a href="/forgot-password" className="forgot-password-link">Forgot Password?</a>
          </div>

          {errorMessage && <p className="error-message">{errorMessage}</p>}

          <button type="submit" className="login-btn" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </button>

          <div className="redirect-text">
            <p>Don't have an account? <a href="/register">Register</a></p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
