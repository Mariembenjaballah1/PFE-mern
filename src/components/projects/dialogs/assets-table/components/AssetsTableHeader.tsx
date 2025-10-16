
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Server } from 'lucide-react';

interface AssetsTableHeaderProps {
  assetCount: number;
}

export const AssetsTableHeader: React.FC<AssetsTableHeaderProps> = ({ assetCount }) => {
  return (
    <div className="flex items-center justify-between">
      <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
        <Server className="h-5 w-5 text-blue-600" />
        Assigned Assets
      </h4>
      <Badge variant="outline" className="text-sm font-medium px-3 py-1">
        {assetCount} {assetCount === 1 ? 'Asset' : 'Assets'}
      </Badge>
    </div>
  );
};
