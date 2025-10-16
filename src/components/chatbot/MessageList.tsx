
import React, { useRef, useEffect } from 'react';
import { Bot } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar } from '@/components/ui/avatar';
import { Message } from './types';

interface MessageListProps {
  messages: Message[];
  isTyping?: boolean;
}

const MessageList: React.FC<MessageListProps> = ({ messages, isTyping = false }) => {
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const formatTime = (timestamp: Date | string): string => {
    // Check if timestamp is a Date object or convert it to one
    const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
    // Check if the date is valid before calling toLocaleTimeString
    if (isNaN(date.getTime())) {
      return ''; // Return empty string for invalid dates
    }
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <ScrollArea className="h-[400px] p-4" ref={scrollAreaRef}>
      <div className="space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.sender === 'user' ? 'justify-end' : 'justify-start'
            } animate-fade-in`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.sender === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted'
              }`}
            >
              {message.sender === 'bot' && (
                <div className="flex items-center mb-1 gap-2">
                  <Avatar className="h-6 w-6">
                    <Bot className="h-4 w-4" />
                  </Avatar>
                  <span className="text-xs font-medium">InvenBot</span>
                </div>
              )}
              <p className="text-sm">{message.text}</p>
              <div
                className={`text-xs mt-1 ${
                  message.sender === 'user'
                    ? 'text-primary-foreground/80'
                    : 'text-muted-foreground'
                }`}
              >
                {formatTime(message.timestamp)}
              </div>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start animate-fade-in">
            <div className="max-w-[80%] rounded-lg p-3 bg-muted">
              <div className="flex items-center mb-1 gap-2">
                <Avatar className="h-6 w-6">
                  <Bot className="h-4 w-4" />
                </Avatar>
                <span className="text-xs font-medium">InvenBot</span>
              </div>
              <div className="flex space-x-1 items-center">
                <span className="w-2 h-2 bg-muted-foreground/70 rounded-full animate-pulse" style={{ animationDelay: '0ms' }}></span>
                <span className="w-2 h-2 bg-muted-foreground/70 rounded-full animate-pulse" style={{ animationDelay: '300ms' }}></span>
                <span className="w-2 h-2 bg-muted-foreground/70 rounded-full animate-pulse" style={{ animationDelay: '600ms' }}></span>
              </div>
            </div>
          </div>
        )}
      </div>
    </ScrollArea>
  );
};

export default MessageList;
