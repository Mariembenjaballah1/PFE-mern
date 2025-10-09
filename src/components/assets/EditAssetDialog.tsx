
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Asset } from '@/types/asset';
import AddAssetForm from './AddAssetForm';
import EditServerForm from './EditServerForm';

interface EditAssetDialogProps {
  asset: Asset | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const EditAssetDialog: React.FC<EditAssetDialogProps> = ({ 
  asset, 
  open, 
  onOpenChange,
  onSuccess
}) => {
  console.log('EditAssetDialog rendered:', { asset, open });
  
  if (!asset) {
    console.log('No asset provided to EditAssetDialog');
    return null;
  }

  const handleSuccess = () => {
    console.log('Edit asset success callback triggered');
    onSuccess();
    onOpenChange(false);
  };

  const handleCancel = () => {
    console.log('Edit asset cancel triggered');
    onOpenChange(false);
  };

  const isServer = asset.category === 'Servers';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={isServer ? "sm:max-w-4xl" : "sm:max-w-md"}>
        <DialogHeader>
          <DialogTitle>
            {isServer ? 'Edit Server' : 'Edit Asset'}: {asset.name}
          </DialogTitle>
        </DialogHeader>
        {isServer ? (
          <EditServerForm 
            initialData={asset}
            onSuccess={handleSuccess}
            onCancel={handleCancel}
          />
        ) : (
          <AddAssetForm 
            initialData={asset} 
            isEditMode={true}
            onSuccess={handleSuccess}
            onCancel={handleCancel}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EditAssetDialog;
