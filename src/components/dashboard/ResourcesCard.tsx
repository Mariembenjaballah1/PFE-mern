
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { HardDrive, Cpu, MemoryStick, Database } from 'lucide-react';
import { Asset } from '@/types/asset';

interface ResourcesCardProps {
  assets?: Asset[];
}

const ResourcesCard: React.FC<ResourcesCardProps> = ({ assets = [] }) => {
  // Calculate dynamic resource metrics based on actual asset usage
  const calculateResourceMetrics = () => {
    // Used resources from assets
    const usedResources = assets.reduce((acc, asset) => ({
      cpu: acc.cpu + (asset.resources?.cpu || 0),
      ram: acc.ram + (asset.resources?.ram || 0),
      disk: acc.disk + (asset.resources?.disk || 0)
    }), { cpu: 0, ram: 0, disk: 0 });

    // Set reasonable maximum values for visualization
    const maxCPU = Math.max(usedResources.cpu * 1.5, 100);
    const maxRAM = Math.max(usedResources.ram * 1.5, 100);
    const maxDisk = Math.max(usedResources.disk * 1.5, 500);

    // Calculate usage percentages
    const cpuUsage = maxCPU > 0 ? (usedResources.cpu / maxCPU) * 100 : 0;
    const ramUsage = maxRAM > 0 ? (usedResources.ram / maxRAM) * 100 : 0;
    const diskUsage = maxDisk > 0 ? (usedResources.disk / maxDisk) * 100 : 0;

    // Database load based on operational assets vs total assets
    const operationalAssets = assets.filter(asset => asset.status === 'operational').length;
    const databaseLoad = assets.length > 0 ? (operationalAssets / assets.length) * 100 : 0;

    return {
      cpu: {
        usage: Math.round(cpuUsage),
        used: usedResources.cpu,
        total: maxCPU,
        detail: `${usedResources.cpu} cores in use`
      },
      ram: {
        usage: Math.round(ramUsage),
        used: usedResources.ram,
        total: maxRAM,
        detail: `${usedResources.ram}GB in use`
      },
      disk: {
        usage: Math.round(diskUsage),
        used: usedResources.disk,
        total: maxDisk,
        detail: `${usedResources.disk}GB in use`
      },
      database: {
        usage: Math.round(databaseLoad),
        used: operationalAssets,
        total: assets.length,
        detail: `${operationalAssets}/${assets.length} assets operational`
      }
    };
  };

  const metrics = calculateResourceMetrics();

  const resources = [
    {
      name: 'CPU Usage',
      value: metrics.cpu.usage,
      max: 100,
      icon: Cpu,
      color: 'bg-blue-500',
      detail: metrics.cpu.detail
    },
    {
      name: 'Memory Usage',
      value: metrics.ram.usage,
      max: 100,
      icon: MemoryStick,
      color: 'bg-green-500',
      detail: metrics.ram.detail
    },
    {
      name: 'Storage Usage',
      value: metrics.disk.usage,
      max: 100,
      icon: HardDrive,
      color: 'bg-orange-500',
      detail: metrics.disk.detail
    },
    {
      name: 'Database Load',
      value: metrics.database.usage,
      max: 100,
      icon: Database, 
      color: 'bg-purple-500',
      detail: metrics.database.detail
    }
  ];

  // Show message if no data available
  if (assets.length === 0) {
    return (
      <Card className="card-gradient h-full animate-scale-in">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Resource Utilization</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center p-8">
          <div className="text-center text-muted-foreground">
            <p className="text-sm mb-2">No resource data available</p>
            <p className="text-xs">Add assets to see utilization</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="card-gradient h-full animate-scale-in">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">
          Resource Utilization ({assets.length} Assets)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {resources.map((resource, index) => {
          const Icon = resource.icon;
          return (
            <div key={resource.name} className="space-y-2 animate-fade-in" style={{animationDelay: `${index * 100}ms`}}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`p-1.5 rounded-md ${resource.color} text-white`}>
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="font-medium text-sm">{resource.name}</span>
                </div>
                <span className="text-sm font-medium">{resource.value}%</span>
              </div>
              <div className="space-y-1">
                <Progress value={resource.value} max={resource.max} className="h-2" />
                <p className="text-xs text-muted-foreground">{resource.detail}</p>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default ResourcesCard;
