import React, { useState } from "react";
import "@/Styles/StudentComplaints.css";
import { useAuth } from "@/context/authContext"; // Import useAuth for authentication

const ComplaintsForm = () => {
  const { user } = useAuth(); // Access the authenticated user if needed
  const [issue, setIssue] = useState("");
  const [file, setFile] = useState(false);
  const [comments, setComments] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false); // New state for submission status

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true); // Start submission

    const formData = new FormData();
    formData.append("issue", issue);
    formData.append("file", file);
    formData.append("comments", comments);

    try {
      const response = await fetch("/api/submit-issue", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to submit the issue");
      }

      const data = await response.json();
      setSuccessMessage("Issue submitted successfully!");
      // Reset form after submission
      setIssue("");
      setFile(null);
      setComments("");
      setErrorMessage(""); // Clear any previous error messages
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsSubmitting(false); // End submission
    }
  };

  const handleCancel = () => {
    // Reset the form fields
    setIssue("");
    setFile(null);
    setComments("");
    setSuccessMessage(""); // Clear any previous success messages
    setErrorMessage(""); // Clear any previous error messages
  };

  return (
    <div className="form-container">
      <h1>Student Complaints Form</h1>
      {user && <p>Welcome, {user.name}!</p>}{" "}
      {/* Display user info if available */}
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
          <button type="submit" disabled={isSubmitting}>
            Submit
          </button>
          <button type="button" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </form>
      {successMessage && <p className="success-message">{successMessage}</p>}
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <footer>
        <p>@2025 Makerere University (AITS) All rights reserved</p>
      </footer>
    </div>
  );
};

export default ComplaintsForm;
