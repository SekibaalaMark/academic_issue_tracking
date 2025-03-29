import React from "react";

const CoverPage = ({ onSelectRole }) => {
  const roles = ["Student", "Teacher", "Admin"]; // Example roles

  return (
    <div>
      <h1>Welcome to Academic Issue Tracking</h1>
      <p>Please select your role:</p>
      {roles.map((role) => (
        <button key={role} onClick={() => onSelectRole(role)}>
          {role}
        </button>
      ))}
    </div>
  );
};

export default CoverPage;
