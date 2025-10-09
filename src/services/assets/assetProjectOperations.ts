
import apiClient from '../apiClient';
import { Asset } from '@/types/asset';

export interface UpdateAssetsForProjectData {
  projectId: string;
  projectName: string;
  newManager: string;
}

/**
 * Update all assets assigned to a project when the project manager changes
 */
export const updateAssetsForProjectManager = async (data: UpdateAssetsForProjectData): Promise<Asset[]> => {
  console.log('Updating assets for project manager change:', data);
  
  const response = await apiClient.put(`/assets/project/${data.projectId}/manager-update`, {
    newManager: data.newManager,
    projectName: data.projectName
  });
  
  console.log('Assets updated for project manager change:', response.data);
  return response.data;
};

/**
 * Get all assets assigned to a specific project
 */
export const getAssetsByProject = async (projectId: string): Promise<Asset[]> => {
  const response = await apiClient.get(`/assets/project/${projectId}`);
  return response.data;
};
