import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "@/styles/Login.css";
import { FaUserCircle, FaLock } from "react-icons/fa";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const storedUsername = localStorage.getItem("userEmail");
    const storedPassword = localStorage.getItem("userPassword");

    if (username === storedUsername && password === storedPassword) {
      navigate("/student-complaints"); // Redirect to StudentComplaints form
    } else {
      alert("Invalid credentials. Redirecting to register...");
      navigate("/register");
    }
  };

  return (
    <div className="container">
      <div className="login-container">
        <form className="login-form" onSubmit={handleSubmit}>
          <h1>Login</h1>
          <div className="input-wrapper">
            <input
              type="text"
              className="form-input"
              placeholder="Username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <FaUserCircle className="input-icon" />
          </div>
          <div className="input-wrapper">
            <input
              type="password"
              className="form-input"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <FaLock className="input-icon" />
          </div>
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
  );
};

export default LoginForm;
