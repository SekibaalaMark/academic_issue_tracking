import React from "react";

function CoverPage({ onSelectRole }) {
  return (
    <div>
      <h1>Select Your Role</h1>
      <button onClick={() => onSelectRole("Student")}>Login as Student</button>
      <button onClick={() => onSelectRole("Teacher")}>Login as Teacher</button>
    </div>
  );
}

export default CoverPage;
