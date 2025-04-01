import React from "react";
import Header from "../components/Header";
import LogoutButton from "@/components/Logout";

const PageTemplate = ({ children }) => {
  return (
    <div className="page-template">
      <Header />
      <LogoutButton />
      <main className="page-content">{children}</main>
    </div>
  );
};

export default PageTemplate;
