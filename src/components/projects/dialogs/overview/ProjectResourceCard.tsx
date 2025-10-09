
import React from 'react';
import { Project, Asset } from '@/types/asset';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Cpu, MemoryStick, HardDrive, Users, Server } from 'lucide-react';

interface ProjectResourceCardProps {
  project: Project;
  assets: Asset[];
}

export const ProjectResourceCard: React.FC<ProjectResourceCardProps> = ({ 
  project, 
  assets 
}) => {
  // Calculate actual resource usage from assets
  const actualResources = assets.reduce((acc, asset) => {
    const cpu = asset.resources?.cpu || 0;
    const ram = asset.resources?.ram || 0;
    const disk = asset.resources?.disk || 0;
    
    return {
      cpu: acc.cpu + cpu,
      ram: acc.ram + ram,
      disk: acc.disk + disk
    };
  }, { cpu: 0, ram: 0, disk: 0 });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Server className="h-5 w-5" />
          Resource Usage
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Resource Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Cpu className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium">CPU Cores</span>
            </div>
            <div className="text-2xl font-bold">{actualResources.cpu}</div>
            <div className="text-sm text-muted-foreground">
              cores in use
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <MemoryStick className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium">RAM (GB)</span>
            </div>
            <div className="text-2xl font-bold">{actualResources.ram}</div>
            <div className="text-sm text-muted-foreground">
              GB in use
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <HardDrive className="h-4 w-4 text-orange-600" />
              <span className="text-sm font-medium">Disk (GB)</span>
            </div>
            <div className="text-2xl font-bold">{actualResources.disk}</div>
            <div className="text-sm text-muted-foreground">
              GB in use
            </div>
          </div>
        </div>

        {/* Asset Count */}
        <div className="pt-4 border-t">
          <div className="flex items-center gap-2 mb-2">
            <Users className="h-4 w-4 text-purple-600" />
            <span className="text-sm font-medium">Assets Assigned</span>
          </div>
          <div className="text-2xl font-bold">{assets.length}</div>
          <div className="text-sm text-muted-foreground">
            {assets.filter(a => a.status === 'operational').length} operational
          </div>
        </div>

        {/* Resource Summary */}
        <div className="pt-4 border-t">
          <div className="text-sm font-medium mb-2">Resource Summary</div>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="text-center p-2 bg-blue-50 rounded">
              <div className="font-semibold">CPU</div>
              <div className="text-blue-600">{actualResources.cpu} cores</div>
            </div>
            <div className="text-center p-2 bg-green-50 rounded">
              <div className="font-semibold">RAM</div>
              <div className="text-green-600">{actualResources.ram} GB</div>
            </div>
            <div className="text-center p-2 bg-orange-50 rounded">
              <div className="font-semibold">Disk</div>
              <div className="text-orange-600">{actualResources.disk} GB</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
