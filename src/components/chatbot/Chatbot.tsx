
import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import ChatbotButton from './ChatbotButton';
import ChatWindow from './ChatWindow';
import { Message } from './types';
import { getBotResponse } from './chatbotResponses';
import { getEnhancedBotResponse, getContextualSuggestions } from './enhanced-chatbot-responses';

const Chatbot: React.FC = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>(() => {
    const savedMessages = localStorage.getItem('chatbotMessages');
    return savedMessages ? JSON.parse(savedMessages) : [
      {
        id: '1',
        text: 'Hello! I am InvenBot, your enhanced inventory assistant. I can help with assets, maintenance, reports, projects, and much more. How can I assist you today?',
        sender: 'bot',
        timestamp: new Date(),
        type: 'text'
      },
    ];
  });
  const [isTyping, setIsTyping] = useState(false);
  const [chatStats, setChatStats] = useState({
    totalMessages: 0,
    helpfulResponses: 0,
    avgResponseTime: '1.2s'
  });

  // Save messages to localStorage when they change
  useEffect(() => {
    localStorage.setItem('chatbotMessages', JSON.stringify(messages));
    setChatStats(prev => ({
      ...prev,
      totalMessages: messages.filter(m => m.sender === 'user').length
    }));
  }, [messages]);

  const toggleChat = useCallback(() => {
    setIsOpen(prev => !prev);
    if (isMinimized) setIsMinimized(false);
  }, [isMinimized]);

  const toggleMinimize = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMinimized(prev => !prev);
  }, []);

  const handleSendMessage = useCallback((messageText: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    // Get enhanced response with context
    const currentPage = location.pathname.split('/')[1] || 'dashboard';
    const enhancedResponse = getEnhancedBotResponse(messageText, {
      currentPage,
      userRole: 'admin' // This could be dynamic based on user context
    });

    const thinkingTime = Math.min(Math.max(messageText.length * 20, 500), 2000);
    
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: enhancedResponse.text,
        sender: 'bot',
        timestamp: new Date(),
        type: 'text',
        context: {
          suggestions: enhancedResponse.suggestions,
          actions: enhancedResponse.actions
        }
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
      
      // Update helpful responses count
      setChatStats(prev => ({
        ...prev,
        helpfulResponses: prev.helpfulResponses + 1
      }));
    }, thinkingTime);
  }, [location.pathname]);

  const handleQuickAction = useCallback((action: string) => {
    const actionMessage: Message = {
      id: Date.now().toString(),
      text: action,
      sender: 'bot',
      timestamp: new Date(),
      type: 'text'
    };
    setMessages(prev => [...prev, actionMessage]);
  }, []);

  const handleSuggestionClick = useCallback((suggestion: string) => {
    handleSendMessage(suggestion);
  }, [handleSendMessage]);

  const currentPageSuggestions = getContextualSuggestions(
    location.pathname.split('/')[1] || 'dashboard'
  );

  return (
    <>
      <ChatbotButton 
        toggleChat={toggleChat} 
        unreadCount={isOpen ? 0 : messages.filter(m => m.sender === 'bot' && !m.read).length} 
      />
      
      {isOpen && (
        <ChatWindow
          isMinimized={isMinimized}
          toggleMinimize={toggleMinimize}
          toggleChat={toggleChat}
          messages={messages}
          onSendMessage={handleSendMessage}
          onQuickAction={handleQuickAction}
          onSuggestionClick={handleSuggestionClick}
          isTyping={isTyping}
          suggestions={currentPageSuggestions}
          chatStats={chatStats}
        />
      )}
    </>
  );
};

export default Chatbot;
