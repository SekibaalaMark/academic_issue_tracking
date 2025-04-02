import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaUserCircle } from "react-icons/fa";
// import "@/Styles/ForgotPassword.css"; // You'll need to create this CSS file


const ForgotPassword = () => {
  const [username, setUsername] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username.trim()) {
      setError("Please enter your username");
      return;
    }

    setIsSubmitting(true);
    setError("");
    setMessage("");

    try {
      // Replace with your actual API endpoint
      const response = await axios.post(
        "http://127.0.0.1:8000/api/forgot-password/",
        {
          username,
        }
      );

      setMessage(
        response.data.message ||
          "Reset code has been sent to your email. Please check your inbox."
      );

      // Redirect to login page after 3 seconds
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      console.error("Password reset error:", err);
      setError(
        err.response?.data?.message ||
          "Failed to send reset code. Please check your username and try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    
      <div className="container">
        <div className="forgot-password-container">
          <form className="forgot-password-form" onSubmit={handleSubmit}>
            <h1>Forgot Password</h1>
            <p className="instructions">
              Enter your username below and we'll send a password reset code to
              your email.
            </p>

            <div className="input-wrapper">
              <label htmlFor="username" className="form-label">
                Username
              </label>
              <div className="input-icon-container">
                <input
                  type="text"
                  id="username"
                  className="form-input with-icon"
                  placeholder="Enter your username"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={isSubmitting}
                />
                <FaUserCircle className="input-icon" />
              </div>
            </div>

            {error && <p className="error-message">{error}</p>}
            {message && <p className="success-message">{message}</p>}

            <button
              type="submit"
              className="submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Sending..." : "Send Reset Code"}
            </button>

            <div className="redirect-text">
              <p>
                Remember your password? <a href="/login">Back to Login</a>
              </p>
            </div>
          </form>
        </div>
      </div>
    
  );
};

export default ForgotPassword;
