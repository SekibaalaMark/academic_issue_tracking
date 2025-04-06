// src/pages/IssueApi.js
export const fetchLecturerIssues = async () => {
  try {
    const response = await fetch('https://api.example.com/issues');  // Replace with your actual API URL
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching issues:', error);
  }
};
