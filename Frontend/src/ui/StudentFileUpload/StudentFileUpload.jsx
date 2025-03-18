import React, { useState } from "react";
import { useAuth } from "../../../authContext"; // Updated import path

const StudentFileUpload = () => {
  const { user } = useAuth();
  const [file, setFile] = useState(null);
  const [fileContent, setFileContent] = useState(""); // State to store file content

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) {
      alert("No file selected.");
      return;
    }

    // Validate file type
    if (
      !selectedFile.type.startsWith("text") &&
      !selectedFile.name.endsWith(".txt")
    ) {
      alert("Only text files are allowed.");
      return;
    }

    setFile(selectedFile);
    setFileContent(""); // Reset file content when a new file is selected
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

        // Ensure the file is text-based before reading
        const reader = new FileReader();
        reader.onload = () => {
          console.log("File content:", reader.result); // Debugging
          setFileContent(reader.result);
        };
        reader.onerror = () => {
          console.error("Error reading file:", reader.error);
          alert("An error occurred while reading the file.");
        };
        reader.readAsText(file);
      } else {
        alert("Failed to upload the file. Please try again.");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("An error occurred during the upload.");
    }
  };

  return (
    <div className="file-upload-container max-w-lg mx-auto p-4 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-bold mb-4 text-center">
        Upload Student File
      </h2>
      <h1 className="text-center mb-4">
        File Upload for {user ? user.name : "Guest"}
      </h1>
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
      {fileContent && (
        <div className="mt-4">
          <h3 className="text-lg font-bold">Uploaded File Content:</h3>
          <pre className="bg-gray-100 p-4 rounded-md text-sm overflow-auto">
            {fileContent}
          </pre>
        </div>
      )}
    </div>
  );
};

export default StudentFileUpload;
