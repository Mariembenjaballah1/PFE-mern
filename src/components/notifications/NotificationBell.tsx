
import React, { useState } from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import NotificationList from './NotificationList';
import { useNotifications } from '@/hooks/use-notifications';
import { AnimatePresence, motion } from 'framer-motion';

const NotificationBell: React.FC = () => {
  const { notifications, markAllAsRead } = useNotifications();
  const unreadCount = notifications.filter(n => !n.read).length;
  const [open, setOpen] = useState(false);

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen && unreadCount > 0) {
      markAllAsRead();
    }
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <AnimatePresence>
            {unreadCount > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 20
                }}
              >
                <Badge 
                  className="absolute -top-1 -right-1 px-1.5 py-0.5 bg-red-500 text-white text-xs min-w-[18px] h-[18px] flex items-center justify-center rounded-full"
                  variant="destructive"
                >
                  {unreadCount > 99 ? '99+' : unreadCount}
                </Badge>
              </motion.div>
            )}
          </AnimatePresence>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 max-h-96 overflow-y-auto p-0 backdrop-blur-sm border border-green-100 dark:border-green-900/50 shadow-lg">
        <NotificationList />
      </PopoverContent>
    </Popover>
  );
};

export default NotificationBell;
