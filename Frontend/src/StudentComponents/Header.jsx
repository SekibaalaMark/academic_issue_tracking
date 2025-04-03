import React from "react";
import LogoutButton from "@/components/Logout";

const Header = () => {
  const headerStyle = {
    backgroundColor: "#f0f8ff", // Light blue background
    padding: "20px",
    textAlign: "center",
    borderRadius: "8px",
  };

  const titleStyle = {
    color: "#2c3e50", // Dark blue text
    fontStyle: "italic",
    fontSize: "1.5rem",
    margin: "0",
  };

  const buttonStyle = {
    marginTop: "10px",
    padding: "10px 15px",
    backgroundColor: "#3498db", // Blue button
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  };

  const handleMouseOver = (e) => {
    e.target.style.backgroundColor = "#2980b9"; // Darker blue on hover
  };

  const handleMouseOut = (e) => {
    e.target.style.backgroundColor = "#3498db"; // Original blue
  };

  return (
    <header style={headerStyle}>
      <h1 style={titleStyle}>
        Academic Issue Tracking System
      </h1>
      <LogoutButton
        style={buttonStyle}
        onMouseOver={handleMouseOver}
        onMouseOut={handleMouseOut}
      />
    </header>
  );
};

export default Header;
