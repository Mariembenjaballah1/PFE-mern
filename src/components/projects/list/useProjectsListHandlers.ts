
import { useState } from 'react';
import { Project } from '@/types/asset';
import { deleteProject } from '@/services/projectApi';
import { useToast } from '@/hooks/use-toast';
import { isMockProject, hasValidId } from '../utils/projectUtils';

interface UseProjectsListHandlersParams {
  onSuccess: () => void;
}

export const useProjectsListHandlers = ({ onSuccess }: UseProjectsListHandlersParams) => {
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [viewingProject, setViewingProject] = useState<Project | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const { toast } = useToast();

  const handleDeleteProject = async (project: Project) => {
    try {
      if (!hasValidId(project)) {
        toast({
          title: "Error",
          description: "Cannot delete project: missing or invalid project ID.",
          variant: "destructive"
        });
        return;
      }

      if (isMockProject(project.id)) {
        toast({
          title: "Cannot Delete Mock Project",
          description: "This is demo data and cannot be deleted. Create a new project to test deletion functionality.",
          variant: "destructive"
        });
        return;
      }

      setIsDeleting(project.id);
      await deleteProject(project.id!);
      toast({
        title: "Success",
        description: `Project "${project.name}" has been deleted successfully.`
      });
      onSuccess();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete project. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsDeleting(null);
    }
  };

  const handleEdit = (project: Project) => {
    if (!hasValidId(project)) {
      toast({
        title: "Error",
        description: "Cannot edit project: missing or invalid project ID.",
        variant: "destructive"
      });
      return;
    }

    if (isMockProject(project.id)) {
      toast({
        title: "Cannot Edit Mock Project",
        description: "This is demo data and cannot be edited. Create a new project to test editing functionality.",
        variant: "destructive"
      });
      return;
    }
    setEditingProject(project);
  };

  const handleView = (project: Project) => {
    setViewingProject(project);
  };

  return {
    editingProject,
    setEditingProject,
    viewingProject,
    setViewingProject,
    handleDeleteProject,
    isDeleting,
    handleEdit,
    handleView
  };
};
