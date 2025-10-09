
import React, { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, User } from "lucide-react";
import { Project } from '@/types/asset';
import { updateProject } from '@/services/projectApi';
import { updateAssetsForProjectManager } from '@/services/assets/assetProjectOperations';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchProjects } from '@/services/projectApi';
import { fetchUsers } from '@/services/userApi';

interface ProjectManagerChangeDialogProps {
  project: Project | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export const ProjectManagerChangeDialog: React.FC<ProjectManagerChangeDialogProps> = ({
  project,
  open,
  onOpenChange,
  onSuccess
}) => {
  const [newManagerId, setNewManagerId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch all projects to check for duplicate managers
  const { data: projects = [] } = useQuery({
    queryKey: ['projects'],
    queryFn: fetchProjects,
    enabled: open
  });

  // Fetch all users who can be project managers
  const { data: users = [], isLoading: usersLoading } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
    enabled: open
  });

  // Filter users who can be project managers (ADMIN, TECHNICIAN roles)
  const potentialManagers = users.filter(user => 
    ['ADMIN', 'TECHNICIAN'].includes(user.role) && user.status === 'active'
  );

  const selectedManager = potentialManagers.find(user => user._id === newManagerId);

  const handleConfirm = async () => {
    if (!project || !newManagerId || !selectedManager) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un gestionnaire",
        variant: "destructive"
      });
      return;
    }

    // Check if another project already has this manager
    const existingProject = projects.find(p => 
      p.id !== project.id && 
      p.manager?.toLowerCase().trim() === selectedManager.name.toLowerCase().trim()
    );

    if (existingProject) {
      toast({
        title: "Gestionnaire déjà assigné",
        description: `${selectedManager.name} gère déjà le projet "${existingProject.name}". Un gestionnaire ne peut gérer qu'un seul projet à la fois.`,
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Update the project manager
      await updateProject(project.id, { manager: selectedManager.name });
      
      // Update all assets assigned to this project
      await updateAssetsForProjectManager({
        projectId: project.id,
        projectName: project.name,
        newManager: selectedManager.name
      });
      
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['assets'] });
      queryClient.invalidateQueries({ queryKey: ['assetsByProject'] });
      
      // Dispatch custom events to notify other components
      window.dispatchEvent(new CustomEvent('projectManagerUpdated', {
        detail: { projectId: project.id, newManager: selectedManager.name }
      }));
      
      toast({
        title: "Succès",
        description: `Gestionnaire du projet "${project.name}" changé vers "${selectedManager.name}". Tous les assets associés ont été mis à jour.`
      });
      
      setNewManagerId('');
      onOpenChange(false);
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Error updating project manager:', error);
      toast({
        title: "Erreur",
        description: "Impossible de changer le gestionnaire de projet",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const duplicateManager = selectedManager ? projects.find(p => 
    p.id !== project?.id && 
    p.manager?.toLowerCase().trim() === selectedManager.name.toLowerCase().trim()
  ) : null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Changer le Gestionnaire
          </AlertDialogTitle>
          <AlertDialogDescription>
            Voulez-vous changer le gestionnaire du projet "{project?.name}" ?
            Cette action mettra également à jour tous les assets associés.
          </AlertDialogDescription>
        </AlertDialogHeader>
        
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
            <Select
              value={newManagerId}
              onValueChange={setNewManagerId}
              disabled={isSubmitting || usersLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un gestionnaire" />
              </SelectTrigger>
              <SelectContent>
                {potentialManagers.map((user) => (
                  <SelectItem key={user._id} value={user._id}>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {user.role} - {user.department}
                        </div>
                      </div>
                    </div>
                  </SelectItem>
                ))}
                {potentialManagers.length === 0 && !usersLoading && (
                  <SelectItem value="" disabled>
                    Aucun gestionnaire disponible
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          {duplicateManager && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                {selectedManager?.name} gère déjà le projet "{duplicateManager.name}". 
                Un gestionnaire ne peut gérer qu'un seul projet à la fois.
              </AlertDescription>
            </Alert>
          )}
        </div>
        
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isSubmitting}>Annuler</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleConfirm}
            disabled={isSubmitting || !newManagerId || !!duplicateManager || usersLoading}
          >
            {isSubmitting ? 'Changement...' : 'Confirmer'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
