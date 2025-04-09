import React, { useState } from "react";
import "./Sidebar.css";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`sidebar ${isOpen ? "open" : ""}`}>
      <button className="toggle-btn" onClick={() => setIsOpen(!isOpen)}>
        ☰
      </button>
      <div className="profile">
        <div className="avatar"></div>
        <p>Name</p>
        <p>Register ID</p>
        <p>College</p>
      </div>
      <nav>
        <ul>
          <li>🏠 Home</li>
          <li>🔔 Notification</li>
          <li>📧 Email</li>
          <li>📞 Contact</li>
          <li>🔧 Support</li>
          <li>⚙️ Settings</li> {/* New Settings section */}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
