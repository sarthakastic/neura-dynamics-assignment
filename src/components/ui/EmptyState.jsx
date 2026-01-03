import React from "react";
import { Link } from "react-router-dom";
import Button from "./Button";

const EmptyState = ({ title, message, description, icon, action }) => {
  const defaultIcon = (
    <svg
      className="w-24 h-24 mx-auto text-gray-400 dark:text-gray-500 mb-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
      />
    </svg>
  );

  const renderAction = () => {
    if (!action) return null;

    if (action.to) {
      return (
        <Link
          to={action.to}
          className="p-2 font-medium transition-all duration-300 rounded-lg border border-gray-300 dark:border-gray-700 bg-clip-text dark:text-white hover:bg-linear-to-r hover:from-blue-500 hover:to-violet-500 hover:bg-clip-border hover:scale-[1.02] hover:cursor-pointer"
        >
          {action.label}
        </Link>
      );
    }

    if (action.onClick) {
      return (
        <Button variant="outline" size="lg" onClick={action.onClick}>
          {action.label}
        </Button>
      );
    }

    return null;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {title && (
        <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
          {title}
        </h1>
      )}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-12 border border-gray-200 dark:border-gray-700 text-center">
        {icon || defaultIcon}
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">
          {message}
        </p>
        {description && (
          <p className="text-gray-500 dark:text-gray-500 mb-6">{description}</p>
        )}
        {renderAction()}
      </div>
    </div>
  );
};

export default EmptyState;
