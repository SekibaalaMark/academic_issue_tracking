import React from "react";
import "./Lecturers.css"; // Ensure this path is correct

const Lecturers = () => {
  const lecturersList = [
    { id: 1, name: "Dr. John Doe", subject: "Mathematics" },
    { id: 2, name: "Dr. Jane Smith", subject: "Physics" },
    { id: 3, name: "Dr. Emily Johnson", subject: "Chemistry" },
    // Add more lecturers as needed
  ];

  return (
    <div className="lecturers-container">
      <h1>Lecturers</h1>
      <ul>
        {lecturersList.map((lecturer) => (
          <li key={lecturer.id}>
            {lecturer.name} - {lecturer.subject}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Lecturers;
