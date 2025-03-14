import React, { useState } from "react";
import "./Students.css";

const Students = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const studentsList = [
    "John Doe",
    "Jane Smith",
    "Michael Johnson",
    "Emily Davis",
    "David Wilson",
  ];

  const filteredStudents = studentsList.filter((student) =>
    student.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="students-container">
      <h2>Students</h2>
      <input
        type="text"
        placeholder="Search students..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />
      <ul className="students-list">
        {filteredStudents.map((student, index) => (
          <li key={index} className="student-item">
            {student}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Students;
