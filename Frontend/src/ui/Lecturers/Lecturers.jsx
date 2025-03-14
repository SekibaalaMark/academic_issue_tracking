import React from "react";
import "./Lecturers.css";

const Lecturers = () => {
  const lecturersList = [
    { name: "Dr. John Smith", email: "john.smith@university.edu" },
    { name: "Prof. Jane Doe", email: "jane.doe@university.edu" },
    { name: "Dr. Michael Brown", email: "michael.brown@university.edu" },
  ];

  return (
    <div className="lecturers-container">
      <h2>Lecturers</h2>
      <ul className="lecturers-list">
        {lecturersList.map((lecturer, index) => (
          <li key={index} className="lecturer-item">
            <p className="lecturer-name">{lecturer.name}</p>
            <p className="lecturer-email">{lecturer.email}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Lecturers;
