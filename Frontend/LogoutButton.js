import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const LogoutButton = () => {
  const { logout } = useContext(AuthContext);

  const handleLogout = async () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (confirmLogout) {
      try {
        await logout();
        alert("Logout successful!");
      } catch (error) {
        alert("Logout failed. Please try again.");
      }
    }
  };

  return <button onClick={handleLogout}>Logout</button>;
};

export default LogoutButton;
