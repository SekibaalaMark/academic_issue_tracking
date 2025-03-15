import React from "react";
import { useAuth } from "../../authContext"; // Updated import path
import Header from "../components/Header";
import Description from "../components/Description";

const AcademicRegistrar = () => {
  const { user } = useAuth();

  return (
    <div>
      <h1>Welcome, {user ? user.name : "Guest"}</h1>
      <Header title="Academic Tracking System" />
      <Description text="Welcome to the Academic Tracking System" />
    </div>
  );
};

export default AcademicRegistrar;
