import React from "react";

const StudentFileUpload = () => {
  return (
    <div className="file-upload-container max-w-md mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
      <h2 className="text-2xl font-bold mb-4 text-center">
        Upload Student File
      </h2>
      <form className="space-y-4">
        <label className="block text-gray-700 font-semibold">
          Select File:
        </label>
        <input
          type="file"
          className="block w-full p-2 border border-gray-300 rounded-md"
        />
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
