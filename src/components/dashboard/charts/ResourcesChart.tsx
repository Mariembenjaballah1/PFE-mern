
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Asset } from '@/types/asset';
import { useResourceData } from './useResourceData';
import ResourceChartEmpty from './ResourceChartEmpty';
import ResourceAllocationChart from './ResourceAllocationChart';
import UsageTrendsChart from './UsageTrendsChart';

interface ResourcesChartProps {
  assets?: Asset[];
}

const ResourcesChart: React.FC<ResourcesChartProps> = ({ assets = [] }) => {
  const { resourceData, usageTrends, projects, hasData } = useResourceData(assets);

  // If no real data, show a message
  if (!hasData) {
    return <ResourceChartEmpty />;
  }

  return (
    <Card className="card-gradient animate-scale-in">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">
          Resource Charts ({projects.length} Projects, {assets.length} Assets)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="allocation" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="allocation">Resource Allocation by Project</TabsTrigger>
            <TabsTrigger value="trends">Usage Trends</TabsTrigger>
          </TabsList>
          
          <TabsContent value="allocation" className="mt-4">
            <ResourceAllocationChart data={resourceData} />
          </TabsContent>
          
          <TabsContent value="trends" className="mt-4">
            <UsageTrendsChart data={usageTrends} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ResourcesChart;
