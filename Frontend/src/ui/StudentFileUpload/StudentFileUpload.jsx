import React, { useState } from "react";
import { useAuth } from "../../../authContext"; // Updated import path
import "./StudentFileUpload.css"; // Import the CSS file

const StudentFileUpload = () => {
  const { user } = useAuth();
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
        const result = await response.json();
        alert(`File "${file.name}" uploaded successfully!`);
        console.log("Server response:", result);
      } else {
        alert("Failed to upload the file. Please try again.");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("An error occurred during the upload.");
    }
  };

  return (
    <div className="file-upload-container">
      <h2 className="text-2xl font-bold mb-4 text-center">
        Upload Student File
      </h2>
      <h1>File Upload for {user ? user.name : "Guest"}</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="file-upload"
            className="block text-sm font-medium text-gray-700"
          >
            Select File:
          </label>
          <input
            id="file-upload"
            type="file"
            onChange={handleFileChange}
            className="hidden"
          />
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById("file-upload").click();
            }}
            className="text-blue-600 underline hover:text-blue-800"
          >
            Click here to select a file
          </a>
        </div>
        {file && (
          <div className="mt-4">
            <p className="text-sm text-gray-700">
              <strong>Selected File:</strong> {file.name}
            </p>
            <p className="text-sm text-gray-700">
              <strong>File Size:</strong> {(file.size / 1024).toFixed(2)} KB
            </p>
          </div>
        )}
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 w-full"
        >
          Upload
        </button>
      </form>
    </div>
  );
};

export default StudentFileUpload;
