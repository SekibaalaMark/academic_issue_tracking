import React from "react";
import Logout from "./components/Logout";

const Header = () => {
  return (
    <header className="header">
      <h1 className="header-title">Academic Issue Tracking, Thanks for using the system!</h1>
      <LogoutButton />
    </header>
  );
};

export default Header;
