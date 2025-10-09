
import React from 'react';
import { Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ChatbotButtonProps {
  toggleChat: () => void;
  unreadCount?: number;
}

const ChatbotButton: React.FC<ChatbotButtonProps> = ({ toggleChat, unreadCount = 0 }) => {
  return (
    <Button
      onClick={toggleChat}
      className="fixed bottom-6 right-6 rounded-full h-14 w-14 shadow-lg transition-transform hover:scale-105 p-0 z-50"
      size="icon"
    >
      <Bot size={24} />
      {unreadCount > 0 && (
        <div className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs">
          {unreadCount > 9 ? '9+' : unreadCount}
        </div>
      )}
    </Button>
  );
};

export default ChatbotButton;
