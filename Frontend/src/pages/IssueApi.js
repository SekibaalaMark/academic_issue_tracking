// src/pages/IssueApi.js

export const fetchLecturerIssues = async () => {
  try {
    const response = await fetch("https://api.example.com/issues"); // Replace with your real API URL

    if (!response.ok) {
      // Handle HTTP errors (e.g., 404, 500)
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching issues:", error);
    // Return an empty array or throw the error depending on your needs
    return [];
  }
};
