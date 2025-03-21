import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle, FaLock } from "react-icons/fa";
import "../../styles/Login.css";
import { useAuth } from "@/context/authContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to home if user is already authenticated
    if (user) {
      navigate("/home");
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (email === "" || password === "") {
      setError("Both fields are required.");
      return;
    }
    setError("");
    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Invalid credentials");
      }

      const data = await response.json();
      login(data); // Update user context
      navigate("/home"); // Redirect to Home page
    } catch (error) {
      setError("Login failed. Please check your credentials and try again.");
    }
  };

  return (
    <div className="login-container">
      <h2>Welcome to AITS</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <div className="input-wrapper">
            <input
              type="email"
              id="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              required
            />
            <FaUserCircle className="input-icon" />
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <div className="input-wrapper">
            <input
              type="password"
              id="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              required
            />
            <FaLock className="input-icon" />
          </div>
        </div>
        {error && <p className="error-message">{error}</p>}
        <button type="submit" className="login-btn">
          Login
        </button>
        <p className="redirect-text">
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
