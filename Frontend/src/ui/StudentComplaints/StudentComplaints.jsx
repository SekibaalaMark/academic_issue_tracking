import React from "react";
import StudentForm from "./StudentForm"; // Correct import
import "../StudentComplaints/StudentComplaints.css";
import FormField from "../StudentDashboard/FormField/FormField.jsx"; // Import FormField

const StudentComplaints = () => {
  const { issue, setIssue, file, setFile, comment, setComment, handleSubmit } =
    StudentForm();

  return (
    <div className="complaint-container">
      <h2>Student Complaints</h2>
      <form onSubmit={handleSubmit}>
        <FormField
          label="Select Issue:"
          type="select"
          value={issue}
          onChange={(e) => setIssue(e.target.value)}
          required
          options={[
            "-- Select an issue --",
            "missing_marks",
            "under_grading",
            "misplaced_marks",
            "remarking",
            "others",
          ]}
        />

        {issue && issue !== "others" && (
          <FormField
            label="Attach Proof:"
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            required
          />
        )}

        <FormField
          label="Add Comment (optional):"
          type="textarea"
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
