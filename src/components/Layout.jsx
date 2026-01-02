import React from "react";
import { Link } from "react-router-dom";

const Layout = ({ children }) => {
  return (
    <div>
      <nav className="flex justify-between items-center p-4 border-b-2 border-gray-200 shadow-lg w-full">
        <h1 className="text-2xl font-bold">Neura Dynamics</h1>
        <ul className="flex gap-4">
          <Link to="/">Home</Link>
          <Link to="/favourites">My Favourites</Link>
        </ul>
      </nav>
      <main className="p-4">{children}</main>
    </div>
  );
};

export default Layout;
