
import React, { createContext, useContext, useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

interface SettingsContextType {
  // Profile settings
  profile: {
    name: string;
    email: string;
    bio: string;
  };
  updateProfile: (data: { name?: string; email?: string; bio?: string }) => void;
  
  // Notification settings
  notifications: {
    emailNotifications: boolean;
    maintenanceAlerts: boolean;
    systemUpdates: boolean;
  };
  updateNotifications: (data: { 
    emailNotifications?: boolean; 
    maintenanceAlerts?: boolean; 
    systemUpdates?: boolean 
  }) => void;
  
  // Security settings
  updatePassword: (currentPassword: string, newPassword: string, confirmPassword: string) => void;
  
  // System settings
  system: {
    darkMode: boolean;
    analyticsTracking: boolean;
    autoUpdates: boolean;
  };
  updateSystem: (data: { 
    darkMode?: boolean; 
    analyticsTracking?: boolean; 
    autoUpdates?: boolean 
  }) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  
  // Profile state
  const [profile, setProfile] = useState({
    name: "Admin User",
    email: "admin@example.com",
    bio: ""
  });
  
  // Notification settings
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    maintenanceAlerts: true,
    systemUpdates: false
  });
  
  // System settings
  const [system, setSystem] = useState({
    darkMode: false,
    analyticsTracking: true,
    autoUpdates: true
  });
  
  // Load settings from localStorage on component mount
  useEffect(() => {
    try {
      const savedProfile = localStorage.getItem('userProfile');
      const savedNotifications = localStorage.getItem('userNotifications');
      const savedSystem = localStorage.getItem('userSystem');
      
      if (savedProfile) setProfile(JSON.parse(savedProfile));
      if (savedNotifications) setNotifications(JSON.parse(savedNotifications));
      if (savedSystem) setSystem(JSON.parse(savedSystem));
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  }, []);
  
  // Save settings to localStorage when they change
  useEffect(() => {
    localStorage.setItem('userProfile', JSON.stringify(profile));
  }, [profile]);
  
  useEffect(() => {
    localStorage.setItem('userNotifications', JSON.stringify(notifications));
  }, [notifications]);
  
  useEffect(() => {
    localStorage.setItem('userSystem', JSON.stringify(system));
  }, [system]);
  
  // Update functions
  const updateProfile = (data: { name?: string; email?: string; bio?: string }) => {
    setProfile(prev => ({ ...prev, ...data }));
    toast({
      title: "Profile Updated",
      description: "Your profile information has been saved.",
    });
  };
  
  const updateNotifications = (data: { 
    emailNotifications?: boolean; 
    maintenanceAlerts?: boolean; 
    systemUpdates?: boolean 
  }) => {
    setNotifications(prev => ({ ...prev, ...data }));
    toast({
      title: "Notification Preferences Saved",
      description: "Your notification settings have been updated.",
    });
  };
  
  const updatePassword = (currentPassword: string, newPassword: string, confirmPassword: string) => {
    // In a real app, this would call an API to update the password
    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match.",
        variant: "destructive",
      });
      return;
    }
    
    if (currentPassword === "") {
      toast({
        title: "Error",
        description: "Current password is required.",
        variant: "destructive",
      });
      return;
    }
    
    if (newPassword.length < 8) {
      toast({
        title: "Error",
        description: "New password must be at least 8 characters.",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Password Updated",
      description: "Your password has been changed successfully.",
    });
  };
  
  const updateSystem = (data: { 
    darkMode?: boolean; 
    analyticsTracking?: boolean; 
    autoUpdates?: boolean 
  }) => {
    setSystem(prev => ({ ...prev, ...data }));
    
    // Apply dark mode if changed
    if (data.darkMode !== undefined) {
      if (data.darkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
    
    toast({
      title: "System Settings Applied",
      description: "Your system settings have been updated.",
    });
  };
  
  return (
    <SettingsContext.Provider 
      value={{ 
        profile, 
        updateProfile, 
        notifications, 
        updateNotifications, 
        updatePassword, 
        system, 
        updateSystem 
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = (): SettingsContextType => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
};
