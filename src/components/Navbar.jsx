import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useTheme } from "../hooks/useTheme";
import { useSelector } from "react-redux";
import Button from "./ui/Button";

const Navbar = () => {
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();
  const favoritesCount = useSelector((state) => state.favorites.items.length);

  return (
    <nav className="flex justify-between items-center p-4 border-b-2 border-gray-200 dark:border-gray-700 shadow-lg w-full bg-white dark:bg-gray-800 transition-colors duration-300">
      <Link to="/" className="flex items-center gap-0.5 md:gap-2">
        <svg
          className="w-6 h-6 text-gray-900 dark:text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
          />
        </svg>
        <h1 className="text-lg md:text-2xl   font-bold text-gray-900 dark:text-white">
          MyStore
        </h1>
      </Link>
      <div className="flex items-center md:gap-1">
        <ul className="flex md:gap-1">
          <Link
            to="/"
            className={`relative px-3 py-2 transition-colors ${
              location.pathname === "/"
                ? "text-gradient-primary font-extrabold text-underline`"
                : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
            }`}
          >
            Products
          </Link>
          <Link
            to="/favourites"
            className={`relative px-3 py-2 transition-colors`}
          >
            <span
              className={`${
                location.pathname === "/favourites"
                  ? "text-gradient-primary font-extrabold text-underline"
                  : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
              }`}
            >
              Favorites
            </span>
            {favoritesCount > 0 && (
              <span className="absolute -top-1 -right-0.5 bg-blue-600 dark:bg-blue-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {favoritesCount}
              </span>
            )}
          </Link>
        </ul>
        <Button
          onClick={toggleTheme}
          variant="secondary"
          size="sm"
          className="p-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 hover:cursor-pointer"
          aria-label="Toggle dark mode"
        >
          {isDark ? (
            <svg
              className="w-5 h-5 text-yellow-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            <svg
              className="w-5 h-5 text-gray-800"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
            </svg>
          )}
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;
