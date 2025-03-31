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
    console.log("Form submitted");
    console.log("Username:", username);
    console.log("Password:", password);

    // Mock login logic
    const storedUsername = localStorage.getItem("userEmail");
    const storedPassword = localStorage.getItem("userPassword");

    if (username === storedUsername && password === storedPassword) {
      navigate("/dashboard"); // Redirect to dashboard on successful login
    } else {
      alert("Invalid credentials. Redirecting to register...");
      navigate("/register"); // Redirect to register page on failed login
    }
  };

  return (
    <div className="wrapper">
      <form onSubmit={handleSubmit}>
        <h1>Login</h1>
        <div className="input-box">
          <input
            type="text"
            placeholder="Username"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <FaUserCircle className="icon" />
        </div>
        <div className="input-box">
          <input
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <FaLock className="icon" />
        </div>
        <div className="remember-forget">
          <label>
            <input type="checkbox" /> Remember me
          </label>
          <a href="#">Forgot Password?</a>
        </div>
        <button type="submit">Login</button>
        <div className="register-link">
          <p>
            Don't have an account? <a href="/register">Register</a>
          </p>
        </div>
      </form>
    </div>
  );
};

export default LoginForm; // Ensure the component is exported correctly
