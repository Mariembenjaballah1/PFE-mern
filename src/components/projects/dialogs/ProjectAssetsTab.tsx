
import React, { useState } from 'react';
import { Project, Asset } from '@/types/asset';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';
import { ProjectAssetsSummary } from './ProjectAssetsSummary';
import { ProjectAssetsMockAlert } from './ProjectAssetsMockAlert';
import { ProjectAssetsChart } from './ProjectAssetsChart';
import { ProjectAssetsTable } from './ProjectAssetsTable';
import AllocateAssetsDialog from './AllocateAssetsDialog';
import { isMockProject } from '../utils/projectUtils';
import { useToast } from '@/hooks/use-toast';

interface ProjectAssetsTabProps {
  project: Project;
  assets: Asset[];
  isLoading: boolean;
}

export const ProjectAssetsTab: React.FC<ProjectAssetsTabProps> = ({
  project,
  assets,
  isLoading
}) => {
  const [showAllocateDialog, setShowAllocateDialog] = useState(false);
  const { toast } = useToast();

  const handleAllocateAssets = () => {
    if (isMockProject(project.id)) {
      toast({
        title: "Cannot Allocate Assets",
        description: "This is demo data and cannot be modified. Create a new project to test asset allocation.",
        variant: "destructive"
      });
      return;
    }
    setShowAllocateDialog(true);
  };

  return (
    <>
      <div className="space-y-6">
        {/* Header with Allocate Assets button */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium">Project Assets</h3>
            <p className="text-sm text-muted-foreground">
              Manage asset assignments and resource allocations for this project
            </p>
          </div>
          <Button onClick={handleAllocateAssets} className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Allocate Assets
          </Button>
        </div>

        <ProjectAssetsSummary 
          project={project} 
          assets={assets} 
          isLoading={isLoading} 
        />

        <ProjectAssetsMockAlert projectId={project.id} />
        
        <ProjectAssetsChart 
          assets={assets} 
          projectId={project.id} 
        />
        
        <ProjectAssetsTable 
          assets={assets} 
          isLoading={isLoading} 
          projectId={project.id} 
        />
      </div>

      <AllocateAssetsDialog
        project={project}
        open={showAllocateDialog}
        onOpenChange={setShowAllocateDialog}
        currentAssets={assets}
      />
    </>
  );
};
