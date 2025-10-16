
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import DashboardHeader from './DashboardHeader';

const DashboardErrorState: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <DashboardHeader />
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            There was an error loading the dynamic dashboard data. Please check your connection and try again.
          </AlertDescription>
        </Alert>
      </div>
    </DashboardLayout>
  );
};

export default DashboardErrorState;
