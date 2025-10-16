
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Server, HardDrive, MapPin, User } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ServersPreviewProps {
  parsedDataLength: number;
  groupedServers: Record<string, any[]>;
  newProjects: string[];
}

const ServersPreview: React.FC<ServersPreviewProps> = ({
  parsedDataLength,
  groupedServers,
  newProjects
}) => {
  console.log('=== SERVERS PREVIEW DEBUG ===');
  console.log('Parsed data length:', parsedDataLength);
  console.log('Grouped servers:', groupedServers);
  console.log('New projects:', newProjects);

  // Safely get server details with fallbacks
  const getServerDetails = (server: any) => {
    if (!server) {
      console.warn('Server object is undefined or null');
      return {
        name: 'Unknown Server',
        location: 'Unknown Location',
        projectName: 'Unassigned',
        resources: { cpu: 0, ram: 0, disk: 0 },
        specs: {},
        additionalData: {}
      };
    }

    console.log('Processing server:', server);
    
    return {
      name: server.name || server.vm || `Server-${Date.now()}`,
      location: server.location || server.datacenter || 'Unknown Location',
      projectName: server.projectName || server.projet || 'Unassigned',
      resources: server.resources || { cpu: 0, ram: 0, disk: 0 },
      specs: server.specs || {},
      additionalData: server.additionalData || {}
    };
  };

  // Safely process grouped servers with proper typing
  const safeGroupedServers = Object.entries(groupedServers || {}).map(([projectName, servers]) => {
    console.log(`Processing project: ${projectName} with ${servers?.length || 0} servers`);
    
    const safeServers = (servers || []).map((server, index) => {
      const details = getServerDetails(server);
      console.log(`Server ${index}:`, details);
      return details;
    });

    return { projectName, servers: safeServers };
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Server className="h-5 w-5" />
          Preview ({parsedDataLength} servers found)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px]">
          <div className="space-y-4">
            {safeGroupedServers.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No servers to preview
              </div>
            ) : (
              safeGroupedServers.map(({ projectName, servers }) => (
                <div key={projectName} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">{projectName}</h4>
                    {newProjects.includes(projectName) && (
                      <Badge variant="secondary" className="text-xs">New Project</Badge>
                    )}
                  </div>
                  
                  <div className="grid gap-2">
                    {Array.isArray(servers) && servers.map((server, serverIndex) => {
                      const serverDetails = getServerDetails(server);
                      
                      return (
                        <div 
                          key={`${projectName}-${serverIndex}-${serverDetails.name}`}
                          className="p-3 border rounded-lg bg-muted/30"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Server className="h-4 w-4 text-blue-500" />
                              <span className="font-medium">{serverDetails.name}</span>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {serverDetails.location}
                              </div>
                            </div>
                          </div>
                          
                          <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <HardDrive className="h-3 w-3" />
                              CPU: {serverDetails.resources?.cpu || 0} cores
                            </div>
                            <div>
                              RAM: {Math.round((serverDetails.resources?.ram || 0) / 1024)}GB
                            </div>
                            <div>
                              Disk: {Math.round((serverDetails.resources?.disk || 0) / 1024)}GB
                            </div>
                          </div>

                          {serverDetails.specs?.ip_address && (
                            <div className="mt-1 text-xs text-muted-foreground">
                              IP: {serverDetails.specs.ip_address}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default ServersPreview;
