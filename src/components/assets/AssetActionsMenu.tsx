
import React, { useState } from 'react';
import { MoreHorizontal, Edit, Trash2, Eye, UserPlus, Settings } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Asset } from '@/types/asset';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import EditAssetDialog from './EditAssetDialog';
import AssignAssetForm from './AssignAssetForm';
import ChangeEnvironmentDialog from './ChangeEnvironmentDialog';

interface AssetActionsMenuProps {
  asset: Asset;
  onEdit?: (asset: Asset) => void;
  onDelete?: (assetId: string) => void;
  onRefresh?: () => void;
  onViewDetails?: () => void;
  currentUser?: { name: string; role: string };
}

const AssetActionsMenu: React.FC<AssetActionsMenuProps> = ({
  asset,
  onEdit,
  onDelete,
  onRefresh,
  onViewDetails,
  currentUser
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [isChangeEnvironmentDialogOpen, setIsChangeEnvironmentDialogOpen] = useState(false);

  // Get the asset ID, preferring 'id' over '_id'
  const assetId = asset.id || asset._id;
  
  if (!assetId) {
    console.error('Asset has no ID:', asset);
    return null; // Don't render the menu if there's no ID
  }

  const handleViewDetails = () => {
    if (onViewDetails) {
      onViewDetails();
    } else {
      navigate(`/assets/${assetId}`);
    }
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(asset);
    } else {
      setIsEditDialogOpen(true);
    }
  };

  const handleDelete = () => {
    if (onDelete && window.confirm('Are you sure you want to delete this asset?')) {
      onDelete(assetId);
      toast.success('Asset Deleted', {
        description: `Asset "${asset.name}" has been deleted successfully`
      });
    }
  };

  const handleAssign = () => {
    setIsAssignDialogOpen(true);
  };

  const handleChangeEnvironment = () => {
    setIsChangeEnvironmentDialogOpen(true);
  };

  const handleSuccess = () => {
    if (onRefresh) {
      onRefresh();
    }
    toast.success('Action Completed', {
      description: 'Asset has been updated successfully'
    });
  };

  const handleAssignCancel = () => {
    setIsAssignDialogOpen(false);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleViewDetails}>
            <Eye className="mr-2 h-4 w-4" />
            View Details
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleEdit}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Asset
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleAssign}>
            <UserPlus className="mr-2 h-4 w-4" />
            Assign to Project
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleChangeEnvironment}>
            <Settings className="mr-2 h-4 w-4" />
            Change Environment
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleDelete} className="text-red-600">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Asset
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <EditAssetDialog
        asset={asset}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSuccess={handleSuccess}
      />

      {isAssignDialogOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <AssignAssetForm
              asset={asset}
              onCancel={handleAssignCancel}
              onSuccess={() => {
                handleSuccess();
                setIsAssignDialogOpen(false);
              }}
            />
          </div>
        </div>
      )}

      <ChangeEnvironmentDialog
        asset={asset}
        open={isChangeEnvironmentDialogOpen}
        onOpenChange={setIsChangeEnvironmentDialogOpen}
        onSuccess={handleSuccess}
      />
    </>
  );
};

export default AssetActionsMenu;
