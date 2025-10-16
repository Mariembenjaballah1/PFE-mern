import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Download, Cpu, Server, HardDrive, AppWindow, Projector, Database } from 'lucide-react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { exportToCSV } from '@/services/reportsService';

// Mock data for resources by project
const projectResourceData = [
  { name: 'CRM System', cpu: 45, memory: 58, disk: 72, servers: 3 },
  { name: 'ERP Platform', cpu: 65, memory: 72, disk: 50, servers: 5 },
  { name: 'Analytics Dashboard', cpu: 32, memory: 45, disk: 38, servers: 2 },
  { name: 'Customer Portal', cpu: 55, memory: 62, disk: 48, servers: 4 },
  { name: 'Inventory Management', cpu: 28, memory: 35, disk: 62, servers: 1 },
];

// Mock data for resources by application
const appResourceData = [
  { name: 'Web Server', cpu: 72, memory: 65, disk: 45, project: 'CRM System' },
  { name: 'Database', cpu: 58, memory: 75, disk: 82, project: 'ERP Platform' },
  { name: 'API Gateway', cpu: 42, memory: 38, disk: 25, project: 'Analytics Dashboard' },
  { name: 'Authentication Service', cpu: 35, memory: 42, disk: 18, project: 'Customer Portal' },
  { name: 'Cache Service', cpu: 62, memory: 55, disk: 30, project: 'Inventory Management' },
  { name: 'File Storage', cpu: 28, memory: 32, disk: 78, project: 'CRM System' },
];

// Mock data for server details
const serverDetailsData = [
  { 
    id: 'SRV001',
    name: 'Primary Web Server',
    cpu: { cores: 16, usage: 45, model: 'Intel Xeon E5-2690 v4' },
    memory: { total: '64GB', usage: 42, type: 'DDR4 ECC' },
    disk: { total: '2TB', usage: 58, type: 'SSD RAID' },
    network: { throughput: '2.4Gbps', connections: 145 },
    applications: ['Web Server', 'API Gateway'],
    project: 'CRM System',
    status: 'operational',
    location: 'Main Data Center'
  },
  { 
    id: 'SRV002',
    name: 'Database Server',
    cpu: { cores: 32, usage: 62, model: 'AMD EPYC 7543' },
    memory: { total: '128GB', usage: 75, type: 'DDR4 ECC' },
    disk: { total: '8TB', usage: 42, type: 'NVMe RAID' },
    network: { throughput: '1.8Gbps', connections: 78 },
    applications: ['Database', 'Cache Service'],
    project: 'ERP Platform',
    status: 'operational',
    location: 'Main Data Center'
  },
  { 
    id: 'SRV003',
    name: 'Analytics Server',
    cpu: { cores: 24, usage: 78, model: 'Intel Xeon Gold 6248R' },
    memory: { total: '96GB', usage: 82, type: 'DDR4 ECC' },
    disk: { total: '4TB', usage: 65, type: 'SSD RAID' },
    network: { throughput: '1.5Gbps', connections: 42 },
    applications: ['Analytics Engine', 'Data Processing'],
    project: 'Analytics Dashboard',
    status: 'maintenance',
    location: 'Secondary Data Center'
  },
];

// Colors for charts
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

interface DetailedResourceChartProps {
  defaultView?: 'project' | 'application' | 'server';
}

