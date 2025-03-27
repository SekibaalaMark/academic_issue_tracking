import axios from "axios";

const fetchData = async () => {
  try {
    const response = await axios.get("http://127.0.0.1:8000/api/data/"); // Update with your API URL
    console.log("Data from backend:", response.data);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

fetchData();
