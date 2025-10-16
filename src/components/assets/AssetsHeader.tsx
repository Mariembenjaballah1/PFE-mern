
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Upload, RefreshCw, Trash2 } from 'lucide-react';
import AddAssetDropdown from './AddAssetDropdown';
import AddAssetDialog from './AddAssetDialog';
import UploadServersCSVDialog from './UploadServersCSVDialog';
import { deleteAllServers } from '@/services/assets/assetBasicOperations';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from "@/components/ui/sonner";

interface AssetsHeaderProps {
  onSuccess?: () => void;
}

const AssetsHeader: React.FC<AssetsHeaderProps> = ({ onSuccess }) => {
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isAddAssetDialogOpen, setIsAddAssetDialogOpen] = useState(false);
  const [assetFormType, setAssetFormType] = useState<'general' | 'server' | 'simple'>('simple');
  const [isDeletingServers, setIsDeletingServers] = useState(false);
  const queryClient = useQueryClient();

  const handleDeleteAllServers = async () => {
    if (window.confirm("Are you sure you want to delete ALL servers? This action cannot be undone and is meant for testing purposes only.")) {
      setIsDeletingServers(true);
      try {
        await deleteAllServers();
        // Refresh the assets data
        queryClient.invalidateQueries({ queryKey: ['assets'] });
        if (onSuccess) onSuccess();
      } catch (error) {
        console.error('Error deleting all servers:', error);
      } finally {
        setIsDeletingServers(false);
      }
    }
  };

  const handleOpenDialog = (type: 'general' | 'server' | 'simple') => {
    setAssetFormType(type);
    setIsAddAssetDialogOpen(true);
  };

  const handleAssetCreated = () => {
    setIsAddAssetDialogOpen(false);
    if (onSuccess) onSuccess();
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleDeleteAllServers}
          disabled={isDeletingServers}
          className="text-red-600 hover:text-red-700 hover:bg-red-50 bg-white/20 hover:bg-white/30 border-white/30"
        >
          {isDeletingServers ? (
            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Trash2 className="h-4 w-4 mr-2" />
          )}
          Delete All Servers
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsUploadDialogOpen(true)}
          className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white border-white/30"
        >
          <Upload className="h-4 w-4" />
          Upload Servers
        </Button>
        
        <Button
          onClick={() => handleOpenDialog('simple')}
          size="sm"
          className="flex items-center gap-2 bg-white text-blue-600 hover:bg-white/90"
        >
          <Plus className="h-4 w-4" />
          Add Asset
        </Button>
        
        <AddAssetDropdown onOpenDialog={handleOpenDialog} />
      </div>

      <UploadServersCSVDialog
        open={isUploadDialogOpen}
        onOpenChange={setIsUploadDialogOpen}
        onSuccess={() => {
          setIsUploadDialogOpen(false);
          if (onSuccess) onSuccess();
        }}
      />

      <AddAssetDialog
        open={isAddAssetDialogOpen}
        onOpenChange={setIsAddAssetDialogOpen}
        formType={assetFormType}
        onSuccess={handleAssetCreated}
      />
    </>
  );
};

export default AssetsHeader;

