
import api from '../apiClient';
import { Asset } from '@/types/asset';
import { ASSET_ENDPOINTS } from './assetEndpoints';

/**
 * Fetch assets by category
 * @param category The category to filter by
 */
export const fetchAssetsByCategory = async (category: string): Promise<Asset[]> => {
  if (!category) {
    console.error('Error: Attempted to fetch assets with undefined category');
    throw new Error('Cannot fetch assets: Category is undefined');
  }
  
  try {
    const response = await api.get(ASSET_ENDPOINTS.BY_CATEGORY(category));
    return response.data;
  } catch (error) {
    console.error(`Error fetching assets with category ${category}:`, error);
    throw error;
  }
};

/**
 * Fetch assets by status
 * @param status The status to filter by
 */
export const fetchAssetsByStatus = async (status: string): Promise<Asset[]> => {
  if (!status) {
    console.error('Error: Attempted to fetch assets with undefined status');
    throw new Error('Cannot fetch assets: Status is undefined');
  }
  
  try {
    const response = await api.get(ASSET_ENDPOINTS.BY_STATUS(status));
    return response.data;
  } catch (error) {
    console.error(`Error fetching assets with status ${status}:`, error);
    throw error;
  }
};

/**
 * Fetch assets by project
 * @param projectId The project ID to filter by
 */
export const fetchAssetsByProject = async (projectId: string): Promise<Asset[]> => {
  if (!projectId) {
    console.error('Error: Attempted to fetch assets with undefined project ID');
    throw new Error('Cannot fetch assets: Project ID is undefined');
  }
  
  try {
    const response = await api.get(ASSET_ENDPOINTS.BY_PROJECT(projectId));
    return response.data;
  } catch (error) {
    console.error(`Error fetching assets with project ID ${projectId}:`, error);
    throw error;
  }
};
