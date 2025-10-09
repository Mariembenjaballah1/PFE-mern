
import React from 'react';
import { Cpu, MemoryStick } from 'lucide-react';
import { AssetResources } from '@/types/asset';

interface AssetResourcesDisplayProps {
  resources?: AssetResources;
}

export const AssetResourcesDisplay: React.FC<AssetResourcesDisplayProps> = ({ resources }) => {
  if (!resources) return <span>No resources</span>;
  
  return (
    <div className="flex flex-col gap-1 text-xs">
      <div className="flex items-center gap-1">
        <Cpu className="h-3 w-3" /> {resources.cpu || 0} cores
      </div>
      <div className="flex items-center gap-1">
        <MemoryStick className="h-3 w-3" /> {resources.ram || 0} GB
      </div>
    </div>
  );
};
