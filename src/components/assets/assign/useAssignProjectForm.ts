
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { Asset } from '@/types/asset';
import { updateAsset, UpdateAssetData } from '@/services/assets/assetBasicOperations';
import { fetchProjects } from '@/services/projectApi';
import { assignProjectFormSchema, AssignProjectFormValues } from './assignProjectTypes';

interface UseAssignProjectFormProps {
  asset: Asset;
  onSuccess: () => void;
}

export const useAssignProjectForm = ({ asset, onSuccess }: UseAssignProjectFormProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newProject, setNewProject] = useState('');
  const [isAddingNewProject, setIsAddingNewProject] = useState(false);

  // Fetch projects
  const { data: projects = [] } = useQuery({
    queryKey: ['projects'],
    queryFn: fetchProjects,
    staleTime: 60000, // 1 minute
  });

  // Helper function to get project ID as string
  const getProjectId = (project: string | { _id: string; name: string } | null): string => {
    if (!project) return '';
    if (typeof project === 'string') return project;
    return project._id;
  };

  const form = useForm<AssignProjectFormValues>({
    resolver: zodResolver(assignProjectFormSchema),
    defaultValues: {
      project: getProjectId(asset.project)
    },
  });

  const onSubmit = async (data: AssignProjectFormValues) => {
    setIsSubmitting(true);
    try {
      // If adding a new project, use the newProject value
      const projectValue = isAddingNewProject ? newProject : data.project;
      
      // Use the correct asset ID
      const assetId = asset.id || asset._id;
      if (!assetId) {
        throw new Error('Asset ID not found');
      }
      
      const updateData: UpdateAssetData = { 
        id: assetId as string,
        project: projectValue
      };
      
      await updateAsset(updateData);
      
      toast({
        title: 'Success',
        description: `Asset assigned to project "${projectValue}" successfully`,
      });
      onSuccess();
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to assign asset to project',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleAddNewProject = () => {
    setIsAddingNewProject(!isAddingNewProject);
    if (!isAddingNewProject) {
      form.setValue('project', '');
    } else {
      setNewProject('');
    }
  };

  return {
    form,
    projects,
    isSubmitting,
    newProject,
    setNewProject,
    isAddingNewProject,
    onSubmit,
    toggleAddNewProject
  };
};
