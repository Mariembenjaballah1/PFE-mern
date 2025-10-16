
import React from 'react';
import { Asset } from '@/types/asset';
import VMInformationCard from './server/VMInformationCard';
import ProjectResourcesCard from './server/ProjectResourcesCard';
import SystemInformationCard from './server/SystemInformationCard';

interface ServerDetailsTabProps {
  serverDetails?: {
    cpu: string;
    cores: number;
    ram: string;
    storage: string;
    os: string;
    ipAddress: string;
    functions: string[];
    endpoints: string[];
  };
  asset: Asset;
}

const ServerDetailsTab: React.FC<ServerDetailsTabProps> = ({ asset }) => {
  console.log('=== SERVER DETAILS TAB DEBUG ===');
  console.log('Asset specs:', asset.specs);
  console.log('Asset additionalData:', asset.additionalData);
  console.log('Full asset:', asset);
  
  return (
    <div className="grid gap-6">
      <VMInformationCard asset={asset} />
      <ProjectResourcesCard asset={asset} />
      <SystemInformationCard asset={asset} />
    </div>
  );
};

export default ServerDetailsTab;
