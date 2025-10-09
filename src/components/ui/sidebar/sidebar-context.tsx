
import React, { createContext, useContext, useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

// Create Sidebar Context for handling sidebar state
type SidebarContextType = {
  isOpen: boolean;
  toggle: () => void;
  setIsOpen: (value: boolean) => void;
};

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const isMobile = useIsMobile();
  
  // Use localStorage to persist sidebar state across page refreshes
  const [isOpen, setIsOpen] = useState(() => {
    // Don't try to access localStorage during SSR
    if (typeof window === 'undefined') return !isMobile;
    
    const savedState = localStorage.getItem("sidebarIsOpen");
    // On mobile devices, default to closed sidebar
    if (isMobile) return false;
    return savedState !== null ? JSON.parse(savedState) : true;
  });

  // Update localStorage when sidebar state changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem("sidebarIsOpen", JSON.stringify(isOpen));
    }
  }, [isOpen]);

  // Toggle sidebar with animation
  const toggle = () => {
    setIsOpen(prev => !prev);
  };
  
  // Detect window resize and automatically close sidebar on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768 && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isOpen]);
  
  // Update sidebar state when isMobile changes
  useEffect(() => {
    if (isMobile && isOpen) {
      setIsOpen(false);
    }
  }, [isMobile]);
  
  return (
    <SidebarContext.Provider value={{ isOpen, toggle, setIsOpen }}>
      <div className="min-h-screen flex w-full bg-muted/30">
        {children}
      </div>
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  
  return context;
}
