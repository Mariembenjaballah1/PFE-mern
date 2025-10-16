
import { Asset } from '@/types/asset';

export const calculateAssetsByCategory = (assets: Asset[]): Record<string, number> => {
  const counts: Record<string, number> = {};
  
  assets?.forEach(asset => {
    // Only count assets with valid categories, filter out empty, undefined, or "Unknown"
    const category = asset.category?.trim();
    if (category && category !== 'Unknown' && category !== 'Uncategorized' && category !== '') {
      counts[category] = (counts[category] || 0) + 1;
    }
  });
  
  return counts;
};

export const calculateAssetsByStatus = (assets: Asset[]): Record<string, number> => {
  const counts: Record<string, number> = {};
  
  assets?.forEach(asset => {
    // Only count assets with valid status, filter out empty, undefined, or "unknown"
    const status = asset.status?.trim();
    if (status && status !== 'unknown' && status !== 'Unknown' && status !== '') {
      // Capitalize first letter for display
      const displayStatus = status.charAt(0).toUpperCase() + status.slice(1);
      counts[displayStatus] = (counts[displayStatus] || 0) + 1;
    }
  });
  
  return counts;
};

export const calculateAssetsByProject = (assets: Asset[]): Record<string, number> => {
  const counts: Record<string, number> = {};
  
  assets?.forEach(asset => {
    const projectName = getProjectName(asset);
    
    // Only count assets with valid project names, filter out "Unknown" or "Unassigned"
    if (projectName && projectName !== 'Unknown' && projectName !== 'Unassigned' && projectName !== '') {
      counts[projectName] = (counts[projectName] || 0) + 1;
    }
  });
  
  return counts;
};

export const getProjectName = (asset: Asset): string => {
  // Check multiple possible project name fields
  if (asset.projectName?.trim()) {
    return asset.projectName.trim();
  }
  
  // Handle project as object with name property
  if (asset.project && typeof asset.project === 'object' && 'name' in asset.project && asset.project.name?.trim()) {
    return asset.project.name.trim();
  }
  
  // Check if project is a string (in case it's stored as just the name)
  if (typeof asset.project === 'string' && asset.project.trim()) {
    return asset.project.trim();
  }
  
  return ''; // Return empty string instead of "Unknown"
};
