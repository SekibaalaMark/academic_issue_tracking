import React from "react";
import HomeIcon from "@/assets/icons/home.svg";
import DashboardIcon from "@/assets/icons/dashboard.svg";
import LogoutIcon from "@/assets/icons/logout.svg";

const Navbar = () => {
  return (
    <nav>
      <ul>
        <li>
          <img src={HomeIcon} alt="Home" />
          Home
        </li>
        <li>
          <img src={DashboardIcon} alt="Dashboard" />
          Dashboard
        </li>
        <li>
          <img src={LogoutIcon} alt="Logout" />
          Logout
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
