import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import DashboardIcon from "/src/assets/icons/dashboard.svg";
import HomeIcon from "/src/assets/icons/home.svg";
import LogoutIcon from "/src/assets/icons/logout.svg";
import "../../styles/Navbar.css";
import { useAuth } from "../context/authContext.jsx";
import { Button } from "@mui/material";
// import { AccountCircle } from "@mui/icons-material";
// import AccountCircle from "@mui/icons-material/AccountCircle";

import { Container } from "@mui/material";

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

  const handleStart = () => {
    console.log("Navigating to /select-role"); // Debugging navigation
    navigate("/select-role");
  };

  // Updated visibility condition
  const visibleRoutes = [
    "/home",
    "/dashboard",
    "/dashboard/student",
    "/dashboard/lecturer",
  ];
  if (!visibleRoutes.some((route) => location.pathname.startsWith(route))) {
    return null;
  }

  return (
    <Container>
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
            <img src={LogoutIcon} alt="Logout" />
            <span>Logout</span>
          </li>
        </ul>
        <Button
          startIcon={<AccountCircle />}
          variant="contained"
          color="primary"
        >
          Profile
        </Button>
        <button onClick={handleStart}>Select Role</button>
      </nav>
    </Container>
  );
};

export default Navbar;
