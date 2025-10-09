
import React from 'react';
import { Bot, X, Maximize, Minimize } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ChatHeaderProps {
  isMinimized: boolean;
  toggleMinimize: (e: React.MouseEvent) => void;
  toggleChat: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ isMinimized, toggleMinimize, toggleChat }) => {
  return (
    <div className="flex items-center justify-between bg-primary text-primary-foreground p-3 rounded-t-lg">
      <div className="flex items-center">
        <Bot className="mr-2 h-5 w-5" />
        <span className="font-medium">InvenBot Assistant</span>
      </div>
      <div className="flex items-center space-x-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 text-primary-foreground hover:bg-primary/80"
          onClick={toggleMinimize}
        >
          {isMinimized ? <Maximize size={14} /> : <Minimize size={14} />}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 text-primary-foreground hover:bg-primary/80"
          onClick={toggleChat}
        >
          <X size={14} />
        </Button>
      </div>
    </div>
  );
};

export default ChatHeader;
