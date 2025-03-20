import React from "react";
import { Link } from "react-router-dom";
import HomeIcon from "@/assets/icons/home.svg";
import DashboardIcon from "@/assets/icons/dashboard.svg";
import LogoutIcon from "@/assets/icons/logout.svg";
import "../styles/Navbar.css";

const Navbar = () => {
  return (
    <nav>
      <ul>
        <li>
          <img src={HomeIcon} alt="Home" />
          <Link to="/home">Home</Link>
        </li>
        <li>
          <img src={DashboardIcon} alt="Dashboard" />
          <Link to="/dashboard/student">Dashboard</Link>
        </li>
        <li>
          <img src={LogoutIcon} alt="Logout" />
          <Link to="/login">Logout</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
