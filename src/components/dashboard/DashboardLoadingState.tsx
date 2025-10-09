
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import DashboardHeader from './DashboardHeader';

const DashboardLoadingState: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <DashboardHeader />
        <Badge variant="outline" className="animate-pulse">
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Loading Real-time Data
        </Badge>
        <Card>
          <CardContent className="flex items-center justify-center p-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
            <span>Loading dynamic dashboard data...</span>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default DashboardLoadingState;
