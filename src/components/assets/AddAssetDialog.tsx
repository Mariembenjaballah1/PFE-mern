
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import AddAssetForm from './AddAssetForm';
import ServerForm from './ServerForm';
import SimpleAssetForm from './form/SimpleAssetForm';

interface AddAssetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formType: 'general' | 'server' | 'simple';
  onSuccess?: () => void;
}

const AddAssetDialog: React.FC<AddAssetDialogProps> = ({
  open,
  onOpenChange,
  formType,
  onSuccess
}) => {
  const handleSuccess = () => {
    onOpenChange(false);
    if (onSuccess) onSuccess();
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  const getDialogTitle = () => {
    switch (formType) {
      case 'server':
        return 'Add New Server';
      case 'simple':
        return 'Add New Asset';
      default:
        return 'Add New Asset';
    }
  };

  const renderForm = () => {
    switch (formType) {
      case 'server':
        return (
          <ServerForm
            onSuccess={handleSuccess}
            onCancel={handleCancel}
          />
        );
      case 'simple':
        return (
          <SimpleAssetForm
            onSuccess={handleSuccess}
            onCancel={handleCancel}
          />
        );
      default:
        return (
          <AddAssetForm
            onSuccess={handleSuccess}
            onCancel={handleCancel}
          />
        );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={formType === 'server' ? "sm:max-w-3xl max-h-[90vh] overflow-y-auto" : "sm:max-w-md"}>
        <DialogHeader>
          <DialogTitle>{getDialogTitle()}</DialogTitle>
        </DialogHeader>
        {renderForm()}
      </DialogContent>
    </Dialog>
  );
};

export default AddAssetDialog;
