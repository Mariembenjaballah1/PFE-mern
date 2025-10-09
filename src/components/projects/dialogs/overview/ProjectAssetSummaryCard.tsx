
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Asset } from '@/types/asset';
import { Activity } from 'lucide-react';

interface ProjectAssetSummaryCardProps {
  assets: Asset[];
}

export const ProjectAssetSummaryCard: React.FC<ProjectAssetSummaryCardProps> = ({ assets }) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-md flex items-center gap-2">
          <Activity className="h-4 w-4" />
          Asset Summary
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['operational', 'maintenance', 'repair', 'retired'].map((status) => {
            const count = assets.filter(asset => asset.status === status).length;
            return (
              <div key={status} className="text-center">
                <p className="text-2xl font-bold text-primary">{count}</p>
                <p className="text-sm text-muted-foreground capitalize">{status}</p>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
