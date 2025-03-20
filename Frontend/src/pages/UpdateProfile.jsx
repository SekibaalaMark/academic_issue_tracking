// src/pages/UpdateProfile.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './UpdateProfile.css';

const UpdateProfile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    username: '',
    email: '',
    // Add more fields if required (e.g., programme)
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch current profile data from the API
  useEffect(() => {
    axios
      .get('/api/profile/')
      .then((response) => {
        setProfile(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching profile:', err);
        setError('Failed to fetch profile.');
        setLoading(false);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .put('/api/profile/', profile)
      .then((response) => {
        alert('Profile updated successfully!');
        navigate('/dashboard'); // Redirect as needed
      })
      .catch((err) => {
        console.error('Error updating profile:', err);
        setError('Failed to update profile.');
      });
  };

  if (loading) {
    return <div className="update-container">Loading...</div>;
  }

  return (
    <div className="update-container">
      <h2 className="update-heading">Update Profile</h2>
      {error && <p className="error-message">{error}</p>}
      <form className="update-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username" className="form-label">
            Username:
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={profile.username}
            onChange={handleChange}
            className="form-input"
            autoComplete="username"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email" className="form-label">
            Email:
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={profile.email}
            onChange={handleChange}
            className="form-input"
            autoComplete="email"
            required
          />
        </div>
        {/* Add additional fields here as needed with appropriate label and autoComplete attributes */}
        <button type="submit" className="btn">
          Update Profile
        </button>
      </form>
      <div className="nav-group">
        <button className="btn" onClick={() => navigate('/dashboard')}>
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default UpdateProfile;
