
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, User } from "lucide-react";
import { Project } from '@/types/asset';
import { updateProject } from '@/services/projectApi';
import { updateAssetsForProjectManager } from '@/services/assets/assetProjectOperations';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchProjects } from '@/services/projectApi';

interface ProjectManagerUpdateDialogProps {
  project: Project | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export const ProjectManagerUpdateDialog: React.FC<ProjectManagerUpdateDialogProps> = ({
  project,
  open,
  onOpenChange,
  onSuccess
}) => {
  const [newManager, setNewManager] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch all projects to check for duplicate managers
  const { data: projects = [] } = useQuery({
    queryKey: ['projects'],
    queryFn: fetchProjects,
    enabled: open
  });

  const handleSubmit = async () => {
    if (!project || !newManager.trim()) {
      toast({
        title: "Erreur",
        description: "Le nom du gestionnaire de projet est requis",
        variant: "destructive"
      });
      return;
    }

    // Check if another project already has this manager
    const existingProject = projects.find(p => 
      p.id !== project.id && 
      p.manager?.toLowerCase().trim() === newManager.toLowerCase().trim()
    );

    if (existingProject) {
      toast({
        title: "Gestionnaire déjà assigné",
        description: `${newManager} est déjà gestionnaire du projet "${existingProject.name}". Un gestionnaire ne peut gérer qu'un seul projet à la fois.`,
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Update the project manager
      await updateProject(project.id, { manager: newManager.trim() });
      
      // Update all assets assigned to this project
      await updateAssetsForProjectManager({
        projectId: project.id,
        projectName: project.name,
        newManager: newManager.trim()
      });
      
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['assets'] });
      queryClient.invalidateQueries({ queryKey: ['assetsByProject'] });
      
      // Dispatch custom events to notify other components
      window.dispatchEvent(new CustomEvent('projectManagerUpdated', {
        detail: { projectId: project.id, newManager: newManager.trim() }
      }));
      window.dispatchEvent(new CustomEvent('projectUpdated', {
        detail: { projectId: project.id, newManager: newManager.trim() }
      }));
      
      toast({
        title: "Succès",
        description: `Gestionnaire du projet "${project.name}" mis à jour vers "${newManager}". Les assets associés ont été mis à jour automatiquement.`
      });
      
      setNewManager('');
      onOpenChange(false);
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Error updating project manager:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le gestionnaire de projet",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const duplicateManager = newManager.trim() ? projects.find(p => 
    p.id !== project?.id && 
    p.manager?.toLowerCase().trim() === newManager.toLowerCase().trim()
  ) : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Changer le Gestionnaire de Projet
          </DialogTitle>
          <DialogDescription>
            Assignez un nouveau gestionnaire au projet "{project?.name}". 
            Chaque gestionnaire ne peut gérer qu'un seul projet à la fois.
            Les assets associés seront automatiquement mis à jour.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current-manager">Gestionnaire Actuel</Label>
            <Input 
              id="current-manager"
              value={project?.manager || 'Non assigné'} 
              disabled 
              className="bg-muted"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="new-manager">Nouveau Gestionnaire</Label>
            <Input
              id="new-manager"
              placeholder="Nom du nouveau gestionnaire"
              value={newManager}
              onChange={(e) => setNewManager(e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          {duplicateManager && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                {newManager} gère déjà le projet "{duplicateManager.name}". 
                Un gestionnaire ne peut gérer qu'un seul projet à la fois.
              </AlertDescription>
            </Alert>
          )}
        </div>
        
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Annuler
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={isSubmitting || !newManager.trim() || !!duplicateManager}
          >
            {isSubmitting ? 'Mise à jour...' : 'Mettre à jour'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
