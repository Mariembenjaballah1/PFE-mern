
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { deleteAsset } from '@/services/assetApi';
import { useToast } from '@/hooks/use-toast';
import { Asset } from '@/types/asset';

export const useAssetDetailsHandlers = (asset: Asset | undefined, id: string) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);  
  const [projectDialogOpen, setProjectDialogOpen] = useState(false);

  const handleDeleteAsset = async () => {
    if (window.confirm("Are you sure you want to delete this asset? This action cannot be undone.")) {
      try {
        // Use the correct ID (either id or _id)
        const assetId = asset?.id || asset?._id || id;
        await deleteAsset(assetId);
        toast({
          title: "Asset deleted",
          description: "Asset has been successfully deleted",
        });
        navigate('/assets');
      } catch (error) {
        console.error('Error deleting asset:', error);
        toast({
          title: "Delete failed",
          description: "There was an error deleting the asset.",
          variant: "destructive"
        });
      }
    }
  };
  
  const handleAssignSuccess = () => {
    toast({
      title: "Success",
      description: `Asset ${asset?.name} has been assigned successfully.`
    });
    queryClient.invalidateQueries({ queryKey: ['asset', id] });
    queryClient.invalidateQueries({ queryKey: ['assets'] });
    setAssignDialogOpen(false);
  };

  const handleProjectSuccess = () => {
    toast({
      title: "Success",
      description: `Asset ${asset?.name} has been assigned to project successfully.`
    });
    queryClient.invalidateQueries({ queryKey: ['asset', id] });
    queryClient.invalidateQueries({ queryKey: ['assets'] });
    setProjectDialogOpen(false);
  };

  const handleEditSuccess = () => {
    setEditDialogOpen(false);
    queryClient.invalidateQueries({ queryKey: ['asset', id] });
    queryClient.invalidateQueries({ queryKey: ['assets'] });
  };

  // Helper function to safely get project name
  const getProjectDisplayName = (project: any): string => {
    if (!project) return '';
    if (typeof project === 'string') return project;
    if (typeof project === 'object' && project !== null) {
      if (project.name) return project.name;
      if (project._id) return project._id;
    }
    return String(project);
  };

  return {
    editDialogOpen,
    setEditDialogOpen,
    assignDialogOpen,
    setAssignDialogOpen,
    projectDialogOpen,
    setProjectDialogOpen,
    handleDeleteAsset,
    handleAssignSuccess,
    handleProjectSuccess,
    handleEditSuccess,
    getProjectDisplayName
  };
};
