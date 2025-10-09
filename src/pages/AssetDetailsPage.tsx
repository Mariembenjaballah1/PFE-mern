
import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchAssetById } from '@/services/assetApi';
import DashboardLayout from '@/components/DashboardLayout';
import { useToast } from '@/hooks/use-toast';
import AssetDetailsHeader from '@/components/assets/details/AssetDetailsHeader';
import AssetDetailsCard from '@/components/assets/details/AssetDetailsCard';
import AssetDetailsActions from '@/components/assets/details/AssetDetailsActions';
import AssetDetailsLoading from '@/components/assets/details/AssetDetailsLoading';
import AssetDetailsNotFound from '@/components/assets/details/AssetDetailsNotFound';
import { useAssetDetailsHandlers } from '@/hooks/useAssetDetailsHandlers';

const AssetDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();

  // Fetch asset details
  const { data: asset, isLoading, error } = useQuery({
    queryKey: ['asset', id],
    queryFn: () => fetchAssetById(id as string),
    meta: {
      onError: () => {
        toast({
          title: "Error loading asset details",
          description: "Using mock data instead. Please check your connection.",
          variant: "destructive"
        });
      }
    }
  });

  const {
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
  } = useAssetDetailsHandlers(asset, id as string);

  if (isLoading) {
    return <AssetDetailsLoading />;
  }
  
  if (!asset) {
    return <AssetDetailsNotFound />;
  }

  const projectDisplayName = getProjectDisplayName(asset.project);
  
  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <AssetDetailsHeader
          asset={asset}
          editDialogOpen={editDialogOpen}
          setEditDialogOpen={setEditDialogOpen}
          onEditSuccess={handleEditSuccess}
          onDeleteAsset={handleDeleteAsset}
        />
        
        <AssetDetailsCard
          asset={asset}
          projectDisplayName={projectDisplayName}
        />

        <AssetDetailsActions
          asset={asset}
          projectDisplayName={projectDisplayName}
          assignDialogOpen={assignDialogOpen}
          setAssignDialogOpen={setAssignDialogOpen}
          projectDialogOpen={projectDialogOpen}
          setProjectDialogOpen={setProjectDialogOpen}
          onAssignSuccess={handleAssignSuccess}
          onProjectSuccess={handleProjectSuccess}
        />
      </div>
    </DashboardLayout>
  );
};

export default AssetDetailsPage;
