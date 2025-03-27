import { useContext } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection
import { AuthContext } from "../context/AuthContext";

const LogoutButton = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate(); // Initialize useNavigate

  const handleLogout = async () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (confirmLogout) {
      try {
        await logout(); // Call the logout function from context

        // Clear user data from local storage and session storage
        localStorage.removeItem("user");
        sessionStorage.removeItem("user");

        alert("Logout successful!");
        navigate("/login"); // Redirect to the login page after logout
      } catch (error) {
        alert("Logout failed. Please try again.");
      }
    }
  };

  return <button onClick={handleLogout}>Logout</button>;
};

export default LogoutButton;
