
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Asset } from '@/types/asset';
import { User } from 'lucide-react';
import AssignAssetForm from './AssignAssetForm';
import { useNotifications } from '@/hooks/use-notifications';
import AssetDetailsTabs from './details/AssetDetailsTabs';

interface AssetDetailsDialogProps {
  asset: Asset | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const AssetDetailsDialog: React.FC<AssetDetailsDialogProps> = ({ 
  asset, 
  open, 
  onOpenChange,
  onSuccess
}) => {
  const [showAssignForm, setShowAssignForm] = useState(false);
  const { addNotification } = useNotifications();
  
  if (!asset) return null;

  const handleAssignSuccess = () => {
    addNotification({
      type: 'assignment',
      title: 'Asset Assigned',
      message: `Asset ${asset.name} has been assigned successfully.`
    });
    
    if (onSuccess) onSuccess();
    setShowAssignForm(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {asset.name} 
            <span className="text-sm text-muted-foreground ml-2">ID: {asset.id}</span>
          </DialogTitle>
          <DialogDescription>
            Asset details and management options
          </DialogDescription>
        </DialogHeader>
        
        {!showAssignForm ? (
          <>
            <AssetDetailsTabs asset={asset} />
            
            <DialogFooter className="flex justify-between sm:justify-between">
              <Button 
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Close
              </Button>
              <Button 
                onClick={() => setShowAssignForm(true)}
                className="flex items-center gap-2"
              >
                <User className="h-4 w-4" />
                {asset.assignedTo ? 'Reassign Asset' : 'Assign Asset'}
              </Button>
            </DialogFooter>
          </>
        ) : (
          <AssignAssetForm
            asset={asset}
            onCancel={() => setShowAssignForm(false)}
            onSuccess={handleAssignSuccess}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AssetDetailsDialog;
