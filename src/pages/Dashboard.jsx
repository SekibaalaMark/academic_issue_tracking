import React from "react";

function Dashboard({ role, onLogout }) {
  return (
    <div>
      <h1>Welcome, {role}</h1>
      <button onClick={onLogout}>Logout</button>
    </div>
  );
}

export default Dashboard;
