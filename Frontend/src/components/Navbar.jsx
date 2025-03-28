import React, { useState } from "react";
import { Link,  useNavigate } from "react-router-dom";
import HomeIcon from "@/assets/icons/home.svg";
import DashboardIcon from "@/assets/icons/dashboard.svg";
import LogoutIcon from "@/assets/icons/logout.svg";
import "../../styles/Navbar.css";
import { useAuth } from "@/context/authContext";


const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLogout = () => {
    // logout(); // Clear user state and token
    // navigate("/login"); // Redirect to login page
  };

  return (
    <nav>
      <div className="logo">ACADEMIC TRACKING SYSTEM</div>
      {/* <div className="search-bar">
        <input type="text" placeholder="Search..." />
      </div> */}
      <div className="nav-toggle" onClick={toggleMenu}>
        ☰
      </div>
      <ul className={menuOpen ? "active" : ""}>
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
