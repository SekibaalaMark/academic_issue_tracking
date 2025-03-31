import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import DashboardIcon from "/src/assets/icons/dashboard.svg";
import HomeIcon from "/src/assets/icons/home.svg";
import LogoutIcon from "/src/assets/icons/logout.svg";
import "../../styles/Navbar.css";
import { useAuth } from "../context/authContext.jsx";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

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
