
import React from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';

const AssetDetailsNotFound: React.FC = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate('/assets');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={handleGoBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Asset Not Found</h1>
        </div>
        <Card>
          <CardContent className="p-6 text-center">
            <p>The asset you're looking for doesn't exist or has been removed.</p>
            <Button className="mt-4" onClick={handleGoBack}>
              Return to Assets List
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AssetDetailsNotFound;
