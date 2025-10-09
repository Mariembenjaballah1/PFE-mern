
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Asset } from '@/types/asset';
import GeneralInfoTab from './GeneralInfoTab';
import ServerDetailsTab from './ServerDetailsTab';
import ServerConnectionsTab from './ServerConnectionsTab';
import ServerChartsTab from './ServerChartsTab';

interface AssetDetailsTabsProps {
  asset: Asset;
}

const AssetDetailsTabs: React.FC<AssetDetailsTabsProps> = ({ asset }) => {
  const isServer = asset.category === 'Servers';
  
  // Mock server-specific details - in a real app, these would come from the asset data
  const serverDetails = isServer ? {
    cpu: asset.specs?.cpu_model || "Intel Xeon E5-2690 v4",
    cores: asset.specs?.cpu_cores || 14,
    ram: asset.specs?.ram_total || "128GB DDR4",
    storage: asset.specs?.disk_total || "4TB SSD RAID",
    os: "Ubuntu Server 22.04 LTS",
    ipAddress: "192.168.1.15",
    activeConnections: 24,
    connectedUsers: [
      { name: "Admin System", since: "2025-05-19 08:12" },
      { name: "Database Service", since: "2025-05-19 06:00" },
      { name: "Backup Agent", since: "2025-05-19 00:30" }
    ],
    functions: ["Web Server", "Database", "Authentication", "File Storage"],
    endpoints: ["/api/users", "/api/assets", "/api/maintenance", "/api/reports"]
  } : null;

  return (
    <Tabs defaultValue="general">
      <TabsList className={`grid w-full ${isServer ? 'grid-cols-4' : 'grid-cols-1'}`}>
        <TabsTrigger value="general">General Info</TabsTrigger>
        {isServer && <TabsTrigger value="server-details">Server Details</TabsTrigger>}
        {isServer && <TabsTrigger value="charts">Charts & Quotas</TabsTrigger>}
        {isServer && <TabsTrigger value="connections">Connections</TabsTrigger>}
      </TabsList>
      
      <TabsContent value="general" className="pt-4">
        <GeneralInfoTab asset={asset} />
      </TabsContent>
      
      {isServer && (
        <TabsContent value="server-details" className="pt-4">
          <ServerDetailsTab serverDetails={serverDetails} asset={asset} />
        </TabsContent>
      )}

      {isServer && (
        <TabsContent value="charts" className="pt-4">
          <ServerChartsTab asset={asset} />
        </TabsContent>
      )}

      {isServer && serverDetails && (
        <TabsContent value="connections" className="pt-4">
          <ServerConnectionsTab serverDetails={serverDetails} />
        </TabsContent>
      )}
    </Tabs>
  );
};

export default AssetDetailsTabs;
