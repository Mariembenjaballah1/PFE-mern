
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Logo from '@/components/Logo';

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-muted/20">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="flex justify-center">
          <Logo size="lg" />
        </div>
        <h1 className="text-7xl font-bold text-primary">404</h1>
        <h2 className="text-2xl font-bold mt-2">Page Not Found</h2>
        <p className="text-muted-foreground">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <div className="flex justify-center gap-4 pt-4">
          <Button onClick={() => navigate('/dashboard')}>
            Go to Dashboard
          </Button>
          <Button variant="outline" onClick={() => navigate('/')}>
            Return to Login
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
