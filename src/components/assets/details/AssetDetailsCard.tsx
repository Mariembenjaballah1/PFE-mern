
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Folder } from 'lucide-react';
import AssetDetailsTabs from '@/components/assets/details/AssetDetailsTabs';
import { Asset } from '@/types/asset';

interface AssetDetailsCardProps {
  asset: Asset;
  projectDisplayName: string;
}

const AssetDetailsCard: React.FC<AssetDetailsCardProps> = ({ asset, projectDisplayName }) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl font-bold">{asset.name}</CardTitle>
            <p className="text-muted-foreground">ID: {asset.id}</p>
            
            {projectDisplayName && (
              <div className="mt-2">
                <Badge variant="outline" className="flex items-center gap-1 text-blue-600 border-blue-300 bg-blue-50">
                  <Folder className="h-3 w-3" />
                  {projectDisplayName}
                </Badge>
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4 space-y-6">
        <AssetDetailsTabs asset={asset} />
      </CardContent>
    </Card>
  );
};

export default AssetDetailsCard;
