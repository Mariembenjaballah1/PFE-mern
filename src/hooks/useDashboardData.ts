
import { useQuery } from '@tanstack/react-query';
import { fetchAssets } from '@/services/assets/assetBasicOperations';
import { fetchProjects } from '@/services/projectApi';
import { fetchMaintenanceTasks } from '@/services/maintenanceApi';
import { getStatsTrends } from '@/services/statsService';

export const useDashboardData = () => {
  const { data: assets = [], isLoading: assetsLoading, error: assetsError } = useQuery({
    queryKey: ['assets'],
    queryFn: fetchAssets
  });

  const { data: projects = [], isLoading: projectsLoading, error: projectsError } = useQuery({
    queryKey: ['projects'],
    queryFn: fetchProjects
  });

  const { data: maintenanceTasks = [], isLoading: maintenanceLoading, error: maintenanceError } = useQuery({
    queryKey: ['maintenance-tasks'],
    queryFn: fetchMaintenanceTasks
  });

  const { data: stats, isLoading: statsLoading, error: statsError } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: getStatsTrends
  });

  const hasError = !!(assetsError || projectsError || maintenanceError || statsError);
  const isLoading = assetsLoading || projectsLoading || maintenanceLoading || statsLoading;

  return {
    assets,
    projects,
    maintenanceTasks,
    maintenance: maintenanceTasks, // Alias for compatibility
    stats,
    isLoading,
    hasError,
    errors: {
      assets: assetsError,
      projects: projectsError,
      maintenance: maintenanceError,
      stats: statsError
    }
  };
};
