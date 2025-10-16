import apiClient from '../apiClient';
import { Asset } from '@/types/asset';

export interface CreateAssetData {
  name: string;
  category: string;
  status: 'operational' | 'maintenance' | 'repair' | 'retired';
  location: string;
  purchaseDate: string;
  assignedTo?: string;
  project?: string | null;
  additionalData?: Record<string, any>;
  vmInfo?: Record<string, any>;
  specs?: Record<string, any>;
  resources?: {
    cpu: number;
    ram: number;
    disk: number;
  };
}

export interface UpdateAssetData {
  id: string;
  name?: string;
  category?: string;
  status?: 'operational' | 'maintenance' | 'repair' | 'retired';
  location?: string;
  purchaseDate?: string;
  assignedTo?: string;
  project?: string | null;
  additionalData?: Record<string, any>;
  vmInfo?: Record<string, any>;
  specs?: Record<string, any>;
  resources?: {
    cpu: number;
    ram: number;
    disk: number;
  };
}

export const fetchAssets = async (): Promise<Asset[]> => {
  try {
    const response = await apiClient.get('/assets');
    return response.data;
  } catch (error) {
    console.error('Error fetching assets:', error);
    throw error;
  }
};

export const fetchAssetById = async (id: string): Promise<Asset> => {
  try {
    const response = await apiClient.get(`/assets/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching asset with ID ${id}:`, error);
    throw error;
  }
};

export const createAsset = async (assetData: CreateAssetData): Promise<Asset> => {
  try {
    console.log('Creating asset with data:', assetData);
    
    // Prepare the payload with proper structure
    const payload = {
      ...assetData,
      // Ensure vmInfo is included if provided
      vmInfo: assetData.vmInfo || {},
      // Ensure specs is included if provided  
      specs: assetData.specs || {},
      // Set default resources if not provided
      resources: assetData.resources || {
        cpu: 0,
        ram: 0,
        disk: 0
      }
    };
    
    console.log('Final payload being sent:', payload);
    
    const response = await apiClient.post('/assets', payload);
    console.log('Asset creation response:', response.data);
    
    return response.data;
  } catch (error) {
    console.error('Error creating asset:', error);
    throw error;
  }
};

export const updateAsset = async (assetData: UpdateAssetData): Promise<Asset> => {
  try {
    const { id, ...updatePayload } = assetData;
    const response = await apiClient.put(`/assets/${id}`, updatePayload);
    return response.data;
  } catch (error) {
    console.error(`Error updating asset with ID ${assetData.id}:`, error);
    throw error;
  }
};

export const deleteAsset = async (id: string): Promise<void> => {
  try {
    await apiClient.delete(`/assets/${id}`);
    console.log(`Asset with ID ${id} deleted successfully.`);
  } catch (error) {
    console.error(`Error deleting asset with ID ${id}:`, error);
    throw error;
  }
};

export const deleteAllServers = async (): Promise<void> => {
  try {
    await apiClient.delete('/assets/servers/all');
    console.log('All servers deleted successfully.');
  } catch (error) {
    console.error('Error deleting all servers:', error);
    throw error;
  }
};
