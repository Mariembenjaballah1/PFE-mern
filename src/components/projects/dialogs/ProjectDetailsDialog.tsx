
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Project } from '@/types/asset';
import { ProjectOverviewTab } from './ProjectOverviewTab';
import { ProjectAssetsTab } from './ProjectAssetsTab';
import { ProjectTeamTab } from './ProjectTeamTab';
import { useQuery } from '@tanstack/react-query';
import { getProjectAssets } from '@/services/projectApi';
import { isMockProject } from '../utils/projectUtils';
import { useToast } from '@/hooks/use-toast';

interface ProjectDetailsDialogProps {
  project: Project | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit?: (project: Project) => void;
}

export const ProjectDetailsDialog: React.FC<ProjectDetailsDialogProps> = ({ 
  project, 
  open, 
  onOpenChange,
  onEdit
}) => {
  const [activeTab, setActiveTab] = useState("overview");
  const { toast } = useToast();
  
  const { 
    data: assets = [], 
    isLoading: assetsLoading 
  } = useQuery({
    queryKey: ['projectAssets', project?.id],
    queryFn: () => project ? getProjectAssets(project.id) : Promise.resolve([]),
    enabled: !!project
  });

  const handleEditProject = () => {
    if (!project) return;
    
    if (isMockProject(project.id)) {
      toast({
        title: "Cannot Edit Mock Project",
        description: "This is demo data and cannot be edited. Create a new project to test editing functionality.",
        variant: "destructive"
      });
      return;
    }

    if (onEdit) {
      onEdit(project);
      onOpenChange(false);
    }
  };
  
  if (!project) return null;
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            {project.name}
          </DialogTitle>
          <DialogDescription>
            Comprehensive project details, team management, and resource allocations
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              Overview
            </TabsTrigger>
            <TabsTrigger value="team" className="flex items-center gap-2">
              Team
            </TabsTrigger>
            <TabsTrigger value="assets" className="flex items-center gap-2">
              Assets
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4 mt-0">
            <ProjectOverviewTab project={project} assets={assets} />
          </TabsContent>
          
          <TabsContent value="team" className="mt-0">
            <ProjectTeamTab project={project} assets={assets} />
          </TabsContent>
          
          <TabsContent value="assets" className="mt-0">
            <ProjectAssetsTab 
              project={project} 
              assets={assets} 
              isLoading={assetsLoading} 
            />
          </TabsContent>
        </Tabs>
        
        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button onClick={handleEditProject}>
            Edit Project
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
