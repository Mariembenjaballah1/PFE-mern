
import { useState, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchAssets, deleteAsset } from '@/services/assetApi';
import { getAssetCategories, getAssetStatuses, filterAssets } from '@/services/assetService';
import { useToast } from '@/hooks/use-toast';
import { Asset } from '@/types/asset';
import { useLocation } from 'react-router-dom';

export const useAssetData = (currentUser: { name: string; role: string }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all-categories');
  const [filterStatus, setFilterStatus] = useState('all-statuses');
  const [filterProject, setFilterProject] = useState('all-projects');
  const [viewMode, setViewMode] = useState<'all' | 'assigned'>('all');
  const { toast } = useToast();
  const location = useLocation();
  const queryClient = useQueryClient();
  
  // Check if we're viewing a sub-route
  const isSubRoute = location.pathname !== '/assets';
  
  // Prepare params for dynamic data fetching
  const getQueryParams = useCallback(() => {
    const params: Record<string, string> = {};
    
    if (filterCategory !== 'all-categories') {
      params.category = filterCategory;
    }
    
    if (filterStatus !== 'all-statuses') {
      params.status = filterStatus;
    }
    
    if (filterProject !== 'all-projects') {
      params.project = filterProject;
    }
    
    return params;
  }, [filterCategory, filterStatus, filterProject]);

  // Fetch assets data with React Query - only if we're on the main route
  const { data: assets = [], isLoading, error, refetch } = useQuery({
    queryKey: ['assets', getQueryParams()],
    queryFn: fetchAssets,
    // Don't run this query if we're on a sub-route
    enabled: !isSubRoute
  });
  
  // Get categories and statuses for filters
  const { data: categories = [] } = useQuery({
    queryKey: ['assetCategories'],
    queryFn: getAssetCategories
  });
  
  const { data: statuses = [] } = useQuery({
    queryKey: ['assetStatuses'],
    queryFn: getAssetStatuses
  });
  
  // Get projects from assets for filter dropdown
  const projects = [...new Set(
    assets
      .map(asset => {
        if (asset.projectName) return asset.projectName;
        if (typeof asset.project === 'string') return asset.project;
        if (asset.project && typeof asset.project === 'object' && 'name' in asset.project) {
          return asset.project.name;
        }
        return null;
      })
      .filter(project => project !== null)
  )].sort();
  
  // Filter based on search query and project
  const filteredAssets = filterAssets(
    assets, 
    searchQuery,
    '', // Category filtering is now handled at API level
    ''  // Status filtering is now handled at API level
  ).filter(asset => {
    if (filterProject === 'all-projects') return true;
    
    const assetProject = asset.projectName || 
      (typeof asset.project === 'string' ? asset.project : 
       (asset.project && typeof asset.project === 'object' && 'name' in asset.project ? asset.project.name : null));
    
    return assetProject === filterProject;
  });
  
  // Then filter based on assignment if in 'assigned' mode
  const displayedAssets = viewMode === 'assigned' 
    ? filteredAssets.filter(asset => asset.assignedTo === currentUser.name)
    : filteredAssets;

  // Handler for refreshing data
  const handleRefresh = useCallback(() => {
    // Invalidate and refetch both assets and categories
    queryClient.invalidateQueries({ queryKey: ['assets'] });
    queryClient.invalidateQueries({ queryKey: ['assetCategories'] });
    queryClient.invalidateQueries({ queryKey: ['assetStatuses'] });
  }, [queryClient]);

  const handleDeleteAsset = async (assetId: string) => {
    try {
      await deleteAsset(assetId);
      toast({
        title: "Success",
        description: "Asset deleted successfully"
      });
      refetch();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to delete asset",
        variant: "destructive"
      });
    }
  };
  
  return {
    searchQuery,
    setSearchQuery,
    filterCategory,
    setFilterCategory,
    filterStatus,
    setFilterStatus,
    filterProject,
    setFilterProject,
    viewMode,
    setViewMode,
    assets: displayedAssets,
    isLoading,
    error,
    categories,
    statuses,
    projects,
    handleRefresh,
    handleDeleteAsset,
    isSubRoute
  };
};
