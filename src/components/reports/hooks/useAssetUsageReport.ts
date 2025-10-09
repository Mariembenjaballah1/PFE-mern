
import { useQuery } from '@tanstack/react-query';
import { fetchAssets } from '@/services/assetApi';

export const useAssetUsageReport = () => {
  const { data: assets = [], isLoading, error, refetch } = useQuery({
    queryKey: ['assets', 'usage-report'],
    queryFn: async () => {
      console.log('Fetching real-time assets for usage report...');
      const data = await fetchAssets();
      console.log('Dynamic asset data received:', data);
      return data;
    },
    staleTime: 10000, // Consider data stale after 10 seconds
    refetchInterval: 30000, // Auto-refresh every 30 seconds
    refetchOnWindowFocus: true, // Refresh when user focuses window
  });

  // Process the data for the report with real-time calculations
  const reportData = assets.length > 0 ? {
    totalAssets: assets.length,
    categories: assets.reduce((acc: any, asset: any) => {
      const category = asset.category || 'Uncategorized';
      if (!acc[category]) {
        acc[category] = { count: 0, assets: [] };
      }
      acc[category].count++;
      acc[category].assets.push(asset);
      return acc;
    }, {}),
    projects: assets.reduce((acc: any, asset: any) => {
      // Handle both string and object project formats
      let projectName = 'Unassigned';
      if (asset.project) {
        if (typeof asset.project === 'string') {
          projectName = asset.project;
        } else if (asset.project.name) {
          projectName = asset.project.name;
        } else if (asset.project._id) {
          projectName = asset.project._id;
        }
      }
      
      if (!acc[projectName]) {
        acc[projectName] = { count: 0, assets: [] };
      }
      acc[projectName].count++;
      acc[projectName].assets.push(asset);
      return acc;
    }, {}),
    statusDistribution: assets.reduce((acc: any, asset: any) => {
      const status = asset.status || 'unknown';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {}),
    assets: assets
  } : null;

  console.log('Processed dynamic report data:', reportData);

  return {
    reportData,
    isLoading,
    error,
    refetch
  } as const;
};
