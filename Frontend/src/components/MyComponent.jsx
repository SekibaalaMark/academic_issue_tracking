import React, { useEffect, useState } from "react";
import { fetchData } from "../api/api";

const MyComponent = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null); // Added state for error handling

  useEffect(() => {
    const getData = async () => {
      try {
        const result = await fetchData();
        setData(result);
      } catch (err) {
        setError("Failed to fetch data."); // Set error message
        console.error(err); // Log the error for debugging
      }
    };
    getData();
  }, []);

  return (
    <div>
      <h2>Fetched Data:</h2>
      {error ? ( // Display error if it exists
        <p style={{ color: "red" }}>{error}</p>
      ) : data ? (
        <pre>{JSON.stringify(data, null, 2)}</pre>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default MyComponent;
