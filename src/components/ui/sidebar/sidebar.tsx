
import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useSidebar } from "./sidebar-context";
import { useIsMobile } from "@/hooks/use-mobile";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

const Sidebar = React.forwardRef<
  HTMLDivElement,
  SidebarProps
>(({ className, children, ...props }, ref) => {
  const { isOpen, setIsOpen } = useSidebar();
  const isMobile = useIsMobile();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  return (
    <>
      {/* Overlay for mobile when sidebar is open - placing outside main div for better z-index control */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 transition-opacity duration-300 ease-in-out"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}
      
      <div
        ref={ref}
        className={cn(
          "flex flex-col border-r bg-gradient-to-b from-green-800 to-green-900 p-4 text-white shadow-lg transition-all duration-300 ease-in-out z-40",
          isOpen 
            ? "w-64 translate-x-0" 
            : isMobile 
              ? "-translate-x-full"  // Hide completely on mobile when closed
              : "w-16 translate-x-0", // Mini sidebar on desktop when closed
          isMobile ? "fixed h-full" : "relative", // Fixed position on mobile
          mounted ? "animate-slide-in" : "",
          className
        )}
        {...props}
      >
        <div className="relative z-10 w-full h-full">
          {/* Dynamic animated background overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-green-700/20 to-green-900/20 animate-pulse" 
              style={{ animationDuration: '8s' }}></div>
          
          {/* Interactive light effect that follows mouse movement */}
          <div className="absolute inset-0 bg-radial-light opacity-10 pointer-events-none"></div>
          
          {/* Content container */}
          <div className="relative z-20 flex flex-col h-full">
            {children}
          </div>
        </div>
      </div>
    </>
  );
});

Sidebar.displayName = "Sidebar";

export { Sidebar };
