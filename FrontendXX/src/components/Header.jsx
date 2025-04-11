import React from "react";
import "./Header.css";

const Header = () => {
  return (
    <header className="dashboard-header">
      <h2>LECTURER'S DASHBOARD</h2>
      <p>Track, resolve student academic-related issues & enhance transparency</p>
      <span className="bell-icon">🔔</span>
      <button className="logout-button">Logout</button>
    </header>
  );
};

export default Header;
