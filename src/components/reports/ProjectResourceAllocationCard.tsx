
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Cpu, MemoryStick, TrendingUp } from 'lucide-react';
import { Asset } from '@/types/asset';

interface ProjectResourceAllocationCardProps {
  assets: Asset[];
}

const ProjectResourceAllocationCard: React.FC<ProjectResourceAllocationCardProps> = ({ assets }) => {
  const [activeTab, setActiveTab] = useState<'cpu' | 'ram'>('cpu');

  // Calculate CPU and RAM allocation by project
  const calculateResourcesByProject = () => {
    const projectResources: Record<string, { cpu: number; ram: number; assetCount: number }> = {};
    
    assets.forEach((asset) => {
      // Get project name from various possible fields
      let projectName = 'Unassigned';
      
      if (asset.projectName && typeof asset.projectName === 'string') {
        projectName = asset.projectName;
      } else if (asset.project) {
        if (typeof asset.project === 'string') {
          projectName = asset.project;
        } else if (typeof asset.project === 'object' && asset.project !== null) {
          projectName = (asset.project as any).name || 'Unknown Project';
        }
      }

      if (!projectResources[projectName]) {
        projectResources[projectName] = { cpu: 0, ram: 0, assetCount: 0 };
      }

      // Get resource allocation from asset.resources or use defaults based on category
      let cpuAllocation = 2; // Default 2 CPU cores
      let ramAllocation = 4; // Default 4GB RAM

      if (asset.resources) {
        cpuAllocation = asset.resources.cpu || cpuAllocation;
        ramAllocation = asset.resources.ram || ramAllocation;
      } else {
        // Set defaults based on asset category
        const category = (asset.category || '').toLowerCase();
        if (category.includes('server')) {
          cpuAllocation = 8;
          ramAllocation = 16;
        } else if (category.includes('laptop') || category.includes('workstation')) {
          cpuAllocation = 4;
          ramAllocation = 8;
        }
      }

      projectResources[projectName].cpu += cpuAllocation;
      projectResources[projectName].ram += ramAllocation;
      projectResources[projectName].assetCount += 1;
    });

    return projectResources;
  };

  const projectResources = calculateResourcesByProject();
  
  // Convert to chart data
  const chartData = Object.entries(projectResources).map(([projectName, resources]) => ({
    name: projectName.length > 15 ? `${projectName.substring(0, 15)}...` : projectName,
    fullName: projectName,
    cpu: resources.cpu,
    ram: resources.ram,
    assets: resources.assetCount
  }));

  // Calculate totals
  const totalCPU = chartData.reduce((sum, item) => sum + item.cpu, 0);
  const totalRAM = chartData.reduce((sum, item) => sum + item.ram, 0);
  const totalProjects = chartData.length;

  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader className="bg-gradient-to-r from-purple-50 to-violet-50 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <TrendingUp className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <CardTitle className="text-xl text-gray-900">Resource Allocation by Project</CardTitle>
              <p className="text-sm text-gray-600 mt-1">CPU and RAM distribution across projects</p>
            </div>
          </div>
          <Badge variant="secondary" className="bg-purple-100 text-purple-800">
            {totalProjects} Projects
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="p-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-4 rounded-lg border">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded">
                <Cpu className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-blue-600">Total CPU Cores</p>
                <p className="text-2xl font-bold text-blue-700">{totalCPU}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-lg border">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded">
                <MemoryStick className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-green-600">Total RAM</p>
                <p className="text-2xl font-bold text-green-700">{totalRAM} GB</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-50 to-violet-50 p-4 rounded-lg border">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded">
                <TrendingUp className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-purple-600">Avg per Project</p>
                <p className="text-2xl font-bold text-purple-700">
                  {totalProjects > 0 ? Math.round(totalCPU / totalProjects) : 0} cores
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Resource Charts */}
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'cpu' | 'ram')}>
          <TabsList className="mb-4">
            <TabsTrigger value="cpu" className="flex items-center gap-2">
              <Cpu className="h-4 w-4" />
              CPU Allocation
            </TabsTrigger>
            <TabsTrigger value="ram" className="flex items-center gap-2">
              <MemoryStick className="h-4 w-4" />
              RAM Allocation
            </TabsTrigger>
          </TabsList>

          <TabsContent value="cpu">
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 12 }}
                    interval={0}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis 
                    tickFormatter={(value) => `${value} cores`}
                  />
                  <Tooltip 
                    formatter={(value) => [`${value} cores`, 'CPU Allocation']}
                    labelFormatter={(label) => {
                      const item = chartData.find(d => d.name === label);
                      return item ? item.fullName : label;
                    }}
                  />
                  <Legend />
                  <Bar 
                    dataKey="cpu" 
                    fill="#3b82f6" 
                    name="CPU Cores"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="ram">
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 12 }}
                    interval={0}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis 
                    tickFormatter={(value) => `${value} GB`}
                  />
                  <Tooltip 
                    formatter={(value) => [`${value} GB`, 'RAM Allocation']}
                    labelFormatter={(label) => {
                      const item = chartData.find(d => d.name === label);
                      return item ? item.fullName : label;
                    }}
                  />
                  <Legend />
                  <Bar 
                    dataKey="ram" 
                    fill="#10b981" 
                    name="RAM (GB)"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>

        {/* Project Details */}
        {chartData.length > 0 && (
          <div className="mt-6">
            <h4 className="font-semibold text-gray-900 mb-4">Project Resource Summary</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {chartData.slice(0, 6).map((project) => (
                <div key={project.fullName} className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-lg border">
                  <h5 className="font-semibold text-gray-900 mb-2" title={project.fullName}>
                    {project.name}
                  </h5>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <Cpu className="h-3 w-3 text-blue-600" />
                        CPU:
                      </span>
                      <span className="font-medium text-blue-700">{project.cpu} cores</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <MemoryStick className="h-3 w-3 text-green-600" />
                        RAM:
                      </span>
                      <span className="font-medium text-green-700">{project.ram} GB</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Assets:</span>
                      <span className="font-medium text-gray-700">{project.assets}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProjectResourceAllocationCard;
