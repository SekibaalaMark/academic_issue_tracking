import axios from "axios";

const API_URL = "https://academic-6ea365e4b745.herokuapp.com/api/";

export const fetchData = async () => {
  try {
    const response = await axios.get(`${API_URL}your-endpoint/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};
