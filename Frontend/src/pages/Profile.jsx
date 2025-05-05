import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Profile.css';
const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get('https://aits2-backend.onrender.com/api/users/profile/', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setProfile(response.data);
      } catch (err) {
        setError('Failed to load profile.');
        console.error(err);
      }
    };

    fetchProfile();
  }, []);

  if (error) return <div>{error}</div>;
  if (!profile) return <div>Loading profile...</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>Profile</h2>
      <p><strong>Username:</strong> {profile.username}</p>
      <p><strong>Email:</strong> {profile.email}</p>
      <p><strong>Role:</strong> {profile.role}</p>
      {profile.role === 'student' ? (
        <p><strong>Student Number:</strong> {profile.studentNumber}</p>
      ) : (
        <p><strong>Staff ID:</strong> {profile.staffId}</p>
      )}
    </div>
  );
};

export default Profile;
