
import React from 'react';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';

interface SubmitButtonProps {
  isSubmitting: boolean;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ isSubmitting }) => {
  return (
    <div className="flex justify-end pt-4">
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? (
          'Sending...'
        ) : (
          <>
            <Send className="mr-2 h-4 w-4" />
            Send Email
          </>
        )}
      </Button>
    </div>
  );
};

export default SubmitButton;
