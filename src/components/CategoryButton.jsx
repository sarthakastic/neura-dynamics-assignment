import React from "react";

const CategoryButton = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={`
      h-8 px-4 rounded-full
      flex items-center justify-center
      whitespace-nowrap capitalize
      text-sm font-medium
      transition-all
      focus:outline-none focus:ring-2 focus:ring-blue-500/40
      ${
        active
          ? "  bg-linear-to-r from-blue-500 to-violet-500"
          : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
      }
    `}
  >
    {children}
  </button>
);

export default CategoryButton;
