
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Cpu, MemoryStick, HardDrive } from 'lucide-react';
import { ResourceType } from '../utils/resourceChartUtils';

interface ResourceTypeTabsProps {
  activeTab: ResourceType;
  onTabChange: (tab: ResourceType) => void;
}

const ResourceTypeTabs: React.FC<ResourceTypeTabsProps> = ({ activeTab, onTabChange }) => {
  return (
    <Tabs value={activeTab} onValueChange={(val) => onTabChange(val as ResourceType)}>
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
    </Tabs>
  );
};

export default ResourceTypeTabs;
