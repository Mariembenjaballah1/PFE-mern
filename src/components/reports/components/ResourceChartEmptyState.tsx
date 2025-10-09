
import React from 'react';
import { Info } from 'lucide-react';

const ResourceChartEmptyState: React.FC = () => {
  return (
    <div className="h-[400px] flex items-center justify-center">
      <div className="text-center text-muted-foreground">
        <Info className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
        <p className="text-lg mb-2">No server resource data available</p>
        <p className="text-sm">Add servers with resource allocations and assign them to projects to see usage data</p>
      </div>
    </div>
  );
};

export default ResourceChartEmptyState;
