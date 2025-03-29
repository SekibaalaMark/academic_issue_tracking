import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom"; // Added useLocation
import HomeIcon from "../../assets/icons/home.svg";
import DashboardIcon from "../../assets/icons/dashboard.svg";
import LogoutIcon from "../../assets/icons/logout.svg";
import "../../styles/Navbar.css";
import { useAuth } from "../../context/authContext";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation(); // Get the current route

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLogout = () => {
    // logout(); // Clear user state and token
    // navigate("/login"); // Redirect to login page
  };

  // Only render Navbar on specific pages
  if (!["/home", "/dashboard", "/another-page"].includes(location.pathname)) {
    return null;
  }

  return (
    <nav className="navbar">
      <div className="logo">ACADEMIC TRACKING SYSTEM</div>
      <div className="nav-toggle" onClick={toggleMenu}>
        ☰
      </div>
      <ul className={`nav-menu ${menuOpen ? "active" : ""}`}>
        <li>
          <Link to="/home">
            <img src={HomeIcon} alt="Home" />
            <span>Home</span>
          </Link>
        </li>
        <li>
          <Link to="/dashboard">
            <img src={DashboardIcon} alt="Dashboard" />
            <span>Dashboard</span>
          </Link>
        </li>
        <li onClick={handleLogout}>
          <Link to="/home">
            <img src={LogoutIcon} alt="Logout" />
            <span>Logout</span>
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