const DetailedResourceChart: React.FC<DetailedResourceChartProps> = ({ defaultView = 'project' }) => {
  const [chartView, setChartView] = useState<'project' | 'application' | 'server'>(defaultView);
  const [chartType, setChartType] = useState<'bar' | 'line' | 'pie'>('bar');
  const [selectedResource, setSelectedResource] = useState<'cpu' | 'memory' | 'disk'>('cpu');
  const [selectedServer, setSelectedServer] = useState<string>(serverDetailsData[0].id);

  const handleExportData = () => {
    let exportData;
    
    if (chartView === 'project') {
      exportData = projectResourceData.map(item => ({
        Project: item.name,
        'CPU Usage (%)': item.cpu,
        'Memory Usage (%)': item.memory,
        'Disk Usage (%)': item.disk,
        'Number of Servers': item.servers
      }));
    } else if (chartView === 'application') {
      exportData = appResourceData.map(item => ({
        Application: item.name,
        'CPU Usage (%)': item.cpu,
        'Memory Usage (%)': item.memory,
        'Disk Usage (%)': item.disk,
        'Related Project': item.project
      }));
    } else {
      const server = serverDetailsData.find(s => s.id === selectedServer) || serverDetailsData[0];
      exportData = [
        {
          'Server ID': server.id,
          'Server Name': server.name,
          'CPU Model': server.cpu.model,
          'CPU Cores': server.cpu.cores,
          'CPU Usage (%)': server.cpu.usage,
          'Memory Total': server.memory.total,
          'Memory Type': server.memory.type,
          'Memory Usage (%)': server.memory.usage,
          'Disk Total': server.disk.total,
          'Disk Type': server.disk.type,
          'Disk Usage (%)': server.disk.usage,
          'Network Throughput': server.network.throughput,
          'Network Connections': server.network.connections,
          'Applications': server.applications.join(', '),
          'Project': server.project,
          'Status': server.status,
          'Location': server.location
        }
      ];
    }
    
    exportToCSV(exportData, `resource_usage_${chartView}_${new Date().toISOString().split('T')[0]}`);
  };

  const renderProjectChart = () => {
    if (chartType === 'bar') {
      return (
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={projectResourceData}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis dataKey="name" />
            <YAxis tickFormatter={(value) => `${value}%`} />
            <Tooltip
              formatter={(value) => [`${value}%`, '']}
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '8px',
                border: 'none',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
              }}
            />
            <Legend />
            <Bar dataKey={selectedResource} fill="#3b82f6" name={`${selectedResource.toUpperCase()} Usage`} />
          </BarChart>
        </ResponsiveContainer>
      );
    } else if (chartType === 'line') {
      return (
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={projectResourceData}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis dataKey="name" />
            <YAxis tickFormatter={(value) => `${value}%`} />
            <Tooltip
              formatter={(value) => [`${value}%`, '']}
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '8px',
                border: 'none',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
              }}
            />
            <Legend />
            <Line type="monotone" dataKey={selectedResource} stroke="#3b82f6" name={`${selectedResource.toUpperCase()} Usage`} />
          </LineChart>
        </ResponsiveContainer>
      );
    } else {
      // Pie chart
      return (
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              data={projectResourceData}
              cx="50%"
              cy="50%"
              labelLine={true}
              label={({ name, value }) => `${name}: ${value}%`}
              outerRadius={150}
              fill="#8884d8"
              dataKey={selectedResource}
              nameKey="name"
            >
              {projectResourceData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => [`${value}%`, selectedResource.toUpperCase()]}
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '8px',
                border: 'none',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
              }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      );
    }
  };

  const renderApplicationChart = () => {
    if (chartType === 'bar') {
      return (
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={appResourceData}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis dataKey="name" />
            <YAxis tickFormatter={(value) => `${value}%`} />
            <Tooltip
              formatter={(value, name, props) => [
                `${value}%`, 
                `${name.toString().toUpperCase()}`,
                `Project: ${props.payload.project}`
              ]}
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '8px',
                border: 'none',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
              }}
            />
            <Legend />
            <Bar dataKey={selectedResource} fill="#10b981" name={`${selectedResource.toUpperCase()} Usage`} />
          </BarChart>
        </ResponsiveContainer>
      );
    } else if (chartType === 'line') {
      return (
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={appResourceData}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis dataKey="name" />
            <YAxis tickFormatter={(value) => `${value}%`} />
            <Tooltip
              formatter={(value, name, props) => [
                `${value}%`, 
                `${name.toString().toUpperCase()}`,
                `Project: ${props.payload.project}`
              ]}
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '8px',
                border: 'none',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
              }}
            />
            <Legend />
            <Line type="monotone" dataKey={selectedResource} stroke="#10b981" name={`${selectedResource.toUpperCase()} Usage`} />
          </LineChart>
        </ResponsiveContainer>
      );
    } else {
      // Pie chart
      return (
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              data={appResourceData}
              cx="50%"
              cy="50%"
              labelLine={true}
              label={({ name, value }) => `${name}: ${value}%`}
              outerRadius={150}
              fill="#8884d8"
              dataKey={selectedResource}
              nameKey="name"
            >
              {appResourceData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value, name, props) => [
                `${value}%`, 
                selectedResource.toUpperCase(),
                `Project: ${props.payload.project}`
              ]}
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '8px',
                border: 'none',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
              }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      );
    }
  };

  const renderServerDetailsChart = () => {
    const selectedServerData = serverDetailsData.find(server => server.id === selectedServer) || serverDetailsData[0];
    
    const resourceData = [
      { name: 'CPU', value: selectedServerData.cpu.usage, color: '#3b82f6' },
      { name: 'Memory', value: selectedServerData.memory.usage, color: '#10b981' },
      { name: 'Disk', value: selectedServerData.disk.usage, color: '#8b5cf6' },
    ];

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Select value={selectedServer} onValueChange={setSelectedServer}>
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Select a server" />
            </SelectTrigger>
            <SelectContent>
              {serverDetailsData.map(server => (
                <SelectItem key={server.id} value={server.id}>
                  {server.name} ({server.id})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-medium">
            Project: {selectedServerData.project}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-md">
            <div className="flex items-center gap-2 mb-2">
              <Cpu className="h-5 w-5 text-blue-500" />
              <span className="font-medium">CPU</span>
            </div>
            <div className="text-sm">
              <div className="flex justify-between mb-1">
                <span>Model:</span>
                <span className="font-medium">{selectedServerData.cpu.model}</span>
              </div>
              <div className="flex justify-between mb-1">
                <span>Cores:</span>
                <span className="font-medium">{selectedServerData.cpu.cores}</span>
              </div>
              <div className="flex justify-between">
                <span>Usage:</span>
                <span className="font-medium">{selectedServerData.cpu.usage}%</span>
              </div>
            </div>
          </div>
          
          <div className="bg-green-50 p-4 rounded-md">
            <div className="flex items-center gap-2 mb-2">
              <Server className="h-5 w-5 text-green-500" />
              <span className="font-medium">Memory</span>
            </div>
            <div className="text-sm">
              <div className="flex justify-between mb-1">
                <span>Total:</span>
                <span className="font-medium">{selectedServerData.memory.total}</span>
              </div>
              <div className="flex justify-between mb-1">
                <span>Type:</span>
                <span className="font-medium">{selectedServerData.memory.type}</span>
              </div>
              <div className="flex justify-between">
                <span>Usage:</span>
                <span className="font-medium">{selectedServerData.memory.usage}%</span>
              </div>
            </div>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-md">
            <div className="flex items-center gap-2 mb-2">
              <HardDrive className="h-5 w-5 text-purple-500" />
              <span className="font-medium">Disk</span>
            </div>
            <div className="text-sm">
              <div className="flex justify-between mb-1">
                <span>Total:</span>
                <span className="font-medium">{selectedServerData.disk.total}</span>
              </div>
              <div className="flex justify-between mb-1">
                <span>Type:</span>
                <span className="font-medium">{selectedServerData.disk.type}</span>
              </div>
              <div className="flex justify-between">
                <span>Usage:</span>
                <span className="font-medium">{selectedServerData.disk.usage}%</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-md">
          <div className="font-medium mb-2">Network</div>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-sm">
              <div className="flex justify-between">
                <span>Throughput:</span>
                <span className="font-medium">{selectedServerData.network.throughput}</span>
              </div>
            </div>
            <div className="text-sm">
              <div className="flex justify-between">
                <span>Active Connections:</span>
                <span className="font-medium">{selectedServerData.network.connections}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-md">
          <div className="font-medium mb-2">Applications</div>
          <div className="flex flex-wrap gap-2">
            {selectedServerData.applications.map((app, index) => (
              <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                {app}
              </span>
            ))}
          </div>
        </div>
        
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={resourceData}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis dataKey="name" />
            <YAxis tickFormatter={(value) => `${value}%`} domain={[0, 100]} />
            <Tooltip
              formatter={(value) => [`${value}%`, 'Usage']}
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '8px',
                border: 'none',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
              }}
            />
            <Legend />
            <Bar dataKey="value" name="Usage">
              {resourceData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  };

  return (
    <Card className="animate-fade-in">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Resource Usage by {chartView === 'project' ? 'Project' : chartView === 'application' ? 'Application' : 'Server'}</CardTitle>
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={handleExportData}>
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4">
          <div className="flex flex-wrap gap-4 justify-between">
            <Tabs value={chartView} onValueChange={(value) => setChartView(value as any)}>
              <TabsList>
                <TabsTrigger value="project">
                  <Projector className="h-4 w-4 mr-2" />
                  By Project
                </TabsTrigger>
                <TabsTrigger value="application">
                  <AppWindow className="h-4 w-4 mr-2" />
                  By Application
                </TabsTrigger>
                <TabsTrigger value="server">
                  <Server className="h-4 w-4 mr-2" />
                  Server Details
                </TabsTrigger>
              </TabsList>
            </Tabs>
            
            <div className="flex gap-4">
              <Select value={selectedResource} onValueChange={(value) => setSelectedResource(value as any)}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Resource" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cpu">
                    <div className="flex items-center">
                      <Cpu className="h-4 w-4 mr-2" />
                      CPU
                    </div>
                  </SelectItem>
                  <SelectItem value="memory">
                    <div className="flex items-center">
                      <Server className="h-4 w-4 mr-2" />
                      Memory
                    </div>
                  </SelectItem>
                  <SelectItem value="disk">
                    <div className="flex items-center">
                      <HardDrive className="h-4 w-4 mr-2" />
                      Disk
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={chartType} onValueChange={(value) => setChartType(value as any)}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Chart Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bar">Bar Chart</SelectItem>
                  <SelectItem value="line">Line Chart</SelectItem>
                  <SelectItem value="pie">Pie Chart</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="pt-4">
            {chartView === 'project' && renderProjectChart()}
            {chartView === 'application' && renderApplicationChart()}
            {chartView === 'server' && renderServerDetailsChart()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DetailedResourceChart;
