
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSidebar } from "./sidebar-context";
import { useIsMobile } from "@/hooks/use-mobile";

// Sidebar Trigger
interface SidebarTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const SidebarTrigger = React.forwardRef<
  HTMLButtonElement,
  SidebarTriggerProps
>(({ className, ...props }, ref) => {
  const { toggle, isOpen } = useSidebar();
  const isMobile = useIsMobile();
  const [isHovering, setIsHovering] = useState(false);
  
  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      className={cn(
        "hover:bg-green-100 dark:hover:bg-green-900/20 transition-all duration-300",
        "hover:shadow-md hover:shadow-green-500/20 hover:scale-110",
        isMobile && isOpen ? "fixed right-4 top-4 z-50 bg-white/10 backdrop-blur-sm" : "",
        className
      )}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle();
      }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      {...props}
    >
      <Menu className={cn(
        "h-5 w-5 text-green-600 dark:text-green-400 transition-all duration-300",
        isHovering ? "rotate-90" : "",
        isOpen ? "transform rotate-180" : ""
      )} />
      <span className="sr-only">Toggle sidebar</span>
    </Button>
  );
});

SidebarTrigger.displayName = "SidebarTrigger";

// Sidebar Item
interface SidebarItemProps extends React.HTMLAttributes<HTMLDivElement> {
  active?: boolean;
}

const SidebarItem = React.forwardRef<
  HTMLDivElement,
  SidebarItemProps
>(({ className, active, children, ...props }, ref) => {
  const { isOpen } = useSidebar();
  const [isHovering, setIsHovering] = useState(false);
  
  return (
    <div
      ref={ref}
      className={cn(
        "flex items-center rounded-md px-3 py-2.5 text-sm font-medium transition-all duration-300",
        active
          ? "bg-sidebar-accent text-primary shadow-inner transform scale-[1.02] border-l-4 border-green-400" 
          : "text-muted-foreground hover:bg-muted/30 hover:text-foreground hover:translate-x-1 hover:border-l-4 hover:border-green-400/50",
        isOpen ? "justify-start" : "justify-center",
        className
      )}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      style={{
        transform: isHovering && !active ? 'translateX(4px)' : '',
      }}
      {...props}
    >
      <div className={cn(
        "flex items-center gap-2",
        isOpen ? "" : "flex-col"
      )}>
        {children}
      </div>
    </div>
  );
});

SidebarItem.displayName = "SidebarItem";

export { SidebarTrigger, SidebarItem };
