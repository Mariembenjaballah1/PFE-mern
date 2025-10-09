
import React from "react";
import { cn } from "@/lib/utils";
import { useSidebar } from "./sidebar-context";

// Sidebar Header
interface SidebarHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

const SidebarHeader = React.forwardRef<
  HTMLDivElement, 
  SidebarHeaderProps
>(({ className, children, ...props }, ref) => {
  const { isOpen } = useSidebar();
  
  return (
    <div
      ref={ref}
      className={cn(
        "flex items-center justify-between border-b border-white/10 mb-6 px-2 pb-4", 
        className
      )}
      {...props}
    >
      <div className={cn("overflow-hidden transition-all duration-300", 
        isOpen ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4 pointer-events-none"
      )}>
        {children}
      </div>
    </div>
  );
});

SidebarHeader.displayName = "SidebarHeader";

// Sidebar Content
interface SidebarContentProps extends React.HTMLAttributes<HTMLDivElement> {}

const SidebarContent = React.forwardRef<
  HTMLDivElement,
  SidebarContentProps
>(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("flex-1 overflow-auto py-2 transition-all duration-300", className)}
      {...props}
    >
      {children}
    </div>
  );
});

SidebarContent.displayName = "SidebarContent";

// Sidebar Footer
interface SidebarFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

const SidebarFooter = React.forwardRef<
  HTMLDivElement,
  SidebarFooterProps
>(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("mt-auto pt-6 border-t border-white/10 transition-all duration-300", className)}
      {...props}
    >
      {children}
    </div>
  );
});

SidebarFooter.displayName = "SidebarFooter";

export { SidebarHeader, SidebarContent, SidebarFooter };
