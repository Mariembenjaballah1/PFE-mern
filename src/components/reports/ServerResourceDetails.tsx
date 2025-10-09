
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Cpu, Database, HardDrive } from 'lucide-react';
import ResourceUsageCard from './ResourceUsageCard';

interface ServerResourceDetailsProps {
  serverAssets: any[];
  selectedServer: string;
}

const ServerResourceDetails: React.FC<ServerResourceDetailsProps> = ({ 
  serverAssets, 
  selectedServer 
}) => {
  const [selectedServerResource, setSelectedServerResource] = React.useState<'cpu' | 'ram' | 'disk'>('cpu');
  
  // Get server details once a server is selected
  const selectedServerDetails = React.useMemo(() => {
    if (!selectedServer) return null;
    return serverAssets.find(server => server.id === selectedServer);
  }, [selectedServer, serverAssets]);
  
  // Calculate usage percentages for the selected server
  const calculateResourceUsage = (server: any, resourceType: 'cpu' | 'ram' | 'disk') => {
    if (!server || !server.resources) return 0;
    
    // For demonstration, we'll simulate usage as a percentage of capacity
    // In a real app, this would come from monitoring data
    let usagePercentage = 0;
    
    switch (resourceType) {
      case 'cpu':
        // Simulate 30-80% CPU usage
        usagePercentage = Math.round(30 + Math.random() * 50);
        break;
      case 'ram':
        // Simulate 40-90% RAM usage
        usagePercentage = Math.round(40 + Math.random() * 50);
        break;
      case 'disk':
        // Simulate 20-70% disk usage
        usagePercentage = Math.round(20 + Math.random() * 50);
        break;
    }
    
    return usagePercentage;
  };
  
  // Generate network data for the selected server
  const getNetworkData = (server: any) => {
    if (!server) return { incoming: 0, outgoing: 0 };
    
    // Simulate network traffic data
    return {
      incoming: Math.round(100 + Math.random() * 900), // Mbps
      outgoing: Math.round(50 + Math.random() * 450)   // Mbps
    };
  };
  
  if (!selectedServerDetails) {
    return (
      <div className="h-[300px] flex items-center justify-center">
        <p className="text-muted-foreground">Select a server to view resource details</p>
      </div>
    );
  }
  
  const cpuUsage = calculateResourceUsage(selectedServerDetails, 'cpu');
  const ramUsage = calculateResourceUsage(selectedServerDetails, 'ram');
  const diskUsage = calculateResourceUsage(selectedServerDetails, 'disk');
  const networkData = getNetworkData(selectedServerDetails);
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <ResourceUsageCard
          icon={<Cpu className="h-5 w-5" />}
          title="CPU Usage"
          usage={cpuUsage}
          total={selectedServerDetails.resources?.cpu || 0}
          color="text-blue-500"
          unit="cores"
        />
        
        <ResourceUsageCard
          icon={<Database className="h-5 w-5" />}
          title="Memory Usage"
          usage={ramUsage}
          total={selectedServerDetails.resources?.ram || 0}
          color="text-green-500"
          unit="GB"
        />
        
        <ResourceUsageCard
          icon={<HardDrive className="h-5 w-5" />}
          title="Disk Usage"
          usage={diskUsage}
          total={selectedServerDetails.resources?.disk || 0}
          color="text-yellow-500"
          unit="GB"
        />
      </div>
      
      {/* Network Information */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Network Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between">
            <span>Incoming Traffic:</span>
            <span className="font-medium">{networkData.incoming} Mbps</span>
          </div>
          <div className="flex justify-between">
            <span>Outgoing Traffic:</span>
            <span className="font-medium">{networkData.outgoing} Mbps</span>
          </div>
          <div className="flex justify-between">
            <span>IP Address:</span>
            <span className="font-medium">192.168.{Math.floor(Math.random() * 255)}.{Math.floor(Math.random() * 255)}</span>
          </div>
          <div className="flex justify-between">
            <span>Hostname:</span>
            <span className="font-medium">{selectedServerDetails.name.toLowerCase().replace(/\s+/g, '-')}.internal</span>
          </div>
        </CardContent>
      </Card>
      
      {/* Resource Usage Over Time (Mock Data) */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Resource Usage Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedServerResource} onValueChange={(value) => setSelectedServerResource(value as 'cpu' | 'ram' | 'disk')}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="cpu" className="flex items-center gap-1">
                <Cpu className="h-4 w-4" /> CPU
              </TabsTrigger>
              <TabsTrigger value="ram" className="flex items-center gap-1">
                <Database className="h-4 w-4" /> Memory
              </TabsTrigger>
              <TabsTrigger value="disk" className="flex items-center gap-1">
                <HardDrive className="h-4 w-4" /> Disk
              </TabsTrigger>
            </TabsList>
            <TabsContent value="cpu" className="mt-4">
              <div className="h-32 bg-muted/30 rounded-md flex items-center justify-center">
                <p className="text-muted-foreground">CPU usage chart would appear here</p>
              </div>
            </TabsContent>
            <TabsContent value="ram" className="mt-4">
              <div className="h-32 bg-muted/30 rounded-md flex items-center justify-center">
                <p className="text-muted-foreground">Memory usage chart would appear here</p>
              </div>
            </TabsContent>
            <TabsContent value="disk" className="mt-4">
              <div className="h-32 bg-muted/30 rounded-md flex items-center justify-center">
                <p className="text-muted-foreground">Disk usage chart would appear here</p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ServerResourceDetails;
