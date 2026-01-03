import React from "react";

const Shimmer = ({
  className = "",
  width = "w-full",
  height = "h-4",
  rounded = "rounded",
}) => {
  return (
    <div
      className={`${width} ${height} ${rounded} animate-shimmer ${className}`}
    />
  );
};

export default Shimmer;
