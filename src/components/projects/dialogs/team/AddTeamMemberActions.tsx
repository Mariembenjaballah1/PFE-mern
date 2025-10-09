
import React from 'react';
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";

interface AddTeamMemberActionsProps {
  onCancel: () => void;
  onAddToTeam: () => void;
  selectedUser: any;
  isAdding: boolean;
}

export const AddTeamMemberActions: React.FC<AddTeamMemberActionsProps> = ({
  onCancel,
  onAddToTeam,
  selectedUser,
  isAdding
}) => {
  return (
    <DialogFooter>
      <Button variant="outline" onClick={onCancel}>
        Cancel
      </Button>
      <Button 
        onClick={onAddToTeam} 
        disabled={!selectedUser || isAdding}
      >
        {isAdding ? 'Adding...' : 'Add to Team'}
      </Button>
    </DialogFooter>
  );
};
