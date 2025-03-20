import React from "react";

export const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = ({ className, ...props }) => {
  return (
    <input
      className={`border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 rounded-full ${className}`}
      {...props}
    />
  );
};
