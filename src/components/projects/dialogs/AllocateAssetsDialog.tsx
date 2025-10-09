import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Project, Asset } from '@/types/asset';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import { fetchAssets } from '@/services/assets/assetBasicOperations';
import { updateAsset } from '@/services/assets/assetBasicOperations';
import { groupAssetsByEnvironment, sortEnvironments } from './assets-table/utils/assetUtils';
import { Server, Monitor, Database, Network, Laptop, Printer, HardDrive } from 'lucide-react';

export interface AllocateAssetsDialogProps {
  project: Project;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentAssets: Asset[];
}

const AllocateAssetsDialog: React.FC<AllocateAssetsDialogProps> = ({
  project,
  open,
  onOpenChange,
  currentAssets
}) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAssets, setSelectedAssets] = useState<string[]>([]);
  const [selectedEnvironment, setSelectedEnvironment] = useState<string>('');

  // Get existing environments from current project assets only
  const existingEnvironments = currentAssets.length > 0 
    ? sortEnvironments(Object.keys(groupAssetsByEnvironment(currentAssets)))
    : [];

  // Fetch all assets
  const { data: allAssets = [], isLoading: assetsLoading } = useQuery({
    queryKey: ['assets'],
    queryFn: fetchAssets,
    enabled: open
  });

  // Filter out assets already assigned to this project
  const currentAssetIds = currentAssets.map(asset => asset.id || asset._id);
  const availableAssets = allAssets.filter(asset => 
    !currentAssetIds.includes(asset.id || asset._id)
  );

  const getAssetIcon = (category: string) => {
    const iconMap: Record<string, JSX.Element> = {
      servers: <Server className="h-4 w-4 text-blue-600" />,
      databases: <Database className="h-4 w-4 text-purple-600" />,
      networking: <Network className="h-4 w-4 text-indigo-600" />,
      laptops: <Laptop className="h-4 w-4 text-green-600" />,
      displays: <Monitor className="h-4 w-4 text-amber-600" />,
      printers: <Printer className="h-4 w-4 text-red-600" />
    };
    return iconMap[category.toLowerCase()] || <HardDrive className="h-4 w-4 text-gray-600" />;
  };

  const getStatusBadge = (status: string) => {
    const statusStyles: Record<string, string> = {
      operational: 'bg-green-100 text-green-800 border-green-300',
      maintenance: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      repair: 'bg-red-100 text-red-800 border-red-300',
      retired: 'bg-gray-100 text-gray-800 border-gray-300'
    };
    
    return (
      <Badge 
        variant="outline" 
        className={`text-xs ${statusStyles[status] || 'bg-blue-100 text-blue-800 border-blue-300'}`}
      >
        {status}
      </Badge>
    );
  };

  const handleAssetToggle = (assetId: string) => {
    setSelectedAssets(prev => 
      prev.includes(assetId)
        ? prev.filter(id => id !== assetId)
        : [...prev, assetId]
    );
  };

  const handleAllocate = async () => {
    if (selectedAssets.length === 0) {
      toast({
        title: "No Assets Selected",
        description: "Please select at least one asset to allocate.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      // Update each selected asset to assign it to the project with environment
      await Promise.all(
        selectedAssets.map(assetId => {
          const updateData: any = {
            id: assetId,
            project: project.id
          };
          
          // Add environment to additionalData if selected
          if (selectedEnvironment) {
            updateData.additionalData = {
              environment: selectedEnvironment
            };
          }
          
          return updateAsset(updateData);
        })
      );

      toast({
        title: "Assets Allocated",
        description: `Successfully allocated ${selectedAssets.length} asset(s) to ${project.name}${selectedEnvironment ? ` in ${selectedEnvironment} environment` : ''}.`,
      });
      
      // Dispatch custom event to refresh project data
      window.dispatchEvent(new CustomEvent('forceProjectRefresh', { 
        detail: { projectId: project.id } 
      }));
      
      setSelectedAssets([]);
      setSelectedEnvironment('');
      onOpenChange(false);
    } catch (error) {
      console.error('Error allocating assets:', error);
      toast({
        title: "Error",
        description: "Failed to allocate assets. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Allocate Assets to {project.name}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground">
            Select assets to allocate to this project and choose an environment. Currently {currentAssets.length} assets are assigned.
          </div>

          {/* Environment Selection */}
          <div className="space-y-2">
            <Label htmlFor="environment-select">Environment (Optional)</Label>
            <Select value={selectedEnvironment} onValueChange={setSelectedEnvironment}>
              <SelectTrigger id="environment-select" className="bg-white dark:bg-gray-800">
                <SelectValue placeholder="Select environment for allocated assets" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-gray-800 border shadow-lg z-50">
                {existingEnvironments.length > 0 ? (
                  existingEnvironments.map(env => (
                    <SelectItem key={env} value={env} className="hover:bg-gray-100 dark:hover:bg-gray-700">
                      {env}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="" disabled className="text-gray-400">
                    Aucun environnement trouvé dans ce projet
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
            <div className="text-xs text-muted-foreground">
              {existingEnvironments.length > 0 
                ? "Choisissez un environnement existant dans ce projet" 
                : "Aucun environnement trouvé dans les actifs actuels du projet"}
            </div>
          </div>
          
          {assetsLoading ? (
            <div className="flex items-center justify-center p-8">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                <p className="text-sm text-muted-foreground">Loading assets...</p>
              </div>
            </div>
          ) : availableAssets.length === 0 ? (
            <div className="text-center p-8 text-muted-foreground">
              <HardDrive className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p>No available assets to allocate</p>
              <p className="text-sm">All assets are already assigned to projects</p>
            </div>
          ) : (
            <ScrollArea className="h-96 border rounded-lg p-4">
              <div className="space-y-3">
                {availableAssets.map(asset => (
                  <div
                    key={asset.id || asset._id}
                    className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleAssetToggle(asset.id || asset._id)}
                  >
                    <Checkbox
                      checked={selectedAssets.includes(asset.id || asset._id)}
                      onChange={() => handleAssetToggle(asset.id || asset._id)}
                    />
                    <div className="flex items-center space-x-3 flex-1">
                      <div className="p-1.5 bg-gray-50 rounded">
                        {getAssetIcon(asset.category)}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{asset.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {asset.category} • {asset.assignedTo || 'Unassigned'}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusBadge(asset.status)}
                        {asset.resources && (
                          <div className="text-xs text-muted-foreground">
                            {asset.resources.cpu}C • {asset.resources.ram}MB • {asset.resources.disk}MB
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
          
          {selectedAssets.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-800">
                {selectedAssets.length} asset(s) selected for allocation
                {selectedEnvironment && ` to ${selectedEnvironment} environment`}
              </p>
            </div>
          )}
          
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleAllocate} 
              disabled={isLoading || selectedAssets.length === 0}
            >
              {isLoading ? "Allocating..." : `Allocate ${selectedAssets.length || ''} Asset${selectedAssets.length !== 1 ? 's' : ''}`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AllocateAssetsDialog;
