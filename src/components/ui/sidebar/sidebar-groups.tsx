
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { useSidebar } from "./sidebar-context";

// Sidebar Group
interface SidebarGroupProps extends React.HTMLAttributes<HTMLDivElement> {}

const SidebarGroup = React.forwardRef<
  HTMLDivElement,
  SidebarGroupProps
>(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("mb-6", className)}
      {...props}
    >
      {children}
    </div>
  );
});

SidebarGroup.displayName = "SidebarGroup";

// Sidebar Group Label
interface SidebarGroupLabelProps extends React.HTMLAttributes<HTMLDivElement> {}

const SidebarGroupLabel = React.forwardRef<
  HTMLDivElement,
  SidebarGroupLabelProps
>(({ className, children, ...props }, ref) => {
  const { isOpen } = useSidebar();
  
  if (!isOpen) {
    return null;
  }
  
  return (
    <div
      ref={ref}
      className={cn(
        "px-3 pb-2 text-xs uppercase tracking-wider transition-all duration-500",
        isOpen 
          ? "opacity-100 translate-x-0" 
          : "opacity-0 -translate-x-4",
        "animate-fade-in",
        className
      )}
      {...props}
    >
      <div className="relative">
        {children}
        <div className="absolute left-0 bottom-0 w-12 h-0.5 bg-gradient-to-r from-green-400 to-transparent rounded animate-pulse" style={{ animationDuration: '3s' }}></div>
      </div>
    </div>
  );
});

SidebarGroupLabel.displayName = "SidebarGroupLabel";

// Sidebar Group Content
interface SidebarGroupContentProps extends React.HTMLAttributes<HTMLDivElement> {}

const SidebarGroupContent = React.forwardRef<
  HTMLDivElement,
  SidebarGroupContentProps
>(({ className, children, ...props }, ref) => {
  const { isOpen } = useSidebar();
  
  return (
    <div
      ref={ref}
      className={cn(
        "space-y-1.5 transition-all duration-500",
        isOpen ? "opacity-100" : "opacity-90",
        className
      )}
      {...props}
    >
      {React.Children.map(children, (child, index) => (
        <div 
          className="transition-all duration-300" 
          style={{ 
            animationDelay: `${index * 100}ms`,
            transform: isOpen ? 'translateX(0)' : 'translateX(0)',
            opacity: 1
          }}
        >
          {child}
        </div>
      ))}
    </div>
  );
});

SidebarGroupContent.displayName = "SidebarGroupContent";

export { SidebarGroup, SidebarGroupLabel, SidebarGroupContent };
