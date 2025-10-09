
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';

interface Notification {
  id: string;
  type: 'maintenance' | 'assignment' | 'status' | 'general';
  title: string;
  message: string;
  read: boolean;
  timestamp: string;
  link?: string;
}

interface NotificationsContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'read' | 'timestamp'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotification: (id: string) => void;
  clearAllNotifications: () => void;
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

export const NotificationsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Charger les notifications du localStorage au démarrage
  useEffect(() => {
    const savedNotifications = localStorage.getItem('notifications');
    if (savedNotifications) {
      try {
        setNotifications(JSON.parse(savedNotifications));
      } catch (e) {
        console.error('Erreur lors du chargement des notifications:', e);
      }
    }
  }, []);

  // Sauvegarder les notifications dans le localStorage quand elles changent
  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }, [notifications]);

  const addNotification = (notification: Omit<Notification, 'id' | 'read' | 'timestamp'>) => {
    const newNotification = {
      ...notification,
      id: Date.now().toString(),
      read: false,
      timestamp: new Date().toISOString(),
    };
    
    setNotifications(prev => [newNotification, ...prev]);
    
    // Afficher un toast pour les nouvelles notifications
    toast(notification.title, {
      description: notification.message,
      action: {
        label: "Voir",
        onClick: () => {
          if (notification.link) {
            window.location.href = notification.link;
          }
        }
      }
    });
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const clearNotification = (id: string) => {
    setNotifications(prev => 
      prev.filter(notification => notification.id !== id)
    );
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  return (
    <NotificationsContext.Provider value={{
      notifications,
      addNotification,
      markAsRead,
      markAllAsRead,
      clearNotification,
      clearAllNotifications
    }}>
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationsContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationsProvider');
  }
  return context;
};
