
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Folder } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAssetsByProjectData } from '@/hooks/useAssetsByProjectData';
import AssetsByProjectChart from './AssetsByProjectChart';
import AssetsByProjectBarChart from './AssetsByProjectBarChart';
import AssetsByProjectCPUChart from './AssetsByProjectCPUChart';
import AssetsByProjectRAMChart from './AssetsByProjectRAMChart';
import AssetsByProjectExport from './AssetsByProjectExport';
import { Asset } from '@/types/asset';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface AssetsByProjectWidgetProps {
  assets?: Asset[];
}

const AssetsByProjectWidget: React.FC<AssetsByProjectWidgetProps> = ({ assets }) => {
  const navigate = useNavigate();
  const { 
    assetsByProject, 
    chartData, 
    cpuChartData, 
    ramChartData, 
    hasData, 
    totalAssets, 
    totalCPU, 
    totalRAM, 
    isLoading 
  } = useAssetsByProjectData();

  console.log('AssetsByProjectWidget render:', {
    isLoading,
    hasData,
    chartDataLength: chartData.length,
    totalAssets,
    totalCPU,
    totalRAM,
    rawData: assetsByProject
  });
  
  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2 text-blue-800 dark:text-blue-300">
          <Folder className="h-5 w-5" />
          Assets by Project
        </CardTitle>
        <AssetsByProjectExport 
          assetsByProject={assetsByProject}
          hasData={hasData}
        />
      </CardHeader>
      <CardContent className="pt-6">
        {isLoading ? (
          <div className="h-[350px] flex items-center justify-center">
            <Skeleton className="h-[320px] w-full rounded-lg" />
          </div>
        ) : hasData ? (
          <Tabs defaultValue="pie" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-4">
              <TabsTrigger value="pie">Pie Chart</TabsTrigger>
              <TabsTrigger value="bar">Bar Chart</TabsTrigger>
              <TabsTrigger value="cpu">CPU</TabsTrigger>
              <TabsTrigger value="ram">RAM</TabsTrigger>
            </TabsList>
            
            <TabsContent value="pie">
              <AssetsByProjectChart 
                chartData={chartData}
                totalAssets={totalAssets}
              />
            </TabsContent>
            
            <TabsContent value="bar">
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">{totalAssets}</p>
                  <p className="text-sm text-muted-foreground">Total Assets Assigned</p>
                </div>
                <div 
                  className="w-full h-[300px]" 
                  id="assets-by-project-bar-chart"
                  style={{ 
                    display: 'block', 
                    visibility: 'visible',
                    position: 'relative',
                    backgroundColor: '#ffffff',
                    border: '1px solid transparent',
                    padding: '10px'
                  }}
                >
                  <AssetsByProjectBarChart 
                    chartData={chartData}
                    totalAssets={totalAssets}
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="cpu">
              <div 
                className="w-full" 
                id="assets-by-project-cpu-chart"
                style={{ 
                  display: 'block', 
                  visibility: 'visible',
                  position: 'relative',
                  backgroundColor: '#ffffff',
                  border: '1px solid transparent',
                  padding: '10px'
                }}
              >
                <AssetsByProjectCPUChart 
                  chartData={cpuChartData}
                  totalCPU={totalCPU}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="ram">
              <div 
                className="w-full" 
                id="assets-by-project-ram-chart"
                style={{ 
                  display: 'block', 
                  visibility: 'visible',
                  position: 'relative',
                  backgroundColor: '#ffffff',
                  border: '1px solid transparent',
                  padding: '10px'
                }}
              >
                <AssetsByProjectRAMChart 
                  chartData={ramChartData}
                  totalRAM={totalRAM}
                />
              </div>
            </TabsContent>
          </Tabs>
        ) : (
          <div className="h-[350px] flex flex-col items-center justify-center">
            <Folder className="h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-2 text-center">No asset distribution data available</p>
            <p className="text-sm text-muted-foreground mb-4 text-center">Start by assigning assets to projects</p>
            <Button variant="outline" size="sm" onClick={() => navigate('/projects')}>
              Manage Projects
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AssetsByProjectWidget;
