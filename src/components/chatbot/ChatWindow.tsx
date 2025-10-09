
import React from 'react';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { QuickActions } from './QuickActions';
import { SuggestionChips } from './SuggestionChips';
import { ChatStats } from './ChatStats';
import { Message } from './types';

interface ChatWindowProps {
  isMinimized: boolean;
  toggleMinimize: (e: React.MouseEvent) => void;
  toggleChat: () => void;
  messages: Message[];
  onSendMessage: (message: string) => void;
  onQuickAction: (action: string) => void;
  onSuggestionClick: (suggestion: string) => void;
  isTyping?: boolean;
  suggestions?: string[];
  chatStats?: {
    totalMessages: number;
    helpfulResponses: number;
    avgResponseTime: string;
  };
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  isMinimized,
  toggleMinimize,
  toggleChat,
  messages,
  onSendMessage,
  onQuickAction,
  onSuggestionClick,
  isTyping = false,
  suggestions = [],
  chatStats = { totalMessages: 0, helpfulResponses: 0, avgResponseTime: '1.2s' }
}) => {
  return (
    <div
      className={`fixed right-6 bottom-24 bg-background border rounded-lg shadow-xl w-80 sm:w-96 transition-all duration-300 ease-in-out z-50 ${
        isMinimized ? 'h-14' : 'h-[600px] max-h-[80vh]'
      }`}
    >
      <ChatHeader
        isMinimized={isMinimized}
        toggleMinimize={toggleMinimize}
        toggleChat={toggleChat}
      />

      {!isMinimized && (
        <div className="flex flex-col h-full">
          <div className="flex-1 overflow-hidden">
            <MessageList messages={messages} isTyping={isTyping} />
          </div>

          {/* Quick Actions */}
          <QuickActions onAction={onQuickAction} />

          {/* Contextual Suggestions */}
          {suggestions.length > 0 && (
            <SuggestionChips 
              suggestions={suggestions} 
              onSuggestionClick={onSuggestionClick} 
            />
          )}

          {/* Chat Stats */}
          <div className="px-3 pb-2">
            <ChatStats {...chatStats} />
          </div>

          {/* Message Input */}
          <MessageInput onSendMessage={onSendMessage} disabled={isTyping} />
        </div>
      )}
    </div>
  );
};

export default ChatWindow;
