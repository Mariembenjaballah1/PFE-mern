
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
import { getProjectResourceUsage } from '@/services/projectApi';
import { useToast } from '@/hooks/use-toast';
import { exportToCSV } from '@/services/reportsService';
import { FileDown, Cpu, MemoryStick, HardDrive, Folder, RefreshCw } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const ProjectResourceReportCard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'cpu' | 'ram' | 'disk'>('cpu');
  const { toast } = useToast();
  
  const { data: resourceData = [], isLoading, error, refetch } = useQuery({
    queryKey: ['projectResourceReport'],
    queryFn: async () => {
      console.log('Fetching real-time project resource data...');
      const data = await getProjectResourceUsage();
      console.log('Dynamic project resource data received:', data);
      return data;
    },
    staleTime: 10000, // Consider data stale after 10 seconds
    refetchInterval: 30000, // Auto-refresh every 30 seconds
    refetchOnWindowFocus: true, // Refresh when user focuses window
    retry: 2
  });

  const handleRefresh = async () => {
    console.log('Manual refresh triggered for project resources');
    await refetch();
    toast({
      title: "Data Refreshed",
      description: "Project resource data has been updated with the latest information."
    });
  };
  
  const handleExportData = () => {
    try {
      if (!resourceData || resourceData.length === 0) {
        toast({
          title: "No Data",
          description: "No project resource data available to export.",
          variant: "destructive"
        });
        return;
      }

      const exportData = resourceData.map((project: any) => ({
        'Project Name': project.name,
        'CPU Quota': project.quotas?.cpu || 0,
        'CPU Used': project.used?.cpu || 0,
        'CPU Utilization (%)': project.quotas?.cpu > 0 ? Math.round((project.used?.cpu || 0) / project.quotas.cpu * 100) : 0,
        'RAM Quota (GB)': project.quotas?.ram || 0,
        'RAM Used (GB)': project.used?.ram || 0,
        'RAM Utilization (%)': project.quotas?.ram > 0 ? Math.round((project.used?.ram || 0) / project.quotas.ram * 100) : 0,
        'Disk Quota (GB)': project.quotas?.disk || 0,
        'Disk Used (GB)': project.used?.disk || 0,
        'Disk Utilization (%)': project.quotas?.disk > 0 ? Math.round((project.used?.disk || 0) / project.quotas.disk * 100) : 0
      }));
      
      exportToCSV(exportData, 'project_resource_utilization_report', 'pdf', 'project-resource-chart');
      
      toast({
        title: "Success",
        description: "Project resource report exported successfully."
      });
    } catch (error) {
      console.error('Error exporting project report:', error);
      toast({
        title: "Error",
        description: "Failed to export project resource report.",
        variant: "destructive"
      });
    }
  };
  
  const prepareBarchartData = () => {
    if (!resourceData || resourceData.length === 0) {
      console.log('No resource data available for chart');
      return [];
    }
    
    const chartData = resourceData.map((project: any) => ({
      name: project.name?.length > 12 ? `${project.name.substring(0, 12)}...` : project.name || 'Unknown',
      fullName: project.name || 'Unknown Project',
      used: project.used?.[activeTab] || 0,
      quota: project.quotas?.[activeTab] || 0,
      utilization: project.quotas?.[activeTab] > 0 
        ? Math.round(((project.used?.[activeTab] || 0) / project.quotas[activeTab]) * 100)
        : 0
    }));
    
    console.log(`Dynamic ${activeTab} chart data:`, chartData);
    return chartData;
  };
  
  const getResourceTitle = () => {
    switch (activeTab) {
      case 'cpu':
        return 'CPU Utilization by Project';
      case 'ram':
        return 'Memory (RAM) Utilization by Project';
      case 'disk':
        return 'Disk Space Utilization by Project';
    }
  };
  
  const formatYAxis = (value: number) => {
    switch (activeTab) {
      case 'cpu':
        return `${value} cores`;
      case 'ram':
      case 'disk':
        return `${value} GB`;
    }
  };

  const chartData = prepareBarchartData();
  const hasValidData = chartData.length > 0 && chartData.some(item => item.quota > 0 || item.used > 0);
  
  return (
    <Card className="animate-fade-in shadow-lg border-0 bg-white hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-t-lg">
        <div>
          <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Folder className="h-6 w-6 text-green-600" />
            </div>
            Project Resource Utilization
          </CardTitle>
          <CardDescription className="mt-2 text-base text-gray-600 font-medium">
            Real-time resource allocation and usage across projects
            {isLoading && <span className="text-blue-600 ml-2">• Updating...</span>}
          </CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            disabled={isLoading}
            className="flex items-center gap-1 hover:bg-blue-50"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleExportData} 
            disabled={isLoading || !hasValidData}
            className="flex items-center gap-1"
          >
            <FileDown className="h-4 w-4" /> Export PDF Report
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {error && (
          <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center gap-2 text-yellow-800">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span className="font-medium">Using sample data - API connection failed</span>
            </div>
          </div>
        )}

        <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as 'cpu' | 'ram' | 'disk')}>
          <TabsList className="mb-6 bg-gray-100">
            <TabsTrigger value="cpu" className="flex items-center gap-2 data-[state=active]:bg-white">
              <Cpu className="h-4 w-4" /> CPU
            </TabsTrigger>
            <TabsTrigger value="ram" className="flex items-center gap-2 data-[state=active]:bg-white">
              <MemoryStick className="h-4 w-4" /> Memory
            </TabsTrigger>
            <TabsTrigger value="disk" className="flex items-center gap-2 data-[state=active]:bg-white">
              <HardDrive className="h-4 w-4" /> Disk
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab}>
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{getResourceTitle()}</h3>
                <p className="text-sm text-gray-600">
                  Live data • Last updated: {new Date().toLocaleTimeString()}
                  {isLoading && <span className="text-blue-600 ml-2">• Refreshing...</span>}
                </p>
              </div>
              
              {isLoading ? (
                <div className="h-[400px] flex items-center justify-center bg-gray-50 rounded-lg">
                  <div className="text-center space-y-3">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
                    <p className="text-gray-600 font-medium">Loading dynamic resource data...</p>
                  </div>
                </div>
              ) : hasValidData ? (
                <div className="space-y-4">
                  {/* Quick Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
                      <div className="text-2xl font-bold text-blue-800">
                        {chartData.reduce((sum, item) => sum + item.used, 0)}
                        <span className="text-sm font-normal ml-1">
                          {activeTab === 'cpu' ? 'cores' : 'GB'}
                        </span>
                      </div>
                      <div className="text-sm text-blue-600 font-medium">Total Used</div>
                    </div>
                    <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
                      <div className="text-2xl font-bold text-green-800">
                        {chartData.reduce((sum, item) => sum + item.quota, 0)}
                        <span className="text-sm font-normal ml-1">
                          {activeTab === 'cpu' ? 'cores' : 'GB'}
                        </span>
                      </div>
                      <div className="text-sm text-green-600 font-medium">Total Quota</div>
                    </div>
                    <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
                      <div className="text-2xl font-bold text-purple-800">
                        {chartData.length}
                      </div>
                      <div className="text-sm text-purple-600 font-medium">Active Projects</div>
                    </div>
                  </div>

                  <div className="h-[400px] bg-white border rounded-lg p-4" id="project-resource-chart">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={chartData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis 
                          dataKey="name" 
                          tick={{ fontSize: 12 }}
                          tickLine={{ stroke: '#e0e0e0' }}
                        />
                        <YAxis 
                          tickFormatter={formatYAxis}
                          tick={{ fontSize: 12 }}
                          tickLine={{ stroke: '#e0e0e0' }}
                        />
                        <Tooltip 
                          formatter={(value, name) => {
                            const unit = activeTab === 'cpu' ? 'cores' : 'GB';
                            if (name === 'used') return [`${value} ${unit}`, 'Used'];
                            if (name === 'quota') return [`${value} ${unit}`, 'Quota'];
                            return [value, name];
                          }}
                          labelFormatter={(label) => {
                            const item = chartData.find(d => d.name === label);
                            return item ? item.fullName : label;
                          }}
                          contentStyle={{
                            backgroundColor: 'white',
                            border: '1px solid #e0e0e0',
                            borderRadius: '8px',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                          }}
                        />
                        <Legend />
                        <Bar 
                          dataKey="used" 
                          name="Used" 
                          fill="#3b82f6" 
                          radius={[2, 2, 0, 0]}
                        />
                        <Bar 
                          dataKey="quota" 
                          name="Quota" 
                          fill="#10b981" 
                          radius={[2, 2, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              ) : (
                <div className="h-[400px] flex items-center justify-center bg-gray-50 rounded-lg">
                  <div className="text-center text-gray-500">
                    <Folder className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-lg font-medium mb-2">No project resource data available</p>
                    <p className="text-sm">Add projects with resource allocations to see usage data</p>
                    <Button 
                      variant="outline" 
                      onClick={handleRefresh}
                      className="mt-4"
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Refresh Data
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ProjectResourceReportCard;
