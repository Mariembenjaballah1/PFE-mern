
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import EditAssetDialog from '@/components/assets/EditAssetDialog';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';
import { Asset } from '@/types/asset';

interface AssetDetailsHeaderProps {
  asset: Asset;
  editDialogOpen: boolean;
  setEditDialogOpen: (open: boolean) => void;
  onEditSuccess: () => void;
  onDeleteAsset: () => void;
}

const AssetDetailsHeader: React.FC<AssetDetailsHeaderProps> = ({
  asset,
  editDialogOpen,
  setEditDialogOpen,
  onEditSuccess,
  onDeleteAsset
}) => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate('/assets');
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={handleGoBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">Asset Details</h1>
        </div>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            onClick={() => setEditDialogOpen(true)}
            className="flex items-center gap-2"
          >
            <Edit className="h-4 w-4" /> Edit Asset
          </Button>
          <Button 
            variant="outline" 
            className="flex items-center gap-2 text-red-500 hover:bg-red-50 border-red-200"
            onClick={onDeleteAsset}
          >
            <Trash2 className="h-4 w-4" /> Delete
          </Button>
        </div>
      </div>

      <EditAssetDialog
        asset={asset}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSuccess={onEditSuccess}
      />
    </>
  );
};

export default AssetDetailsHeader;
