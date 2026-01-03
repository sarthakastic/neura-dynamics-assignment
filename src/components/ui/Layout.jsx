import React from "react";
import Navbar from "../Navbar";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen  transition-colors duration-300">
      <Navbar />
      <main className=" transition-colors duration-300">{children}</main>
    </div>
  );
};

export default Layout;
