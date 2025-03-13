import React, { useState } from "react";
import FormField from "../StudentDashboard/FormField/FormField.jsx"; // Import FormField
import "../StudentComplaints/StudentComplaints.css"; // Import CSS for styling

const StudentComplaints = () => {
  const [issue, setIssue] = useState("");
  const [file, setFile] = useState(null);
  const [comment, setComment] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!issue) {
      alert("Please select an issue.");
      return;
    }
    console.log("Submitted Data:", { issue, file, comment });
    alert("Complaint Submitted Successfully!");
  };

  return (
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
  );
};

export default StudentComplaints;
