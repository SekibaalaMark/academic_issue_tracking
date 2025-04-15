import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
// import "../styles/Login.css"; // Reusing the same styles

// Constants (should match your Login constants)
const API_BASE_URL = "http://127.0.0.1:8000";
const LOGOUT_ENDPOINT = "/api/auth/logout/"; // Update to your actual logout endpoint

const Logout = () => {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const navigate = useNavigate();

  const handleLogout = async () => {
    setLoading(true);
    setError("");
    try {
      // Optional: Send logout request to backend
      await axios.post(
        `${API_BASE_URL}${LOGOUT_ENDPOINT}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
          withCredentials: true,
        }
      );
    } catch (err) {
      console.error("Logout error:", err);
      // Continue with client-side cleanup even if server logout fails
    } finally {
      // Clear all client-side authentication data
      localStorage.removeItem("authToken");
      localStorage.removeItem("userRole");
      localStorage.removeItem("userId");
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("user");
      setLoading(false);
      navigate("/login", { state: { from: "logout" } });
    }
  };

  // Auto-trigger logout when component mounts
  React.useEffect(() => {
    handleLogout();
  }, []);

  return (
    <div className="login-container">
      <div className="logout-content">
        <h2>Logging out...</h2>
        {loading && (
          <div className="spinner-container">
            <span className="spinner"></span>
          </div>
        )}
        {error && <p className="error">{error}</p>}
      </div>
    </div>
  );
};

export default Logout;
