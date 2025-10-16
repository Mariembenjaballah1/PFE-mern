
import React from 'react';
import { Button } from '@/components/ui/button';

interface DialogActionsProps {
  showPreview: boolean;
  parsedDataLength: number;
  isUploading: boolean;
  onCancel: () => void;
  onUpload: () => void;
}

const DialogActions: React.FC<DialogActionsProps> = ({
  showPreview,
  parsedDataLength,
  isUploading,
  onCancel,
  onUpload,
}) => {
  return (
    <div className="flex justify-end gap-2">
      <Button variant="outline" onClick={onCancel} disabled={isUploading}>
        Cancel
      </Button>
      <Button 
        onClick={onUpload} 
        disabled={!showPreview || parsedDataLength === 0 || isUploading}
      >
        {isUploading ? 'Adding Servers...' : `Add ${parsedDataLength} Servers`}
      </Button>
    </div>
  );
};

export default DialogActions;
