
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import AssignAssetForm from '@/components/assets/AssignAssetForm';
import AssignProjectForm from '@/components/assets/AssignProjectForm';
import ChangeEnvironmentDialog from '@/components/assets/ChangeEnvironmentDialog';
import { User, Folder, Settings } from 'lucide-react';
import { Asset } from '@/types/asset';

interface AssetDetailsActionsProps {
  asset: Asset;
  projectDisplayName: string;
  assignDialogOpen: boolean;
  setAssignDialogOpen: (open: boolean) => void;
  projectDialogOpen: boolean;
  setProjectDialogOpen: (open: boolean) => void;
  onAssignSuccess: () => void;
  onProjectSuccess: () => void;
}

const AssetDetailsActions: React.FC<AssetDetailsActionsProps> = ({
  asset,
  projectDisplayName,
  assignDialogOpen,
  setAssignDialogOpen,
  projectDialogOpen,
  setProjectDialogOpen,
  onAssignSuccess,
  onProjectSuccess
}) => {
  const navigate = useNavigate();
  const [environmentDialogOpen, setEnvironmentDialogOpen] = useState(false);

  const handleGoBack = () => {
    navigate('/assets');
  };

  const handleEnvironmentSuccess = () => {
    // Trigger a refresh of the asset data
    onAssignSuccess(); // Reuse the existing success handler for consistency
  };

  return (
    <div className="flex justify-between pt-4">
      <Button variant="outline" onClick={handleGoBack}>
        Back to List
      </Button>
      
      <div className="flex space-x-2">
        <Dialog open={projectDialogOpen} onOpenChange={setProjectDialogOpen}>
          <Button 
            variant="outline"
            onClick={() => setProjectDialogOpen(true)}
            className="flex items-center gap-2"
          >
            <Folder className="h-4 w-4" />
            {projectDisplayName ? 'Change Project' : 'Assign to Project'}
          </Button>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Assign to Project</DialogTitle>
              <DialogDescription>
                Assign this asset to a project for better organization
              </DialogDescription>
            </DialogHeader>
            <AssignProjectForm
              asset={asset}
              onCancel={() => setProjectDialogOpen(false)}
              onSuccess={onProjectSuccess}
            />
          </DialogContent>
        </Dialog>

        <Button 
          variant="outline"
          onClick={() => setEnvironmentDialogOpen(true)}
          className="flex items-center gap-2"
        >
          <Settings className="h-4 w-4" />
          Change Environment
        </Button>

        <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
          <Button 
            onClick={() => setAssignDialogOpen(true)}
            className="flex items-center gap-2"
          >
            <User className="h-4 w-4" />
            {asset.assignedTo ? 'Reassign Asset' : 'Assign Asset'}
          </Button>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Assign Asset</DialogTitle>
              <DialogDescription>
                Assign this asset to a user or department
              </DialogDescription>
            </DialogHeader>
            <AssignAssetForm
              asset={asset}
              onCancel={() => setAssignDialogOpen(false)}
              onSuccess={onAssignSuccess}
            />
          </DialogContent>
        </Dialog>
      </div>

      <ChangeEnvironmentDialog
        asset={asset}
        open={environmentDialogOpen}
        onOpenChange={setEnvironmentDialogOpen}
        onSuccess={handleEnvironmentSuccess}
      />
    </div>
  );
};

export default AssetDetailsActions;
