
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Asset } from '@/types/asset';
import { 
  CalendarDays, 
  MapPin, 
  User, 
  Folder,
  Globe,
  Settings
} from 'lucide-react';

interface GeneralInfoTabProps {
  asset: Asset;
}

const GeneralInfoTab: React.FC<GeneralInfoTabProps> = ({ asset }) => {
  // Helper function to get project name as string
  const getProjectName = (): string => {
    if (!asset.project) return 'No Project';
    if (typeof asset.project === 'string') return asset.project;
    return asset.project.name || 'Unknown Project';
  };

  // Get environment from additionalData
  const getEnvironment = (): string => {
    return asset.additionalData?.environment || 'Not specified';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'repair':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'retired':
        return 'bg-gray-100 text-gray-800 border-gray-300';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-300';
    }
  };

  const getEnvironmentColor = (env: string) => {
    switch (env.toLowerCase()) {
      case 'production':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'development':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'testing':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'staging':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Asset Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-500">Status</label>
              <Badge 
                variant="outline" 
                className={`${getStatusColor(asset.status)} font-medium`}
              >
                {asset.status?.charAt(0).toUpperCase() + asset.status?.slice(1)}
              </Badge>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-500">Environment</label>
              <Badge 
                variant="outline" 
                className={`${getEnvironmentColor(getEnvironment())} font-medium`}
              >
                <Globe className="h-3 w-3 mr-1" />
                {getEnvironment().charAt(0).toUpperCase() + getEnvironment().slice(1)}
              </Badge>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-500">Category</label>
              <p className="text-sm">{asset.category}</p>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-500">Purchase Date</label>
              <div className="flex items-center gap-2 text-sm">
                <CalendarDays className="h-4 w-4 text-gray-400" />
                {new Date(asset.purchaseDate).toLocaleDateString()}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Location & Assignment
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-500">Location</label>
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-gray-400" />
                {asset.location || 'Not specified'}
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-500">Assigned To</label>
              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4 text-gray-400" />
                {asset.assignedTo || 'Unassigned'}
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-500">Project</label>
              <div className="flex items-center gap-2 text-sm">
                <Folder className="h-4 w-4 text-gray-400" />
                {getProjectName()}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resources Information */}
      {asset.resources && (asset.resources.cpu > 0 || asset.resources.ram > 0 || asset.resources.disk > 0) && (
        <Card>
          <CardHeader>
            <CardTitle>Resource Allocation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {asset.resources.cpu > 0 && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-500">CPU Cores</label>
                  <p className="text-lg font-semibold">{asset.resources.cpu}</p>
                </div>
              )}
              
              {asset.resources.ram > 0 && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-500">RAM</label>
                  <p className="text-lg font-semibold">{asset.resources.ram} MB</p>
                </div>
              )}
              
              {asset.resources.disk > 0 && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-500">Disk</label>
                  <p className="text-lg font-semibold">{asset.resources.disk} MB</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default GeneralInfoTab;
