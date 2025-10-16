
import React from 'react';
import { CalendarClock, Wrench, Bell, AlertCircle } from 'lucide-react';

interface NotificationItemProps {
  notification: {
    id: string;
    type: 'maintenance' | 'assignment' | 'status' | 'general';
    title: string;
    message: string;
    read: boolean;
    timestamp: string;
  };
  onClick: () => void;
  timeAgo: string;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ notification, onClick, timeAgo }) => {
  const getIcon = () => {
    switch (notification.type) {
      case 'maintenance':
        return <CalendarClock className="h-5 w-5 text-green-500" />;
      case 'assignment':
        return <Wrench className="h-5 w-5 text-emerald-500" />;
      case 'status':
        return <AlertCircle className="h-5 w-5 text-amber-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div 
      onClick={onClick}
      className={`p-4 hover:bg-muted cursor-pointer ${
        notification.read 
          ? '' 
          : 'bg-green-50 dark:bg-green-900/10'
      }`}
    >
      <div className="flex gap-3">
        <div className="mt-0.5">
          {getIcon()}
        </div>
        <div className="flex-1">
          <div className="font-medium">{notification.title}</div>
          <div className="text-sm text-muted-foreground">{notification.message}</div>
          <div className="text-xs text-muted-foreground mt-1">{timeAgo}</div>
        </div>
      </div>
    </div>
  );
};

export default NotificationItem;
