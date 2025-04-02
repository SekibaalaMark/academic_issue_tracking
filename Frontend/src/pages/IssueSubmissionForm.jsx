import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './IssueSubmissionForm.css';

const IssueSubmissionForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    courseCode: '',
    issueType: 'Missing_Marks', // matching your Django model choices
    description: '',
    attachment: null,
  });
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState(null);

  // Update text/selection fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle file input change and preview generation
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData(prev => ({ ...prev, attachment: file }));
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  // Form submission using FormData to support file uploads
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('course_code', formData.courseCode);
    data.append('category', formData.issueType);
    data.append('description', formData.description);
    if (formData.attachment) {
      data.append('attachment', formData.attachment);
    }

    try {
      // Adjust the URL if your API endpoint differs.
      const response = await axios.post('http://127.0.0.1:8000/api/issues/', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log("Issue submitted:", response.data);
      // Navigate to a different page after successful submission
      navigate('/issues'); // For example, the issues list page
    } catch (err) {
      console.error("Error submitting issue:", err);
      setError('There was an error submitting your issue.');
    }
  };

  return (
    <div className="issue-form-container">
      <h2>Submit an Issue</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Course Code:</label>
          <input
            className="form-input"
            type="text"
            name="courseCode"
            value={formData.courseCode}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label">Issue Type:</label>
          <select
            className="form-select"
            name="issueType"
            value={formData.issueType}
            onChange={handleChange}
          >
            <option value="missing_Marks">Missing Marks</option>
            <option value="wrong grading">wrong grading</option>
            <option value="wrong marks">wrong marks</option>
            <option value="other">Other</option>          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Description:</label>
          <textarea
            className="form-textarea"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label">Attachment:</label>
          <input
            className="form-file"
            type="file"
            name="attachment"
            onChange={handleFileChange}
          />
          {preview && (
            <div className="image-preview">
              <p>Image Preview:</p>
              <img src={preview} alt="Attachment Preview" />
            </div>
          )}
        </div>
        <button type="submit">Submit Issue</button>
      </form>
      <div className="button-group">
        <button onClick={() => navigate('/dashboard')}>Go to Dashboard</button>
        <button onClick={() => navigate('/issues')}>View Issues</button>
      </div>
    </div>
  );
};

export default IssueSubmissionForm;
