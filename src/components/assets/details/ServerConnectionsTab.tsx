
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { User, Network } from 'lucide-react';

interface ServerDetailsProps {
  serverDetails: {
    activeConnections: number;
    connectedUsers: { name: string; since: string }[];
    ipAddress: string;
  };
}

const ServerConnectionsTab: React.FC<ServerDetailsProps> = ({ serverDetails }) => {
  return (
    <div className="grid gap-4">
      <div className="flex justify-between items-center">
        <div className="font-semibold flex items-center">
          <User className="h-4 w-4 mr-2" />
          Active Connections
        </div>
        <Badge>{serverDetails.activeConnections}</Badge>
      </div>
      
      <div className="border rounded-md p-3 max-h-60 overflow-y-auto">
        {serverDetails.connectedUsers.map((user, index) => (
          <div key={index} className="flex justify-between text-sm py-2 border-b last:border-0">
            <div className="flex items-center">
              <User className="h-4 w-4 mr-2 text-green-500" />
              <span>{user.name}</span>
            </div>
            <span className="text-muted-foreground">{user.since}</span>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center">
        <div className="font-semibold flex items-center">
          <Network className="h-4 w-4 mr-2" />
          Network Status
        </div>
        <Badge variant="outline" className="border-green-500 text-green-500">Online</Badge>
      </div>

      <div className="p-2 bg-green-50 border border-green-200 rounded-md text-sm">
        <div className="font-medium text-green-800">Server health: Good</div>
        <div className="text-green-600 mt-1">All systems operating normally</div>
      </div>
    </div>
  );
};

export default ServerConnectionsTab;
