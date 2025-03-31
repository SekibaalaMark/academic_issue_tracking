import React, { useState } from "react";
import "@/Styles/StudentComplaints.css"; 

const ComplaintsForm = () => {
  const [issue, setIssue] = useState("");
  const [file, setFile] = useState(null);
  const [comments, setComments] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log("Issue:", issue);
    console.log("File:", file);
    console.log("Comments:", comments);
    // Reset form after submission
    setIssue("");
    setFile(null);
    setComments("");
  };

  const handleCancel = () => {
    // Reset the form fields
    setIssue("");
    setFile(null);
    setComments("");
  };

  return (
    <div className="form-container">
      <h1>Student Complaints Form</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="issueSelect">Select from the issues below:</label>
        <select
          id="issueSelect"
          value={issue}
          onChange={(e) => setIssue(e.target.value)}
          required
        >
          <option value="">--Please choose an option--</option>
          <option value="missing_marks">Missing Marks</option>
          <option value="under_grading">Under Grading</option>
          <option value="misplaced_marks">Misplaced Marks</option>
          <option value="appeal_remarking">Appeal for Remarking</option>
          <option value="others">Others</option>
        </select>

        <label htmlFor="fileUpload">Attachment of Proof:</label>
        <input
          type="file"
          id="fileUpload"
          accept=".pdf, .doc, .docx, .jpg, .png"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <label htmlFor="comments">Add Comment (optional):</label>
        <textarea
          id="comments"
          rows="4"
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          placeholder="Optional comments..."
        ></textarea>

        <div className="button-container">
          <button type="submit">Submit</button>
          <button type="button" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </form>
      <footer>
        <p>@2025 Makerere University (AITS) All rights reserved</p>
      </footer>
    </div>
  );
};

export default ComplaintsForm;
