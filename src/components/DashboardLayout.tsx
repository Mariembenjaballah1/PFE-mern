
import React, { ReactNode } from 'react';
import { SidebarProvider } from "@/components/ui/sidebar/sidebar-context";
import { SidebarTrigger } from "@/components/ui/sidebar/sidebar-controls";
import AppSidebar from './AppSidebar';
import UserDisplay from './UserDisplay';
import NotificationBell from './notifications/NotificationBell';
import { useIsMobile } from '@/hooks/use-mobile';
import { useWebSocket } from '@/services/websocketService';
import { Wifi, WifiOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

// Define the UserRole type here since it's not exported from AppSidebar
type UserRole = 'ADMIN' | 'TECHNICIAN' | 'USER';

interface DashboardLayoutProps {
  children: ReactNode;
  userRole?: UserRole;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, userRole = "ADMIN" }) => {
  // Get current user from localStorage
  const getCurrentUser = () => {
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        return {
          name: user.name || "Unknown User",
          role: user.role || userRole
        };
      }
      return {
        name: "Unknown User",
        role: userRole
      };
    } catch (e) {
      console.error('Error getting current user:', e);
      return {
        name: "Unknown User",
        role: userRole
      };
    }
  };
  
  const currentUser = getCurrentUser();
  const roleDisplayName = currentUser.role === "ADMIN" ? "Administrator" : 
                         currentUser.role === "TECHNICIAN" ? "Technician" : "User";
  
  const isMobile = useIsMobile();
  const { isConnected } = useWebSocket();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <AppSidebar userRole={currentUser.role as UserRole} />
        <main className="flex-1 overflow-auto transition-all duration-300">
          <div className="h-16 border-b flex items-center justify-between px-6 bg-white/80 dark:bg-gray-800/80 shadow-sm backdrop-blur-lg sticky top-0 z-30">
            <div className="flex items-center">
              <SidebarTrigger className="hover:bg-muted/80 transition-colors rounded-full p-1.5" />
              <h1 className="text-lg font-medium ml-4 bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent truncate">
                InvenTrack System
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className={`relative ${isConnected ? 'text-green-500 hover:bg-green-50' : 'text-red-500 hover:bg-red-50'}`}
                    >
                      {isConnected ? (
                        <Wifi className="h-5 w-5" />
                      ) : (
                        <WifiOff className="h-5 w-5" />
                      )}
                      <span 
                        className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${
                          isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'
                        }`}
                      />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{isConnected ? 'Connected - Real-time updates active' : 'Disconnected - Using cached data'}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <NotificationBell />
              {!isMobile && (
                <UserDisplay 
                  username={currentUser.name} 
                  role={roleDisplayName} 
                />
              )}
            </div>
          </div>
          <div className="p-4 md:p-6 overflow-auto animate-fade-in">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
