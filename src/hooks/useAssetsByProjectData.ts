
import { useMemo, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchAssets } from '@/services/assetApi';
import { fetchProjects } from '@/services/projectApi';
import { Asset, Project } from '@/types/asset';

export const useAssetsByProjectData = () => {
  // Fetch both assets and projects
  const { data: assets = [], isLoading: assetsLoading, refetch: refetchAssets } = useQuery({
    queryKey: ['assets'],
    queryFn: fetchAssets,
  });

  const { data: projects = [], isLoading: projectsLoading, refetch: refetchProjects } = useQuery({
    queryKey: ['projects'],
    queryFn: fetchProjects,
  });

  const isLoading = assetsLoading || projectsLoading;

  // Listen for project manager updates
  useEffect(() => {
    const handleProjectManagerUpdate = () => {
      console.log('Project manager updated, refreshing data...');
      refetchProjects();
      refetchAssets();
    };

    window.addEventListener('projectManagerUpdated', handleProjectManagerUpdate);
    window.addEventListener('projectUpdated', handleProjectManagerUpdate);
    
    return () => {
      window.removeEventListener('projectManagerUpdated', handleProjectManagerUpdate);
      window.removeEventListener('projectUpdated', handleProjectManagerUpdate);
    };
  }, [refetchProjects, refetchAssets]);

  // Create project name to manager mapping
  const projectManagerMap = useMemo(() => {
    return projects.reduce((acc: Record<string, string>, project: Project) => {
      acc[project.name] = project.manager || 'Non assigné';
      return acc;
    }, {});
  }, [projects]);

  const processedData = useMemo(() => {
    if (!assets.length || !projects.length) {
      return {
        assetsByProject: {},
        chartData: [],
        cpuChartData: [],
        ramChartData: [],
        hasData: false,
        totalAssets: 0,
        totalCPU: 0,
        totalRAM: 0
      };
    }

    // Group assets by project
    const assetsByProject: Record<string, { count: number; manager: string; cpu: number; ram: number; }> = {};
    
    assets.forEach((asset: Asset) => {
      let projectName = 'Non assigné';
      
      // Get project name from asset
      if (asset.project) {
        if (typeof asset.project === 'string') {
          projectName = asset.project;
        } else if (asset.project.name) {
          projectName = asset.project.name;
        }
      } else if (asset.projectName) {
        projectName = asset.projectName;
      }

      // Initialize project entry if it doesn't exist
      if (!assetsByProject[projectName]) {
        assetsByProject[projectName] = {
          count: 0,
          manager: projectManagerMap[projectName] || 'Non assigné',
          cpu: 0,
          ram: 0
        };
      }

      // Increment counts and resources
      assetsByProject[projectName].count++;
      assetsByProject[projectName].cpu += asset.resources?.cpu || 0;
      assetsByProject[projectName].ram += asset.resources?.ram || 0;
    });

    console.log('Processed assets by project with updated managers:', assetsByProject);

    // Create chart data
    const chartData = Object.entries(assetsByProject)
      .filter(([_, data]) => data.count > 0)
      .map(([name, data]) => ({
        name: name.length > 15 ? `${name.substring(0, 15)}...` : name,
        fullName: name,
        value: data.count
      }));

    const cpuChartData = Object.entries(assetsByProject)
      .filter(([_, data]) => data.cpu > 0)
      .map(([name, data]) => ({
        name: name.length > 15 ? `${name.substring(0, 15)}...` : name,
        fullName: name,
        cpu: data.cpu
      }));

    const ramChartData = Object.entries(assetsByProject)
      .filter(([_, data]) => data.ram > 0)
      .map(([name, data]) => ({
        name: name.length > 15 ? `${name.substring(0, 15)}...` : name,
        fullName: name,
        ram: data.ram
      }));

    const totalAssets = Object.values(assetsByProject).reduce((sum, data) => sum + data.count, 0);
    const totalCPU = Object.values(assetsByProject).reduce((sum, data) => sum + data.cpu, 0);
    const totalRAM = Object.values(assetsByProject).reduce((sum, data) => sum + data.ram, 0);

    return {
      assetsByProject,
      chartData,
      cpuChartData,
      ramChartData,
      hasData: chartData.length > 0,
      totalAssets,
      totalCPU,
      totalRAM
    };
  }, [assets, projects, projectManagerMap]);

  return {
    ...processedData,
    isLoading
  };
};
