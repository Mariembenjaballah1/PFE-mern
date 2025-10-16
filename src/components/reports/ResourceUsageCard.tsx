
import React from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface ResourceUsageCardProps {
  icon: React.ReactNode;
  title: string;
  usage: number;
  total: number;
  color: string;
  unit: string;
  used?: number;
}

const ResourceUsageCard: React.FC<ResourceUsageCardProps> = ({ 
  icon, 
  title, 
  usage, 
  total, 
  color, 
  unit,
  used 
}) => {
  // Calculate available based on actual usage if provided, otherwise use percentage
  const available = used !== undefined 
    ? Math.round(total - used)
    : Math.round(total * (1 - usage/100));
    
  const actualUsed = used !== undefined ? used : Math.round(total * (usage/100));
  
  return (
    <Card className="p-4 flex flex-col">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className={color}>
            {icon}
          </div>
          <h3 className="font-medium">{title}</h3>
        </div>
        <span className="text-sm font-bold">{usage}%</span>
      </div>
      <Progress value={usage} className="mb-2" />
      <div className="text-sm text-muted-foreground mt-auto">
        <p className="font-medium">Used: {actualUsed} {unit}</p>
        <p>Available: {available} {unit}</p>
        <p className="text-xs">Total: {total} {unit}</p>
      </div>
    </Card>
  );
};

export default ResourceUsageCard;
