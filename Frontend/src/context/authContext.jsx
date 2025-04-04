import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode"; // ✅ Correct named import
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (token) {
          const response = await axios.get(
            "https://academic-6ea365e4b745.herokuapp.com/api/user/",
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setUser(response.data);
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Failed to fetch user data.");
      } finally {
        setLoading(false);
      }
    };

    if (localStorage.getItem("isAuthenticated") === "true") {
      fetchUserData();
    } else {
      setLoading(false);
    }
  }, [navigate]);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("user", JSON.stringify(userData));

    if (userData.token) {
      localStorage.setItem("authToken", userData.token);
      try {
        const decoded = jwtDecode(userData.token); // ✅ use named function
        localStorage.setItem("userRole", decoded.role || "user");
      } catch (err) {
        console.error("Token decoding error:", err);
      }
    }

    const role = (userData.user?.role || userData.role || "").toLowerCase();
    switch (role) {
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
        navigate("/dashboard");
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("user");
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");
    navigate("/login");
  };

  const register = (userData) => {
    login(userData);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, loading, error }}>
      {!loading ? children : <div>Loading...</div>}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
