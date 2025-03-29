import React, { useState } from "react";
import FormField from "../StudentDashboard/FormField/FormField.jsx";
import "../StudentComplaints/StudentComplaints.css";
import sendEmailNotification from "../../services/EmailService";
import IssueResolution from "../../components/IssueResolution"; // Ensure this file exists
import { useNavigate } from "react-router-dom";

const StudentComplaints = () => {
  const [issue, setIssue] = useState("");
  const [comment, setComment] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [file, setFile] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [notification, setNotification] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!issue) {
      alert("Please select an issue.");
      return;
    }
    const newComplaint = {
      id: complaints.length + 1,
      issue,
      comment,
      status: "Pending",
    };
    setComplaints([...complaints, newComplaint]);
    setShowModal(true);

    sendEmailNotification(
      "recipient@example.com",
      `Issue: ${issue}, Comment: ${comment}`
    ).catch((error) =>
      console.error("Error sending email notification:", error)
    );
  };

  const confirmSubmit = () => {
    alert("Complaint Submitted Successfully!");
    setShowModal(false);
    setIssue("");
    setComment("");
    navigate("/issue-status");
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

  const handleResolve = (id) => {
    setComplaints((prevComplaints) =>
      prevComplaints.map((complaint) =>
        complaint.id === id ? { ...complaint, status: "Resolved" } : complaint
      )
    );
    setNotification("The issue has been resolved successfully!");
    setTimeout(() => setNotification(""), 3000);
  };

  const handleInProgress = (id) => {
    setComplaints((prevComplaints) =>
      prevComplaints.map((complaint) =>
        complaint.id === id
          ? { ...complaint, status: "In Progress" }
          : complaint
      )
    );
    setNotification("The issue is now in progress.");
    setTimeout(() => setNotification(""), 3000);
  };

  return (
    <div className="student-complaints-container">
      {notification && <div className="notification">{notification}</div>}

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
              " Select an issue please",
              "missing marks",
              "under grading",
              "misplaced marks",
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
      {complaints.map((complaint) => (
        <div key={complaint.id} className="complaint-item">
          <p>
            <strong>Issue:</strong> {complaint.issue}
          </p>
          <p>
            <strong>Status:</strong> {complaint.status}
          </p>
          <IssueResolution
            issueId={complaint.id}
            recipientEmail="recipient@example.com"
          />
        </div>
      ))}
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
