
import React from "react";
import { cn } from "@/lib/utils";
import { useSidebar } from "./sidebar-context";

// Sidebar Menu
interface SidebarMenuProps extends React.HTMLAttributes<HTMLDivElement> {}

const SidebarMenu = React.forwardRef<
  HTMLDivElement,
  SidebarMenuProps
>(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("space-y-1.5", className)}
      {...props}
    >
      {children}
    </div>
  );
});

SidebarMenu.displayName = "SidebarMenu";

// Sidebar MenuItem
interface SidebarMenuItemProps extends React.HTMLAttributes<HTMLDivElement> {}

const SidebarMenuItem = React.forwardRef<
  HTMLDivElement,
  SidebarMenuItemProps
>(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("", className)}
      {...props}
    >
      {children}
    </div>
  );
});

SidebarMenuItem.displayName = "SidebarMenuItem";

// Sidebar Menu Button
interface SidebarMenuButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  asChild?: boolean;
}

const SidebarMenuButton = React.forwardRef<
  HTMLButtonElement,
  SidebarMenuButtonProps
>(({ className, active, asChild = false, children, ...props }, ref) => {
  const { isOpen } = useSidebar();
  
  // Use type assertion for React children
  const childrenElement = children as React.ReactNode;
  
  return (
    <button
      ref={ref}
      className={cn(
        "flex items-center rounded-md px-3 py-2.5 text-sm font-medium transition-all duration-200 w-full",
        active
          ? "bg-green-700/50 text-white shadow-inner transform scale-[1.02]" 
          : "text-white/90 hover:bg-green-700/30 hover:text-white hover:translate-x-1",
        !isOpen && "justify-center px-0",
        className
      )}
      {...props}
    >
      {childrenElement}
    </button>
  );
});

SidebarMenuButton.displayName = "SidebarMenuButton";

export { SidebarMenu, SidebarMenuItem, SidebarMenuButton };
