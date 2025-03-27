import React from "react";
// import "./Lecturers.css"; // Ensure this path is correct

const Lecturers = () => {
  const lecturersList = [
    
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
