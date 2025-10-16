
import React from 'react';

interface LogoProps {
  size?: "sm" | "md" | "lg";
  color?: "light" | "dark" | "primary";
}

const Logo: React.FC<LogoProps> = ({ size = "md", color = "primary" }) => {
  // Size classes
  const sizeClasses = {
    sm: "text-lg font-bold",
    md: "text-xl font-bold",
    lg: "text-3xl font-bold"
  };
  
  // Color classes
  const colorClasses = {
    light: "text-white",
    dark: "text-foreground",
    primary: "text-primary"
  };
  
  return (
    <div className={`flex items-center gap-2 ${sizeClasses[size]} ${colorClasses[color]}`}>
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        className={`${size === "sm" ? "w-5 h-5" : size === "md" ? "w-6 h-6" : "w-8 h-8"} ${color === "primary" ? "text-accent" : ""}`}
      >
        <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" />
        <path d="M3 9V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4" />
        <path d="M9 2v7" />
        <path d="M15 2v7" />
      </svg>
      <span>InvenTrack</span>
    </div>
  );
};

export default Logo;
