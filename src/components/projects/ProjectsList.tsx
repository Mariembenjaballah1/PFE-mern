
import React, { useState, useEffect } from 'react';
import { Project } from '@/types/asset';
import { ProjectCard } from './list/ProjectCard';
import { ProjectsListLoading } from './list/ProjectsListLoading';
import { ProjectsListEmpty } from './list/ProjectsListEmpty';
import { useProjectsListHandlers } from './list/useProjectsListHandlers';
import { EditProjectDialog } from './EditProjectDialog';
import { ProjectDetailsDialog } from './dialogs/ProjectDetailsDialog';
import { isMockProject } from './utils/projectUtils';
import { useToast } from '@/hooks/use-toast';

interface ProjectsListProps {
  projects: Project[];
  isLoading: boolean;
  onSuccess: () => void;
}

export const ProjectsList: React.FC<ProjectsListProps> = ({ 
  projects, 
  isLoading, 
  onSuccess 
}) => {
  const [displayProjects, setDisplayProjects] = useState<Project[]>(projects);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [viewingProject, setViewingProject] = useState<Project | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const { toast } = useToast();
  
  const {
    handleDeleteProject,
    isDeleting
  } = useProjectsListHandlers({ onSuccess });

  // Update display projects when props change
  useEffect(() => {
    setDisplayProjects(projects);
  }, [projects]);

  // Listen for project manager updates
  useEffect(() => {
    const handleProjectManagerUpdate = (event: CustomEvent) => {
      const { projectId, managerName } = event.detail;
      
      setDisplayProjects(prevProjects => 
        prevProjects.map(project => 
          project.id === projectId 
            ? { ...project, manager: managerName }
            : project
        )
      );
    };

    window.addEventListener('projectManagerUpdated', handleProjectManagerUpdate as EventListener);
    
    return () => {
      window.removeEventListener('projectManagerUpdated', handleProjectManagerUpdate as EventListener);
    };
  }, []);

  const handleEditProject = (project: Project) => {
    if (isMockProject(project.id)) {
      toast({
        title: "Cannot Edit Mock Project",
        description: "This is demo data and cannot be edited. Create a new project to test editing functionality.",
        variant: "destructive"
      });
      return;
    }

    setEditingProject(project);
    setIsEditDialogOpen(true);
  };

  const handleViewProject = (project: Project) => {
    setViewingProject(project);
    setIsDetailsDialogOpen(true);
  };

  const handleEditSuccess = () => {
    onSuccess();
    setIsEditDialogOpen(false);
    setEditingProject(null);
  };

  if (isLoading) {
    return <ProjectsListLoading />;
  }

  if (displayProjects.length === 0) {
    return <ProjectsListEmpty />;
  }

  return (
    <>
      <div className="space-y-4">
        {displayProjects.map((project, index) => (
          <ProjectCard
            key={project.id}
            project={project}
            index={index}
            onEdit={handleEditProject}
            onDelete={handleDeleteProject}
            onView={handleViewProject}
            isDeleting={isDeleting === project.id}
          />
        ))}
      </div>

      <EditProjectDialog
        project={editingProject}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSuccess={handleEditSuccess}
      />

      <ProjectDetailsDialog
        project={viewingProject}
        open={isDetailsDialogOpen}
        onOpenChange={setIsDetailsDialogOpen}
        onEdit={handleEditProject}
      />
    </>
  );
};
