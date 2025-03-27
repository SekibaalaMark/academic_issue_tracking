import React from "react";
import { Navigate, Route } from "react-router-dom";
import { useAuth } from "../../authContext"; // Updated import path

const PrivateRoute = ({ component: Component, ...rest }) => {
  return (
    // <Route
    //   {...rest}
    //   render={(props) =>
    //     user ? <Component {...props} /> : <Navigate to="/login" replace />
    //   }
    // /div
    // >

    <div>Proctected</div>
  );
};

export default PrivateRoute;
