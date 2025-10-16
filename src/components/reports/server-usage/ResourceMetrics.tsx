
import React from 'react';
import { HardDrive, Cpu, MemoryStick, Network, Activity, Clock } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { Asset } from '@/types/asset';

interface ServerResourceData {
  cpu: number;
  ram: number;
  disk: number;
  network: number;
  connections: number;
  uptime: string;
}

interface ResourceMetricsProps {
  resourceData: ServerResourceData;
  selectedServer: Asset;
}

const ResourceMetrics: React.FC<ResourceMetricsProps> = ({ resourceData, selectedServer }) => {
  const getUsageColor = (percentage: number) => {
    if (percentage >= 80) return 'bg-red-500';
    if (percentage >= 60) return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  const getUsageStatus = (percentage: number) => {
    if (percentage >= 80) return 'Critical';
    if (percentage >= 60) return 'Warning';
    return 'Optimal';
  };

  const metrics = [
    {
      icon: Cpu,
      label: 'CPU Usage',
      value: resourceData?.cpu || 0,
      unit: '%',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      progressColor: 'bg-blue-500',
      info: selectedServer.specs?.cpu_model || 'CPU Information Unavailable',
      subInfo: selectedServer.specs?.cpu_cores ? `${selectedServer.specs.cpu_cores} cores` : 'Core Information Unavailable'
    },
    {
      icon: MemoryStick,
      label: 'Memory Usage',
      value: resourceData?.ram || 0,
      unit: '%',
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      progressColor: 'bg-emerald-500',
      info: selectedServer.specs?.ram_total || 'RAM Capacity Unavailable',
      subInfo: selectedServer.specs?.ram_type ? selectedServer.specs.ram_type : 'RAM Type Unavailable'
    },
    {
      icon: HardDrive,
      label: 'Disk Usage',
      value: resourceData?.disk || 0,
      unit: '%',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      progressColor: 'bg-purple-500',
      info: selectedServer.specs?.disk_total || 'Disk Capacity Unavailable',
      subInfo: selectedServer.specs?.disk_type ? selectedServer.specs.disk_type : 'Disk Type Unavailable'
    },
    {
      icon: Network,
      label: 'Network Usage',
      value: resourceData?.network || 0,
      unit: '%',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      progressColor: 'bg-orange-500',
      info: selectedServer.specs?.network_throughput || 'Network Capacity Unavailable',
      subInfo: resourceData?.connections ? `${resourceData.connections} Active Connections` : 'Connection Data Unavailable'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Resource Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {metrics.map((metric, index) => {
          const IconComponent = metric.icon;
          const usageColor = getUsageColor(metric.value);
          const usageStatus = getUsageStatus(metric.value);
          
          return (
            <Card key={metric.label} className="hover:shadow-lg transition-all duration-300 border-0 bg-white shadow-sm hover:shadow-blue-100/50">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-xl ${metric.bgColor} shadow-sm`}>
                      <IconComponent className={`h-6 w-6 ${metric.color}`} />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-lg mb-1">{metric.label}</h4>
                      <p className="text-sm text-gray-600 font-medium">{metric.info}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-gray-900 mb-1">{metric.value}{metric.unit}</div>
                    <div className={`text-xs font-bold px-3 py-1.5 rounded-full ${
                      usageStatus === 'Critical' ? 'bg-red-100 text-red-700 border border-red-200' :
                      usageStatus === 'Warning' ? 'bg-amber-100 text-amber-700 border border-amber-200' :
                      'bg-emerald-100 text-emerald-700 border border-emerald-200'
                    }`}>
                      {usageStatus}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <Progress value={metric.value} className="h-4 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-700 ease-out ${usageColor}`}
                      style={{ width: `${metric.value}%` }}
                    />
                  </Progress>
                  <p className="text-sm text-gray-600 flex items-center font-medium">
                    <Activity className="h-4 w-4 mr-2 text-gray-400" />
                    {metric.subInfo}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Server Health Summary */}
      <Card className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border-blue-200 shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 rounded-xl shadow-sm">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-lg mb-1">Server Uptime</h4>
                <p className="text-sm text-gray-600 font-medium">System availability status</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-700 mb-1">{resourceData?.uptime || 'Unknown'}</div>
              <div className="text-sm text-blue-600 flex items-center justify-end font-semibold">
                <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full mr-2 animate-pulse shadow-sm"></div>
                Online
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResourceMetrics;
