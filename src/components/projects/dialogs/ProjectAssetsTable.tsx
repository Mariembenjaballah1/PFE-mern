
import React from 'react';
import { Asset } from '@/types/asset';
import { isMockProject } from '../utils/projectUtils';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { updateAsset } from '@/services/assets/assetBasicOperations';
import { groupAssetsByEnvironment, sortEnvironments } from './assets-table/utils/assetUtils';
import { useExpandedEnvironments } from './assets-table/hooks/useExpandedEnvironments';
import { EmptyAssetsState } from './assets-table/components/EmptyAssetsState';
import { LoadingState } from './assets-table/components/LoadingState';
import { EnvironmentSection } from './assets-table/components/EnvironmentSection';
import { AssetsTableHeader } from './assets-table/components/AssetsTableHeader';

interface ProjectAssetsTableProps {
  assets: Asset[];
  isLoading: boolean;
  projectId: string | undefined;
}

export const ProjectAssetsTable: React.FC<ProjectAssetsTableProps> = ({
  assets,
  isLoading,
  projectId
}) => {
  const { expandedEnvironments, toggleEnvironment } = useExpandedEnvironments();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const isMock = isMockProject(projectId);

  const handleAssetClick = (asset: Asset) => {
    // Handle both _id (MongoDB) and id fields
    const assetId = asset.id || asset._id;
    if (assetId) {
      console.log('Navigating to asset:', assetId);
      navigate(`/assets/${assetId}`);
    } else {
      console.error('Asset ID not found:', asset);
    }
  };

  const handleRemoveFromProject = async (asset: Asset) => {
    if (isMock) {
      toast({
        title: "Cannot Remove Asset",
        description: "This is demo data and cannot be modified. Create a new project to test asset removal.",
        variant: "destructive"
      });
      return;
    }

    try {
      const assetId = asset.id || asset._id;
      if (!assetId) {
        throw new Error('Asset ID not found');
      }

      await updateAsset({
        id: assetId,
        project: null
      });

      toast({
        title: "Asset Removed",
        description: `${asset.name} has been removed from the project.`,
      });

      // Dispatch custom event to refresh project data
      window.dispatchEvent(new CustomEvent('forceProjectRefresh', { 
        detail: { projectId } 
      }));
    } catch (error) {
      console.error('Error removing asset from project:', error);
      toast({
        title: "Error",
        description: "Failed to remove asset from project. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (assets.length === 0) {
    return <EmptyAssetsState isMock={isMock} />;
  }

  // Group assets by environment
  const groupedAssets = groupAssetsByEnvironment(assets);
  const sortedEnvironments = sortEnvironments(Object.keys(groupedAssets));

  return (
    <div className="space-y-6">
      <AssetsTableHeader assetCount={assets.length} />
      
      {sortedEnvironments.map(environment => (
        <EnvironmentSection
          key={environment}
          environment={environment}
          assets={groupedAssets[environment]}
          isExpanded={expandedEnvironments.includes(environment)}
          onToggle={() => toggleEnvironment(environment)}
          onAssetClick={handleAssetClick}
          onRemoveFromProject={handleRemoveFromProject}
        />
      ))}
    </div>
  );
};
