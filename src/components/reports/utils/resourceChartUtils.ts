
import { Cpu, MemoryStick, HardDrive } from 'lucide-react';

export type ResourceType = 'cpu' | 'ram' | 'disk';

export const getResourceTitle = (activeTab: ResourceType) => {
  switch (activeTab) {
    case 'cpu':
      return 'CPU Usage by Project';
    case 'ram':
      return 'Memory (RAM) Usage by Project';
    case 'disk':
      return 'Disk Space Usage by Project';
  }
};

export const formatYAxis = (value: number, activeTab: ResourceType) => {
  return `${value}%`;
};

export const getResourceIcon = (activeTab: ResourceType) => {
  switch (activeTab) {
    case 'cpu':
      return Cpu;
    case 'ram':
      return MemoryStick;
    case 'disk':
      return HardDrive;
  }
};

export const getBarName = (activeTab: ResourceType) => {
  return activeTab === 'cpu' ? 'CPU' : activeTab === 'ram' ? 'RAM' : 'Disk';
};

export const getTooltipUnit = (activeTab: ResourceType) => {
  return activeTab === 'cpu' ? 'cores' : 'GB';
};
