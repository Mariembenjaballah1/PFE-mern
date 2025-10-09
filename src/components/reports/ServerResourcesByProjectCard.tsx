
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { fetchAssetsByCategory } from '@/services/assetApi';
import { fetchProjects } from '@/services/projectApi';
import { Server, FileDown, Filter, Cpu, MemoryStick, HardDrive } from 'lucide-react';
import { Asset, Project } from '@/types/asset';
import { exportToCSV } from '@/services/reportsService';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

type ResourceType = 'cpu' | 'ram' | 'disk';

const ServerResourcesByProjectCard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ResourceType>('cpu');
  const [viewMode, setViewMode] = useState<'chart' | 'table'>('chart');
  const { toast } = useToast();
  
  const { data: serverAssets = [], isLoading: serversLoading } = useQuery({
    queryKey: ['assets', 'servers'],
    queryFn: () => fetchAssetsByCategory('Servers'),
  });
  
  const { data: projects = [], isLoading: projectsLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: fetchProjects,
  });
  
  const isLoading = serversLoading || projectsLoading;
  
  // Helper function to get project ID as string
  const getProjectId = (project: string | { _id: string; name: string } | null): string => {
    if (!project) return 'unassigned';
    if (typeof project === 'string') return project;
    return project._id;
  };
  
  // Group server assets by project
  const serversByProject = React.useMemo(() => {
    const grouped: Record<string, Asset[]> = {};
    
    // Initialize with all projects (even those without servers)
    projects.forEach(project => {
      const projectId = project.id || project._id;
      if (projectId) {
        grouped[projectId] = [];
      }
    });
    
    // Add an "Unassigned" category
    grouped['unassigned'] = [];
    
    // Group servers by project
    serverAssets.forEach(server => {
      const projectId = getProjectId(server.project);
      if (grouped[projectId]) {
        grouped[projectId].push(server);
      } else {
        grouped['unassigned'].push(server);
      }
    });
    
    return grouped;
  }, [serverAssets, projects]);
  
  // Calculate resource usage by project
  const resourceUsageByProject = React.useMemo(() => {
    return Object.entries(serversByProject).map(([projectId, servers]) => {
      // Find project name
      const project = projects.find(p => (p.id || p._id) === projectId);
      const projectName = project ? project.name : (projectId === 'unassigned' ? 'Unassigned' : 'Unknown');
      
      // Calculate total resources
      const totalResources = servers.reduce((total, server) => {
        if (server.resources) {
          total.cpu += server.resources.cpu || 0;
          total.ram += server.resources.ram || 0;
          total.disk += server.resources.disk || 0;
        }
        return total;
      }, { cpu: 0, ram: 0, disk: 0 });
      
      return {
        projectId,
        projectName,
        serverCount: servers.length,
        resources: totalResources,
        servers
      };
    }).filter(item => item.serverCount > 0 || item.projectName !== 'Unassigned');
  }, [serversByProject, projects]);
  
  const handleExportData = () => {
    try {
      const exportData = resourceUsageByProject.flatMap(project => 
        project.servers.map(server => ({
          'Project': project.projectName,
          'Server Name': server.name,
          'Location': server.location,
          'Status': server.status,
          'CPU (cores)': server.resources?.cpu || 0,
          'RAM (GB)': server.resources?.ram || 0,
          'Disk (GB)': server.resources?.disk || 0,
          'Assigned To': server.assignedTo
        }))
      );
      
      // Export as PDF
      exportToCSV(exportData, 'server_resources_by_project', 'pdf', 'server-resources-chart');
      
      toast({
        title: "Success",
        description: "Server resources report exported successfully."
      });
    } catch (error) {
      console.error('Error exporting server resources report:', error);
      toast({
        title: "Error",
        description: "Failed to export server resources report.",
        variant: "destructive"
      });
    }
  };
  
  const getChartData = () => {
    return resourceUsageByProject.map(project => ({
      name: project.projectName,
      [activeTab]: project.resources[activeTab]
    }));
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
  
  const getResourceTitle = () => {
    switch (activeTab) {
      case 'cpu':
        return 'CPU Usage by Project';
      case 'ram':
        return 'Memory (RAM) Usage by Project';
      case 'disk':
        return 'Disk Space Usage by Project';
    }
  };
  
  return (
    <Card className="animate-fade-in">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Server className="h-5 w-5" />
          Server Resources by Project
        </CardTitle>
        <div className="flex items-center gap-2">
          <Tabs value={viewMode} onValueChange={(val) => setViewMode(val as 'chart' | 'table')}>
            <TabsList>
              <TabsTrigger value="chart">Chart</TabsTrigger>
              <TabsTrigger value="table">Table</TabsTrigger>
            </TabsList>
          </Tabs>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleExportData}
            disabled={isLoading || resourceUsageByProject.length === 0}
            className="flex items-center gap-1"
          >
            <FileDown className="h-4 w-4" /> Export
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-[300px] w-full" />
          </div>
        ) : resourceUsageByProject.length > 0 ? (
          <>
            {viewMode === 'chart' ? (
              <div className="space-y-4">
                <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as ResourceType)}>
                  <TabsList className="mb-4">
                    <TabsTrigger value="cpu" className="flex items-center gap-1">
                      <Cpu className="h-4 w-4" /> CPU
                    </TabsTrigger>
                    <TabsTrigger value="ram" className="flex items-center gap-1">
                      <MemoryStick className="h-4 w-4" /> Memory
                    </TabsTrigger>
                    <TabsTrigger value="disk" className="flex items-center gap-1">
                      <HardDrive className="h-4 w-4" /> Disk
                    </TabsTrigger>
                  </TabsList>
                
                  <div className="text-sm font-medium text-center mb-4">
                    {getResourceTitle()}
                  </div>
                  
                  <div className="h-[300px]" id="server-resources-chart">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={getChartData()}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis tickFormatter={formatYAxis} />
                        <Tooltip 
                          formatter={(value) => [`${value} ${activeTab === 'cpu' ? 'cores' : 'GB'}`, activeTab.toUpperCase()]}
                        />
                        <Legend />
                        <Bar 
                          dataKey={activeTab} 
                          fill="#10b981" 
                          name={activeTab === 'cpu' ? 'CPU (cores)' : activeTab === 'ram' ? 'RAM (GB)' : 'Disk (GB)'} 
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </Tabs>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Project</TableHead>
                      <TableHead>Server Name</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">CPU (cores)</TableHead>
                      <TableHead className="text-right">RAM (GB)</TableHead>
                      <TableHead className="text-right">Disk (GB)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {resourceUsageByProject.map(project => (
                      <React.Fragment key={project.projectId}>
                        {project.servers.map((server, idx) => (
                          <TableRow key={server.id} className={idx === 0 ? "border-t-2 border-t-primary/20" : ""}>
                            {idx === 0 && (
                              <TableCell rowSpan={project.servers.length} className="align-top font-medium">
                                <div className="font-bold">{project.projectName}</div>
                                <div className="text-xs text-muted-foreground mt-1">
                                  {project.serverCount} server{project.serverCount !== 1 ? 's' : ''}
                                </div>
                              </TableCell>
                            )}
                            <TableCell>{server.name}</TableCell>
                            <TableCell>
                              <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold
                                ${server.status === 'operational' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                                  server.status === 'maintenance' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' :
                                    'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'}`}>
                                {server.status}
                              </div>
                            </TableCell>
                            <TableCell className="text-right">{server.resources?.cpu || 0}</TableCell>
                            <TableCell className="text-right">{server.resources?.ram || 0}</TableCell>
                            <TableCell className="text-right">{server.resources?.disk || 0}</TableCell>
                          </TableRow>
                        ))}
                      </React.Fragment>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </>
        ) : (
          <div className="h-[300px] flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <p>No server resources data available</p>
              <p className="text-sm mt-2">Add servers with resource allocations to see data here</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ServerResourcesByProjectCard;
