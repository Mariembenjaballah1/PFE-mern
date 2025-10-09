
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ResourceChartEmpty: React.FC = () => {
  return (
    <Card className="card-gradient animate-scale-in">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Resource Charts</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center justify-center h-[300px]">
        <div className="text-center text-muted-foreground">
          <p className="text-lg mb-2">No resource data available</p>
          <p className="text-sm">Add projects with resource quotas and assign assets to see charts</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResourceChartEmpty;
