
import React from 'react';
import { Activity, Server, Globe, Clock, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Asset } from '@/types/asset';

interface SystemInformationCardProps {
  asset: Asset;
}

const SystemInformationCard: React.FC<SystemInformationCardProps> = ({ asset }) => {
  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        <h3 className="text-lg font-medium flex items-center">
          <Activity className="h-5 w-5 mr-2 text-green-500" />
          System Information
        </h3>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <div className="font-medium flex items-center">
              <Server className="h-4 w-4 mr-2 text-slate-500" />
              Asset Name
            </div>
            <div className="text-right">
              <div className="font-mono text-sm">{asset.name}</div>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="font-medium flex items-center">
              <Activity className="h-4 w-4 mr-2 text-green-500" />
              Status
            </div>
            <div className="text-right">
              <Badge variant={asset.status === 'operational' ? 'outline' : 'secondary'} 
                     className={asset.status === 'operational' ? 'border-green-500 text-green-500' : ''}>
                {asset.status.charAt(0).toUpperCase() + asset.status.slice(1)}
              </Badge>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="font-medium flex items-center">
              <Globe className="h-4 w-4 mr-2 text-blue-500" />
              Location
            </div>
            <div className="text-right">
              <div className="font-mono text-sm">{asset.location}</div>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="font-medium flex items-center">
              <Clock className="h-4 w-4 mr-2 text-slate-500" />
              Last Update
            </div>
            <div className="text-right">
              <div className="font-mono text-sm">
                {new Date(asset.lastUpdate).toLocaleDateString()}
              </div>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="font-medium flex items-center">
              <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
              Assigned To
            </div>
            <div className="text-right">
              <div className="text-sm">{asset.assignedTo}</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SystemInformationCard;
