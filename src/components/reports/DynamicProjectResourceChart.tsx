
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileDown, AlertCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useProjectResourceData } from './hooks/useProjectResourceData';
import { getResourceIcon, ResourceType } from './utils/resourceChartUtils';
import ResourceTypeTabs from './components/ResourceTypeTabs';
import ProjectResourceChartDisplay from './components/ProjectResourceChartDisplay';
import ResourceChartEmptyState from './components/ResourceChartEmptyState';

const DynamicProjectResourceChart: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ResourceType>('cpu');
  const { projectResourceData, isLoading, error } = useProjectResourceData();
  
  // Always call hook at top level
  const IconComponent = getResourceIcon(activeTab);
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconComponent className="h-5 w-5" />
            Resource Usage by Project
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[400px] w-full" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconComponent className="h-5 w-5" />
            Resource Usage by Project
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Error loading project resource data: {String(error)}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }
  
  if (!projectResourceData || projectResourceData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconComponent className="h-5 w-5" />
            Resource Usage by Project
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResourceChartEmptyState />
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <IconComponent className="h-5 w-5" />
          Resource Usage by Project
        </CardTitle>
        <Button variant="outline" size="sm" className="flex items-center gap-1">
          <FileDown className="h-4 w-4" /> Export Data
        </Button>
      </CardHeader>
      <CardContent>
        <ResourceTypeTabs activeTab={activeTab} onTabChange={setActiveTab} />
        <ProjectResourceChartDisplay data={projectResourceData} activeTab={activeTab} />
      </CardContent>
    </Card>
  );
};

export default DynamicProjectResourceChart;
