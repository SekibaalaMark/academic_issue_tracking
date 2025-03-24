import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dropdown.css"; // Import the CSS file

const Dropdown = () => {
  const [selectedRole, setSelectedRole] = useState("");
  const navigate = useNavigate();

  const handleChange = (event) => {
    const role = event.target.value;
    setSelectedRole(role);

    // Navigate to the corresponding dashboard based on the selected role
    if (role) {
      switch (role) {
        case "student":
          navigate("/dashboard/student");
          break;
        case "lecturer":
          navigate("/dashboard/lecturer");
          break;
        case "academic-registrar":
          navigate("/dashboard/academic-registrar");
          break;
        default:
          break;
      }
    }
  };

  return (
    <div className="dropdown-container">
      <label htmlFor="role-select">Select Role:</label>
      <select id="role-select" value={selectedRole} onChange={handleChange}>
        <option value="">--Please choose an option--</option>
        <option value="student">Student</option>
        <option value="lecturer">Lecturer</option>
        <option value="academic-registrar">Academic Registrar</option>
      </select>
      {selectedRole && (
        <p className="selected-role">You selected: {selectedRole}</p>
      )}
    </div>
  );
};

export default Dropdown;
