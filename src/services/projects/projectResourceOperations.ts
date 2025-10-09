
import api from '../apiClient';
import { Asset } from '@/types/asset';

// Get assets assigned to a specific project - only from database
export const getProjectAssets = async (projectId: string): Promise<Asset[]> => {
  try {
    console.log('Fetching project assets from database for project ID:', projectId);
    const response = await api.get(`/projects/${projectId}/assets`);
    console.log('Fetched project assets from database:', response.data);
    return response.data;
  } catch (error) {
    console.error(`Error fetching assets for project ${projectId} from database:`, error);
    throw error; // Don't fallback to mock data
  }
};

// Get resource usage for all projects - only from database
export const getProjectResourceUsage = async () => {
  try {
    console.log('Fetching project resource usage from database...');
    const response = await api.get('/projects/resources/usage');
    console.log('Project resource usage from database:', response.data);
    
    // Ensure we have valid data from database
    if (!Array.isArray(response.data)) {
      console.error('Invalid resource usage data from database:', response.data);
      throw new Error('Invalid data format from database');
    }
    
    // Filter out projects with no quotas or invalid data
    const validProjects = response.data.filter(project => 
      project && 
      project.name && 
      project.quotas && 
      (project.quotas.cpu > 0 || project.quotas.ram > 0 || project.quotas.disk > 0)
    );
    
    if (validProjects.length === 0) {
      console.log('No valid projects found in database');
      return [];
    }
    
    console.log('Valid project resource usage from database:', validProjects);
    return validProjects;
  } catch (error) {
    console.error('Error fetching project resource usage from database:', error);
    throw error; // Don't fallback to mock data
  }
};
