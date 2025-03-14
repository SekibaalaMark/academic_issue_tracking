import React, { useState } from "react";

const FileAttachment = ({ onChange }) => {
  const [fileName, setFileName] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      onChange(e);
    }
  };

  return (
    <div className="file-attachment-container">
      <h2>File Attachment</h2>
      <div className="file-attachment">
        <label className="block text-sm font-medium text-gray-700">
          Attach Proof:
        </label>
        <input
          type="file"
          onChange={handleFileChange}
          className="mt-1 block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
        />
        {fileName && (
          <p className="mt-2 text-sm text-gray-600">
            Selected file: {fileName}
          </p>
        )}
      </div>
    </div>
  );
};

export default FileAttachment;
