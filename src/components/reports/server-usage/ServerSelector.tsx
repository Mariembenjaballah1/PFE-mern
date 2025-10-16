
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Server, MapPin, Zap } from 'lucide-react';
import { Asset } from '@/types/asset';

interface ServerSelectorProps {
  servers: Asset[];
  selectedServerId: string | null;
  onServerChange: (serverId: string) => void;
  isLoading: boolean;
}

const ServerSelector: React.FC<ServerSelectorProps> = ({
  servers,
  selectedServerId,
  onServerChange,
  isLoading
}) => {
  console.log('ServerSelector - servers:', servers.length, 'selected:', selectedServerId);
  
  return (
    <div className="w-full max-w-md">
      <label className="block text-sm font-semibold text-gray-900 mb-3 tracking-wide">
        Select Server to Monitor
      </label>
      <Select 
        value={selectedServerId || ''} 
        onValueChange={onServerChange}
        disabled={isLoading || servers.length === 0}
      >
        <SelectTrigger className="w-full h-12 bg-white border-2 border-gray-200 shadow-sm hover:border-blue-400 transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="p-1.5 bg-blue-50 rounded-md">
              <Server className="h-4 w-4 text-blue-600" />
            </div>
            <SelectValue 
              placeholder={servers.length > 0 ? "Choose a server to monitor" : "No servers available"}
              className="font-medium text-gray-700"
            />
          </div>
        </SelectTrigger>
        <SelectContent className="bg-white border-2 border-gray-100 shadow-xl z-50 max-h-80 rounded-lg">
          {servers.map((server) => (
            <SelectItem 
              key={server.id} 
              value={server.id} 
              className="py-4 px-3 cursor-pointer hover:bg-blue-50 focus:bg-blue-50 transition-colors duration-150 rounded-md mx-1"
            >
              <div className="flex items-center space-x-4 w-full">
                <div className="flex-shrink-0">
                  <div className={`w-3 h-3 rounded-full shadow-sm ${
                    server.status === 'operational' ? 'bg-emerald-500' : 
                    server.status === 'maintenance' ? 'bg-amber-500' : 'bg-red-500'
                  }`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-gray-900 truncate text-base">{server.name}</div>
                  <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1.5">
                    <span className="flex items-center font-medium">
                      <MapPin className="h-3 w-3 mr-1" />
                      {server.location || 'Unknown location'}
                    </span>
                    <span className="flex items-center font-medium">
                      <Zap className="h-3 w-3 mr-1" />
                      {server.category || 'Server'}
                    </span>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                    server.status === 'operational' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                    server.status === 'maintenance' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                    'bg-red-100 text-red-800 border border-red-200'
                  }`}>
                    {server.status?.charAt(0).toUpperCase() + server.status?.slice(1)}
                  </span>
                </div>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {servers.length > 0 && (
        <p className="text-sm text-gray-500 mt-2 font-medium">
          {servers.length} server{servers.length !== 1 ? 's' : ''} available for monitoring
        </p>
      )}
    </div>
  );
};

export default ServerSelector;
