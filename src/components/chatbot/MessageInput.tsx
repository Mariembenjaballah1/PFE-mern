
import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage, disabled = false }) => {
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || disabled) return;
    
    onSendMessage(inputValue);
    setInputValue('');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="border-t p-3 flex items-center space-x-2"
    >
      <Input
        value={inputValue}
        onChange={handleInputChange}
        placeholder="Type your message..."
        className="flex-1"
        disabled={disabled}
      />
      <Button type="submit" size="icon" className="shrink-0" disabled={disabled}>
        <Send className="h-4 w-4" />
      </Button>
    </form>
  );
};

export default MessageInput;
