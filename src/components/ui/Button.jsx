import React from "react";

const Button = ({
  children,
  onClick,
  disabled = false,
  variant = "primary",
  size = "md",
  className = "",
  type = "button",
  fullWidth = false,
  ...props
}) => {
  const baseClasses = "font-medium transition-all duration-300 rounded-lg";

  const sizeClasses = {
    sm: "py-1.5 px-3 text-sm",
    md: "py-2 px-4 text-base",
    lg: "py-3 px-6 text-lg",
  };

  const variantClasses = {
    primary:
      "bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-700 dark:hover:bg-blue-600",
    secondary:
      "bg-gray-600 dark:bg-gray-500 text-white hover:bg-gray-700 dark:hover:bg-gray-600",
    outline:
      "border border-gray-300 dark:border-gray-700 bg-clip-text dark:text-white hover:bg-linear-to-r hover:from-blue-500 hover:to-violet-500 hover:bg-clip-border hover:scale-[1.02] hover:cursor-pointer",
    gradient:
      "bg-gradient-to-r from-blue-500 to-violet-500 text-white hover:from-blue-600 hover:to-violet-600",
  };

  const disabledClasses =
    "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100";

  const widthClass = fullWidth ? "w-full" : "";

  const combinedClasses = `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${disabledClasses} ${widthClass} ${className}`;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={combinedClasses}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
