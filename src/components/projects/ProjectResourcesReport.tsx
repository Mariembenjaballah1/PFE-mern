
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getProjectResourceUsage } from '@/services/projectApi';
import { useToast } from '@/hooks/use-toast';
import { FileDown, Cpu, MemoryStick, HardDrive, Info } from 'lucide-react';
import { exportToCSV } from '@/services/reportsService';

export const ProjectResourcesReport: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'cpu' | 'ram' | 'disk'>('cpu');
  const { toast } = useToast();
  
  const { data: resourceData = [], isLoading, error } = useQuery({
    queryKey: ['projectResources'],
    queryFn: getProjectResourceUsage,
    refetchInterval: 30000, // Refresh every 30 seconds
    staleTime: 10000
  });

  // Log the resource data for debugging
  useEffect(() => {
    if (resourceData && resourceData.length > 0) {
      console.log('ProjectResourcesReport - Resource data received:', resourceData);
    }
  }, [resourceData]);
  
  const handleExportData = async () => {
    try {
      if (!resourceData || resourceData.length === 0) {
        toast({
          title: "No Data",
          description: "No resource data available to export.",
          variant: "destructive"
        });
        return;
      }

      const exportData = resourceData.map((project: any) => ({
        'Project Name': project.name,
        'CPU Quota (Cores)': project.quotas?.cpu || 0,
        'CPU Used (Cores)': project.used?.cpu || 0,
        'CPU Usage %': project.quotas?.cpu > 0 ? ((project.used?.cpu || 0) / project.quotas.cpu * 100).toFixed(2) + '%' : '0%',
        'RAM Quota (GB)': project.quotas?.ram || 0,
        'RAM Used (GB)': project.used?.ram || 0,
        'RAM Usage %': project.quotas?.ram > 0 ? ((project.used?.ram || 0) / project.quotas.ram * 100).toFixed(2) + '%' : '0%',
        'Disk Quota (GB)': project.quotas?.disk || 0,
        'Disk Used (GB)': project.used?.disk || 0,
        'Disk Usage %': project.quotas?.disk > 0 ? ((project.used?.disk || 0) / project.quotas.disk * 100).toFixed(2) + '%' : '0%'
      }));
      
      // Always export as PDF with chart - ensure chart is visible before export
      const chartElement = document.getElementById('project-resources-chart');
      if (chartElement) {
        console.log('Chart element found for export, ensuring visibility...');
        const htmlElement = chartElement as HTMLElement;
        htmlElement.style.display = 'block';
        htmlElement.style.visibility = 'visible';
        
        // Wait for chart to be fully rendered
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      await exportToCSV(exportData, 'project_resource_usage_report', 'pdf', 'project-resources-chart');
      
      toast({
        title: "Success",
        description: "Project resource report exported successfully."
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Error",
        description: "Failed to export resource report.",
        variant: "destructive"
      });
    }
  };

  const resourceFormatter = (value: number, type: 'cpu' | 'ram' | 'disk') => {
    if (type === 'cpu') return `${value} Cores`;
    return `${value} GB`;
  };

  const prepareBarChartData = () => {
    if (!resourceData || resourceData.length === 0) return [];
    
    return resourceData.map((project: any) => ({
      name: project.name.length > 12 ? `${project.name.substring(0, 12)}...` : project.name,
      fullName: project.name,
      used: project.used?.[activeTab] || 0,
      quota: project.quotas?.[activeTab] || 0,
      utilization: project.quotas?.[activeTab] > 0 
        ? Math.round(((project.used?.[activeTab] || 0) / project.quotas[activeTab]) * 100)
        : 0
    }));
  };
  
  const getIcon = () => {
    switch (activeTab) {
      case 'cpu':
        return <Cpu className="h-5 w-5" />;
      case 'ram':
        return <MemoryStick className="h-5 w-5" />;
      case 'disk':
        return <HardDrive className="h-5 w-5" />;
      default:
        return null;
    }
  };
  
  const getTitle = () => {
    switch (activeTab) {
      case 'cpu':
        return "CPU Allocation";
      case 'ram':
        return "RAM Allocation";
      case 'disk':
        return "Disk Space Allocation";
      default:
        return "Resource Allocation";
    }
  };

  const chartData = prepareBarChartData();
  const hasValidData = chartData.length > 0 && chartData.some(item => item.quota > 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          {getIcon()} {getTitle()}
        </h2>
        <Button 
          variant="outline" 
          className="flex items-center gap-2" 
          onClick={handleExportData}
          disabled={isLoading || !hasValidData}
        >
          <FileDown className="h-4 w-4" /> Export PDF Report
        </Button>
      </div>
      
      {error && (
        <Card className="border-yellow-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-yellow-700">
              <Info className="h-4 w-4" />
              <span>Unable to fetch live data. Displaying sample data.</span>
            </div>
          </CardContent>
        </Card>
      )}
      
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'cpu' | 'ram' | 'disk')}>
        <TabsList>
          <TabsTrigger value="cpu" className="flex items-center gap-1">
            <Cpu className="h-4 w-4" /> CPU
          </TabsTrigger>
          <TabsTrigger value="ram" className="flex items-center gap-1">
            <MemoryStick className="h-4 w-4" /> RAM
          </TabsTrigger>
          <TabsTrigger value="disk" className="flex items-center gap-1">
            <HardDrive className="h-4 w-4" /> Disk
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="pt-4">
          {isLoading ? (
            <Card>
              <CardContent className="pt-6 flex items-center justify-center h-[400px]">
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  <span>Loading resource data...</span>
                </div>
              </CardContent>
            </Card>
          ) : hasValidData ? (
            <Card>
              <CardContent className="pt-6">
                <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                  {chartData.map((item, index) => (
                    <div key={index} className="bg-muted/50 rounded-lg p-3">
                      <div className="font-medium text-sm mb-1">{item.fullName}</div>
                      <div className="text-xs text-muted-foreground">
                        Used: {item.used} / {item.quota} {activeTab === 'cpu' ? 'cores' : 'GB'}
                      </div>
                      <div className="text-xs font-medium text-blue-600">
                        {item.utilization}% utilized
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Ensure chart container is properly visible and has the correct ID */}
                <div 
                  className="h-[400px] bg-white" 
                  id="project-resources-chart"
                  style={{ 
                    display: 'block', 
                    visibility: 'visible',
                    position: 'relative',
                    backgroundColor: '#ffffff'
                  }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={chartData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis 
                        tickFormatter={(value) => resourceFormatter(value, activeTab)}
                      />
                      <Tooltip 
                        formatter={(value, name) => [
                          resourceFormatter(value as number, activeTab), 
                          name === 'used' ? 'Used' : 'Quota'
                        ]}
                        labelFormatter={(label) => {
                          const item = chartData.find(d => d.name === label);
                          return item ? item.fullName : label;
                        }}
                      />
                      <Legend />
                      <Bar dataKey="used" fill="#3b82f6" name="Used" />
                      <Bar dataKey="quota" fill="#e5e7eb" name="Quota" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="pt-6 flex items-center justify-center h-[400px]">
                <div className="text-center text-muted-foreground">
                  <Info className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                  <p className="text-lg mb-2">No project resource data available</p>
                  <p className="text-sm">Add projects with resource allocations and assign assets to see usage data</p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
