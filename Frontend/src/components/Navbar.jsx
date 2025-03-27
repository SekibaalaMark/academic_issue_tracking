import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import HomeIcon from "@/assets/icons/home.svg";
import DashboardIcon from "@/assets/icons/dashboard.svg";
import LogoutIcon from "@/assets/icons/logout.svg";
import "../styles/Navbar.css";
import { useAuth } from "@/context/authContext";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLogout = () => {
    logout(); // Clear user state and token
    navigate("/login"); // Redirect to login page
  };

  return (
    <nav>
      <div className="logo">AITS</div>
      <div className="search-bar">
        <input type="text" placeholder="Search..." />
      </div>
      <div className="nav-toggle" onClick={toggleMenu}>
        ☰
      </div>
      <ul className={menuOpen ? "active" : ""}>
        <li>
          <img src={HomeIcon} alt="Home" />
          <Link to="/home">Home</Link>
        </li>
        <li>
          <img src={DashboardIcon} alt="Dashboard" />
          <Link to="/dashboard/student">Dashboard</Link>
        </li>
        <li onClick={handleLogout}>
          <img src={LogoutIcon} alt="Logout" />
          Logout
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
