import { useContext } from "react";

import { AuthProvider, useAuth } from "@/context/authContext";
// // import LogoutButton from "./components/LogoutButton";

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  return (
    <div>
      <h1>Welcome, {user?.email}</h1>
      <LogoutButton />
    </div>
  );
};

export default Dashboard;
