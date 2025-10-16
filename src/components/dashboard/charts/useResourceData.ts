
import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchProjects } from '@/services/projectApi';
import { Asset } from '@/types/asset';

interface ResourceData {
  name: string;
  fullName: string;
  cpuAllocated: number;
  cpuUsed: number;
  cpuPercentage: number;
  ramAllocated: number;
  ramUsed: number;
  ramPercentage: number;
  diskAllocated: number;
  diskUsed: number;
  diskPercentage: number;
  assetCount: number;
}

interface UsageTrend {
  name: string;
  cpu: number;
  ram: number;
  disk: number;
}

export const useResourceData = (assets: Asset[] = []) => {
  // Fetch projects to get project information
  const { data: projects = [] } = useQuery({
    queryKey: ['projects', 'resourceCharts'],
    queryFn: fetchProjects,
  });

  // Calculate real resource data from projects and assets
  const resourceData = useMemo((): ResourceData[] => {
    if (projects.length === 0) {
      return [];
    }

    return projects.map(project => {
      // Find assets assigned to this project
      const projectAssets = assets.filter(asset => {
        const projectName = asset.projectName || 
          (typeof asset.project === 'string' ? asset.project : 
           (asset.project && typeof asset.project === 'object' && 'name' in asset.project ? asset.project.name : null));
        return projectName === project.name;
      });

      // Calculate used resources from assigned assets
      const usedResources = projectAssets.reduce((acc, asset) => ({
        cpu: acc.cpu + (asset.resources?.cpu || 0),
        ram: acc.ram + (asset.resources?.ram || 0),
        disk: acc.disk + (asset.resources?.disk || 0)
      }), { cpu: 0, ram: 0, disk: 0 });

      // Set reasonable allocated values (1.5x used resources as capacity)
      const allocatedResources = {
        cpu: Math.max(usedResources.cpu * 1.5, usedResources.cpu + 10),
        ram: Math.max(usedResources.ram * 1.5, usedResources.ram + 16),
        disk: Math.max(usedResources.disk * 1.5, usedResources.disk + 100)
      };

      // Calculate percentages
      const cpuPercentage = allocatedResources.cpu > 0 ? Math.round((usedResources.cpu / allocatedResources.cpu) * 100) : 0;
      const ramPercentage = allocatedResources.ram > 0 ? Math.round((usedResources.ram / allocatedResources.ram) * 100) : 0;
      const diskPercentage = allocatedResources.disk > 0 ? Math.round((usedResources.disk / allocatedResources.disk) * 100) : 0;

      return {
        name: project.name.length > 12 ? `${project.name.substring(0, 12)}...` : project.name,
        fullName: project.name,
        cpuAllocated: allocatedResources.cpu,
        cpuUsed: usedResources.cpu,
        cpuPercentage,
        ramAllocated: allocatedResources.ram,
        ramUsed: usedResources.ram,
        ramPercentage,
        diskAllocated: allocatedResources.disk,
        diskUsed: usedResources.disk,
        diskPercentage,
        assetCount: projectAssets.length
      };
    }).filter(project => project.assetCount > 0); // Only show projects with assets
  }, [projects, assets]);

  // Calculate usage trends over time (simulated monthly data based on current usage)
  const usageTrends = useMemo((): UsageTrend[] => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    
    if (resourceData.length === 0) {
      return [];
    }

    // Calculate average usage percentage across all projects
    const avgCpuPercentage = resourceData.reduce((sum, project) => sum + project.cpuPercentage, 0) / resourceData.length;
    const avgRamPercentage = resourceData.reduce((sum, project) => sum + project.ramPercentage, 0) / resourceData.length;
    const avgDiskPercentage = resourceData.reduce((sum, project) => sum + project.diskPercentage, 0) / resourceData.length;
    
    return months.map((month, index) => {
      // Create trend variations around current usage
      const timeVariation = Math.sin(index * 0.3) * 5;
      const randomVariation = (Math.random() - 0.5) * 3;
      
      const cpu = Math.max(1, avgCpuPercentage + timeVariation + randomVariation);
      const ram = Math.max(1, avgRamPercentage + timeVariation + randomVariation);
      const disk = Math.max(1, avgDiskPercentage + timeVariation + randomVariation);

      return {
        name: month,
        cpu: Math.round(cpu),
        ram: Math.round(ram),
        disk: Math.round(disk)
      };
    });
  }, [resourceData]);

  return {
    resourceData,
    usageTrends,
    projects,
    hasData: assets.length > 0 && projects.length > 0 && resourceData.length > 0
  };
};
