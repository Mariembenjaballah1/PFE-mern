
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { Cpu, MemoryStick, HardDrive, Network, RefreshCw, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Asset } from '@/types/asset';

interface ServerChartsTabProps {
  asset: Asset;
}

interface ResourceData {
  time: string;
  cpu: number;
  ram: number;
  disk: number;
  network: number;
}

interface QuotaData {
  resource: string;
  used: number;
  allocated: number;
  unit: string;
  color: string;
}

const ServerChartsTab: React.FC<ServerChartsTabProps> = ({ asset }) => {
  const [resourceHistory, setResourceHistory] = useState<ResourceData[]>([]);
  const [currentMetrics, setCurrentMetrics] = useState({
    cpu: 45,
    ram: 62,
    disk: 78,
    network: 23
  });
  const [isLive, setIsLive] = useState(true);

  // Generate real-time data
  useEffect(() => {
    const generateDataPoint = (): ResourceData => {
      const now = new Date();
      return {
        time: now.toLocaleTimeString(),
        cpu: Math.max(0, Math.min(100, currentMetrics.cpu + (Math.random() - 0.5) * 10)),
        ram: Math.max(0, Math.min(100, currentMetrics.ram + (Math.random() - 0.5) * 8)),
        disk: Math.max(0, Math.min(100, currentMetrics.disk + (Math.random() - 0.5) * 3)),
        network: Math.max(0, Math.min(100, currentMetrics.network + (Math.random() - 0.5) * 15))
      };
    };

    // Initialize with some historical data
    const initData = () => {
      const data: ResourceData[] = [];
      for (let i = 29; i >= 0; i--) {
        const time = new Date(Date.now() - i * 2000);
        data.push({
          time: time.toLocaleTimeString(),
          cpu: 20 + Math.random() * 60,
          ram: 30 + Math.random() * 50,
          disk: 50 + Math.random() * 40,
          network: 10 + Math.random() * 40
        });
      }
      setResourceHistory(data);
    };

    initData();

    const interval = setInterval(() => {
      if (isLive) {
        const newPoint = generateDataPoint();
        setCurrentMetrics({
          cpu: newPoint.cpu,
          ram: newPoint.ram,
          disk: newPoint.disk,
          network: newPoint.network
        });
        
        setResourceHistory(prev => {
          const newData = [...prev.slice(1), newPoint];
          return newData;
        });
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [isLive, currentMetrics]);

  // Quota data based on server specs
  const quotaData: QuotaData[] = [
    {
      resource: 'CPU Cores',
      used: asset.specs?.cpu_cores ? Math.floor((currentMetrics.cpu / 100) * asset.specs.cpu_cores) : Math.floor((currentMetrics.cpu / 100) * 8),
      allocated: asset.specs?.cpu_cores || 8,
      unit: 'cores',
      color: '#3b82f6'
    },
    {
      resource: 'Memory',
      used: asset.specs?.ram_total ? Math.floor((currentMetrics.ram / 100) * parseInt(asset.specs.ram_total)) : Math.floor((currentMetrics.ram / 100) * 64),
      allocated: asset.specs?.ram_total ? parseInt(asset.specs.ram_total) : 64,
      unit: 'GB',
      color: '#10b981'
    },
    {
      resource: 'Storage',
      used: asset.specs?.disk_total ? Math.floor((currentMetrics.disk / 100) * parseInt(asset.specs.disk_total)) : Math.floor((currentMetrics.disk / 100) * 2048),
      allocated: asset.specs?.disk_total ? parseInt(asset.specs.disk_total) : 2048,
      unit: 'GB',
      color: '#8b5cf6'
    },
    {
      resource: 'Network',
      used: Math.floor((currentMetrics.network / 100) * 1000),
      allocated: 1000,
      unit: 'Mbps',
      color: '#f59e0b'
    }
  ];

  const pieData = [
    { name: 'CPU', value: currentMetrics.cpu, color: '#3b82f6' },
    { name: 'RAM', value: currentMetrics.ram, color: '#10b981' },
    { name: 'Disk', value: currentMetrics.disk, color: '#8b5cf6' },
    { name: 'Network', value: currentMetrics.network, color: '#f59e0b' }
  ];

  const toggleLiveData = () => {
    setIsLive(!isLive);
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Real-time Performance</h3>
        <div className="flex items-center gap-2">
          <Badge variant={isLive ? "default" : "secondary"} className="flex items-center gap-1">
            <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
            {isLive ? 'Live' : 'Paused'}
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={toggleLiveData}
            className="flex items-center gap-1"
          >
            <RefreshCw className={`h-4 w-4 ${isLive ? 'animate-spin' : ''}`} />
            {isLive ? 'Pause' : 'Resume'}
          </Button>
        </div>
      </div>

      {/* Resource Timeline Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cpu className="h-5 w-5" />
            Resource Usage Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={resourceHistory}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis domain={[0, 100]} />
              <Tooltip 
                formatter={(value: number, name: string) => [`${value.toFixed(1)}%`, name.toUpperCase()]}
              />
              <Line type="monotone" dataKey="cpu" stroke="#3b82f6" strokeWidth={2} name="CPU" />
              <Line type="monotone" dataKey="ram" stroke="#10b981" strokeWidth={2} name="RAM" />
              <Line type="monotone" dataKey="disk" stroke="#8b5cf6" strokeWidth={2} name="Disk" />
              <Line type="monotone" dataKey="network" stroke="#f59e0b" strokeWidth={2} name="Network" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Current Usage Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Current Resource Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => `${value.toFixed(1)}%`} />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {pieData.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm">{item.name}: {item.value.toFixed(1)}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Resource Quotas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Resource Quotas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {quotaData.map((quota, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{quota.resource}</span>
                  <span className="text-sm text-muted-foreground">
                    {quota.used} / {quota.allocated} {quota.unit}
                  </span>
                </div>
                <div className="space-y-1">
                  <Progress 
                    value={(quota.used / quota.allocated) * 100} 
                    className="h-2"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{((quota.used / quota.allocated) * 100).toFixed(1)}% used</span>
                    <span className={
                      (quota.used / quota.allocated) > 0.8 
                        ? 'text-red-500' 
                        : (quota.used / quota.allocated) > 0.6 
                          ? 'text-yellow-500' 
                          : 'text-green-500'
                    }>
                      {quota.allocated - quota.used} {quota.unit} available
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Resource Bar Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Resource Allocation Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={quotaData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="resource" />
              <YAxis />
              <Tooltip 
                formatter={(value: number, name: string) => [
                  `${value} ${quotaData.find(q => name.includes(q.resource))?.unit || ''}`, 
                  name
                ]}
              />
              <Bar dataKey="used" fill="#3b82f6" name="Used" />
              <Bar dataKey="allocated" fill="#e5e7eb" name="Allocated" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default ServerChartsTab;
