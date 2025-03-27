import React, { useState } from "react";
import FormField from "../StudentDashboard/FormField/FormField.jsx";
import "../StudentComplaints/StudentComplaints.css";

const StudentComplaints = () => {
  const [issue, setIssue] = useState("");
  const [comment, setComment] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [file, setFile] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!issue) {
      alert("Please select an issue.");
      return;
    }
    setShowModal(true);
  };

  const confirmSubmit = () => {
    alert("Complaint Submitted Successfully!");
    setShowModal(false);
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleFileUpload = async () => {
    if (!file) {
      alert("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("File uploaded successfully!");
      } else {
        alert("Failed to upload file.");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("An error occurred while uploading the file.");
    }
  };

  return (
    <div className="student-complaints-container">
      <div className="complaint-container max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
        <h2 className="text-2xl font-bold mb-4 text-center">
          Student Complaints
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
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

          <FormField
            label="Add Comment (optional):"
            type="textarea"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />

          <div className="flex justify-between">
            <button
              type="submit"
              className="small-button bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Submit
            </button>
            <button
              type="button"
              className="small-button bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500"
              onClick={() => window.location.reload()}
            >
              Cancel
            </button>
          </div>
        </form>
        <footer className="text-center mt-4">
          @2025 Makerere University (AITS) All rights reserved
        </footer>
      </div>
      <div>
        <h2>Upload a File</h2>
        <input type="file" onChange={handleFileChange} />
        <button onClick={handleFileUpload}>Upload</button>
      </div>
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Confirm Submission</h3>
            <p>Are you sure you want to submit this complaint?</p>
            <button onClick={confirmSubmit} className="confirm-btn">
              Yes
            </button>
            <button onClick={() => setShowModal(false)} className="cancel-btn">
              No
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentComplaints;
