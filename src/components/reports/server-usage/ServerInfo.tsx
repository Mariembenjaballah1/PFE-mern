
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { MapPin, Folder, Zap } from 'lucide-react';
import { Asset } from '@/types/asset';

interface ServerInfoProps {
  server: Asset;
}

const ServerInfo: React.FC<ServerInfoProps> = ({ server }) => {
  // Helper function to get project name as string
  const getProjectName = (): string => {
    if (!server.project) return 'No Project';
    if (typeof server.project === 'string') return server.project;
    return server.project.name;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'maintenance':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'offline':
        return 'bg-red-50 text-red-800 border-red-200';
      default:
        return 'bg-gray-50 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-900 text-xl tracking-tight">{server.name}</h3>
        <Badge className={`${getStatusColor(server.status)} border font-semibold px-3 py-1.5`}>
          <div className={`w-2.5 h-2.5 rounded-full mr-2 ${
            server.status === 'operational' ? 'bg-emerald-500' :
            server.status === 'maintenance' ? 'bg-amber-500' : 'bg-red-500'
          }`} />
          {server.status?.charAt(0).toUpperCase() + server.status?.slice(1)}
        </Badge>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
        <div className="flex items-start space-x-3 text-gray-600">
          <div className="p-2 bg-blue-50 rounded-lg mt-0.5">
            <MapPin className="h-4 w-4 text-blue-600 flex-shrink-0" />
          </div>
          <div>
            <p className="font-semibold text-gray-900 mb-1">Location</p>
            <p className="text-gray-600 font-medium">{server.location || 'Not specified'}</p>
          </div>
        </div>
        
        <div className="flex items-start space-x-3 text-gray-600">
          <div className="p-2 bg-purple-50 rounded-lg mt-0.5">
            <Zap className="h-4 w-4 text-purple-600 flex-shrink-0" />
          </div>
          <div>
            <p className="font-semibold text-gray-900 mb-1">Category</p>
            <p className="text-gray-600 font-medium">{server.category || 'Server'}</p>
          </div>
        </div>
        
        {server.project && (
          <div className="flex items-start space-x-3 text-gray-600">
            <div className="p-2 bg-green-50 rounded-lg mt-0.5">
              <Folder className="h-4 w-4 text-green-600 flex-shrink-0" />
            </div>
            <div>
              <p className="font-semibold text-gray-900 mb-1">Project</p>
              <p className="text-gray-600 font-medium">{getProjectName()}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServerInfo;
