import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../authContext"; // Updated import path


const PrivateRoute = () => {
  const { user } = useAuth(); // Retrieve user data from useAuth hook

  return user ? <Outlet /> : <Navigate to="/login" replace />;
};






     

export default PrivateRoute;
