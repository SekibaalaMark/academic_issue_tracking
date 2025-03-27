import { useEffect, useState } from "react";
import { fetchData } from "../api/api";

const MyComponent = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); // Added loading state

  useEffect(() => {
    const getData = async () => {
      try {
        const result = await fetchData();
        setData(result);
        setLoading(false); // Set loading to false when data is fetched
      } catch (err) {
        setError(`Failed to fetch data: ${err.message}`); // Set error message with more details
      }
    };
    getData();
  }, []);

  return (
    <div>
      <h2>Fetched Data:</h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : data ? (
        <pre>{JSON.stringify(data, null, 2)}</pre>
      ) : (
        <p>No data available.</p>
      )}
    </div>
  );
};

export default MyComponent;
