
import React from 'react';
import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';

interface MaintenanceFormActionsProps {
  onCancel?: () => void;
  submitLabel?: string;
}

const MaintenanceFormActions: React.FC<MaintenanceFormActionsProps> = ({ 
  onCancel,
  submitLabel = "Schedule Maintenance"
}) => {
  return (
    <DialogFooter>
      {onCancel && (
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      )}
      <Button type="submit">{submitLabel}</Button>
    </DialogFooter>
  );
};

export default MaintenanceFormActions;
