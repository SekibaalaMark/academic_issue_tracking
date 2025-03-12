import React from "react";
import StudentForm from "./StudentForm"; // Correct import
import "../StudentComplaints/StudentComplaints.css";

const StudentComplaints = () => {
  const { issue, setIssue, file, setFile, comment, setComment, handleSubmit } =
    StudentForm();

  return (
    <div className="complaint-container">
      <h2>Student Complaints</h2>
      <form onSubmit={handleSubmit}>
        <label>Select Issue:</label>
        <select
          value={issue}
          onChange={(e) => setIssue(e.target.value)}
          required
        >
          <option value="">-- Select an issue --</option>
          <option value="missing_marks">Missing Marks</option>
          <option value="under_grading">Under Grading</option>
          <option value="misplaced_marks">Misplaced Marks</option>
          <option value="remarking">Appeal for Remarking</option>
          <option value="others">Others</option>
        </select>

        {issue && issue !== "others" && (
          <>
            <label>Attach Proof:</label>
            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              required
            />
          </>
        )}

        <label>Add Comment (optional):</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

        <div className="buttons">
          <button type="submit">Submit</button>
          <button type="button" onClick={() => window.location.reload()}>
            Cancel
          </button>
        </div>
      </form>
      <footer>@2025 Makerere University (AITS) All rights reserved</footer>
    </div>
  );
};

export default StudentComplaints;
