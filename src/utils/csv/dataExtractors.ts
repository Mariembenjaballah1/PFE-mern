
import { Project } from '@/types/asset';
import { findFieldValue } from './fieldMappings';

// Extract server name from CSV data
export const extractServerName = (rawData: any): string => {
  return findFieldValue(rawData, ['VM', 'vm', 'Name', 'name', 'Server Name', 'server_name', 'hostname', 'Hostname'], `Server-${Date.now()}`);
};

// Extract location from CSV data
export const extractLocation = (rawData: any): string => {
  return findFieldValue(rawData, ['Datacenter', 'datacenter', 'Location', 'location', 'Site', 'site'], 'Unknown Location');
};

// Extract project name from CSV data
export const extractProjectName = (rawData: any): string => {
  return findFieldValue(rawData, ['projet', 'Projet', 'Project', 'project', 'Folder', 'folder'], 'Unassigned');
};

// Find matching project from existing projects
export const findMatchingProject = (projectName: string, existingProjects: Project[]) => {
  return existingProjects.find(p => 
    p.name.toLowerCase() === projectName.toLowerCase()
  );
};
