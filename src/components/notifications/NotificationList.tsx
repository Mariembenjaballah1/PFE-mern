
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '@/hooks/use-notifications';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import NotificationItem from './NotificationItem';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

const NotificationList: React.FC = () => {
  const { notifications, clearAllNotifications } = useNotifications();
  const navigate = useNavigate();

  const handleNotificationClick = (notification: any) => {
    if (notification.link) {
      navigate(notification.link);
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.3
      }
    }),
    exit: { opacity: 0, y: -10 }
  };

  if (notifications.length === 0) {
    return (
      <div className="p-6 text-center text-muted-foreground flex flex-col items-center">
        <div className="mb-2 text-green-500/50 dark:text-green-400/50">
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
          </svg>
        </div>
        <p>Aucune notification</p>
      </div>
    );
  }

  return (
    <div>
      <div className="p-3 border-b flex justify-between items-center">
        <h2 className="font-semibold text-sm">Notifications</h2>
        <Button 
          onClick={clearAllNotifications}
          variant="ghost"
          size="sm"
          className="text-xs text-muted-foreground hover:text-primary transition-colors duration-200"
        >
          Tout effacer
        </Button>
      </div>
      <AnimatePresence>
        <div className="divide-y max-h-80 overflow-y-auto">
          {notifications.map((notification, index) => (
            <motion.div
              key={notification.id}
              custom={index}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <NotificationItem 
                notification={notification}
                onClick={() => handleNotificationClick(notification)}
                timeAgo={formatDistanceToNow(new Date(notification.timestamp), { 
                  addSuffix: true,
                  locale: fr 
                })}
              />
            </motion.div>
          ))}
        </div>
      </AnimatePresence>
    </div>
  );
};

export default NotificationList;
