
import React from 'react';
import PasswordResetForm from '@/components/auth/PasswordResetForm';
import { Separator } from '@/components/ui/separator';
import { Link } from 'react-router-dom';

const PasswordResetPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-muted/30 p-4">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">InvenTrack System</h1>
        <p className="text-muted-foreground">Asset Management & Maintenance Platform</p>
      </div>
      
      <Separator className="mb-8 max-w-md w-full" />
      
      <PasswordResetForm />
      
      <p className="mt-8 text-sm text-muted-foreground">
        Don't have an account? Contact your system administrator.
      </p>
      
      <div className="mt-16 text-center text-sm text-muted-foreground">
        <p>&copy; 2025 InvenTrack Systems. All rights reserved.</p>
        <div className="mt-2 flex justify-center space-x-4">
          <Link to="#" className="hover:underline">Privacy</Link>
          <Link to="#" className="hover:underline">Terms</Link>
          <Link to="#" className="hover:underline">Contact</Link>
        </div>
      </div>
    </div>
  );
};

export default PasswordResetPage;
