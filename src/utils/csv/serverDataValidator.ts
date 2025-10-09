
import { Project } from '@/types/asset';
import { extractServerName, extractLocation, extractProjectName, findMatchingProject } from './dataExtractors';
import { calculateCpuCores, calculateRamMB, calculateDiskMB } from './resourceCalculators';
import { buildVmInfo, buildSpecs, buildAdditionalData } from './vmInfoBuilder';

export interface ValidatedServerData {
  name: string;
  category: string;
  status: 'operational' | 'maintenance' | 'repair' | 'retired';
  location: string;
  purchaseDate: string;
  assignedTo: string;
  project?: string;
  projectName: string;
  resources: {
    cpu: number;
    ram: number;
    disk: number;
  };
  vmInfo: Record<string, any>;
  specs: Record<string, any>;
  additionalData: Record<string, any>;
}

export const validateServerData = (rawData: any, existingProjects: Project[]): ValidatedServerData => {
  console.log('=== VALIDATING SERVER DATA FROM CSV ===');
  console.log('Raw CSV data keys:', Object.keys(rawData));
  console.log('Raw CSV data:', rawData);
  
  // Extract basic information
  const name = extractServerName(rawData);
  const location = extractLocation(rawData);
  const projectName = extractProjectName(rawData);
  
  // Find matching project
  const matchingProject = findMatchingProject(projectName, existingProjects);
  
  // Calculate resources
  const cpuCores = calculateCpuCores(rawData);
  const ramMB = calculateRamMB(rawData);
  const diskMB = calculateDiskMB(rawData);
  
  // Build data structures
  const vmInfo = buildVmInfo(rawData);
  const specs = buildSpecs(rawData, name, cpuCores, ramMB, diskMB);
  const additionalData = buildAdditionalData(rawData);
  
  console.log('=== VALIDATION COMPLETE ===');
  console.log('Validated name:', name);
  console.log('Validated location:', location);
  console.log('Validated project:', projectName);
  console.log('Final vmInfo object keys:', Object.keys(vmInfo));
  console.log('Final vmInfo object:', vmInfo);
  console.log('Final specs object keys:', Object.keys(specs));
  console.log('Final specs object:', specs);
  console.log('Final additionalData keys (EXACT CSV FIELDS):', Object.keys(additionalData));
  console.log('Final additionalData object:', additionalData);
  
  return {
    name,
    category: 'Servers',
    status: 'operational',
    location,
    purchaseDate: new Date().toISOString().split('T')[0],
    assignedTo: 'Unassigned',
    project: matchingProject?.id || matchingProject?._id,
    projectName,
    resources: {
      cpu: cpuCores,
      ram: ramMB,
      disk: diskMB
    },
    vmInfo,
    specs,
    additionalData
  };
};
