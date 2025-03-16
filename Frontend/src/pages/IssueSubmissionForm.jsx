// src/pages/IssueSubmissionForm.jsx

import React, { useState } from 'react';

const IssueSubmissionForm = () => {
  const [formData, setFormData] = useState({
    courseCode: '',
    issueType: 'missing marks',
    description: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic (e.g., POST request to backend)
  };

  return (
    <div>
      <h2>Submit an Issue</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Course Code: </label>
          <input
            type="text"
            name="courseCode"
            value={formData.courseCode}
            onChange={(e) => setFormData({ ...formData, courseCode: e.target.value })}
            required
          />
        </div>
        <div>
          <label>Issue Type: </label>
          <select
            name="issueType"
            value={formData.issueType}
            onChange={(e) => setFormData({ ...formData, issueType: e.target.value })}
          >
            <option value="missing marks">Missing Marks</option>
            <option value="appeals">Appeals</option>
            <option value="corrections">Corrections</option>
          </select>
        </div>
        <div>
          <label>Description: </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
          />
        </div>
        <button type="submit">Submit Issue</button>
      </form>
    </div>
  );
};

export default IssueSubmissionForm;
