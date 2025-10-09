
import apiClient from './apiClient';
import { updateAsset } from './assets/assetBasicOperations';
import { Asset } from '@/types/asset';

export interface MaintenanceTask {
  _id: string;
  id: string;
  title: string;
  description: string;
  asset: Asset | { _id: string; name: string }; // Updated to match types/asset.ts
  assetName: string;
  assignedTo: string | { _id: string; name: string };
  technicianName: string;
  scheduledDate: string;
  completedDate?: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled' | 'scheduled' | 'overdue';
  type: 'preventive' | 'corrective' | 'emergency';
  estimatedDuration: number;
  estimatedHours: number;
  actualDuration?: number;
  notes?: string;
  partsUsed?: string[];
  cost?: number;
  attachments?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateMaintenanceTaskData {
  title: string;
  description: string;
  asset: string;
  assignedTo: string;
  scheduledDate: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  type: 'preventive' | 'corrective' | 'emergency';
  estimatedDuration: number;
  estimatedHours: number;
  notes?: string;
}

export interface UpdateMaintenanceTaskData {
  id: string;
  title?: string;
  description?: string;
  asset?: string;
  assignedTo?: string;
  scheduledDate?: string;
  completedDate?: string;
  priority?: 'low' | 'medium' | 'high' | 'critical';
  status?: 'pending' | 'in-progress' | 'completed' | 'cancelled' | 'scheduled' | 'overdue';
  type?: 'preventive' | 'corrective' | 'emergency';
  estimatedDuration?: number;
  estimatedHours?: number;
  actualDuration?: number;
  notes?: string;
  partsUsed?: string[];
  cost?: number;
  attachments?: string[];
}

export const fetchMaintenanceTasks = async (): Promise<MaintenanceTask[]> => {
  try {
    const response = await apiClient.get('/maintenance');
    return response.data;
  } catch (error) {
    console.error('Error fetching maintenance tasks:', error);
    throw error;
  }
};

export const fetchMaintenanceTaskById = async (id: string): Promise<MaintenanceTask> => {
  try {
    const response = await apiClient.get(`/maintenance/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching maintenance task with ID ${id}:`, error);
    throw error;
  }
};

export const createMaintenanceTask = async (taskData: CreateMaintenanceTaskData): Promise<MaintenanceTask> => {
  try {
    console.log('Creating maintenance task with data:', taskData);
    const response = await apiClient.post('/maintenance', taskData);
    console.log('Maintenance task creation response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating maintenance task:', error);
    throw error;
  }
};

export const updateMaintenanceTask = async (taskData: UpdateMaintenanceTaskData): Promise<MaintenanceTask> => {
  try {
    const { id, ...updatePayload } = taskData;
    console.log('Updating maintenance task with PATCH method:', { id, updatePayload });
    
    // Use PATCH instead of PUT to match the server route
    const response = await apiClient.patch(`/maintenance/${id}`, updatePayload);
    
    // If status is being updated to 'in-progress' or 'completed', update the asset status
    if (updatePayload.status === 'in-progress') {
      console.log('Updating asset status to maintenance for asset:', updatePayload.asset);
      if (updatePayload.asset) {
        await updateAsset({ 
          id: updatePayload.asset,
          status: 'maintenance' 
        });
      }
    } else if (updatePayload.status === 'completed') {
      console.log('Updating asset status to operational for asset:', updatePayload.asset);
      if (updatePayload.asset) {
        await updateAsset({ 
          id: updatePayload.asset,
          status: 'operational' 
        });
      }
    }
    
    return response.data;
  } catch (error) {
    console.error(`Error updating maintenance task with ID ${taskData.id}:`, error);
    throw error;
  }
};

export const deleteMaintenanceTask = async (id: string): Promise<void> => {
  try {
    await apiClient.delete(`/maintenance/${id}`);
    console.log(`Maintenance task with ID ${id} deleted successfully.`);
  } catch (error) {
    console.error(`Error deleting maintenance task with ID ${id}:`, error);
    throw error;
  }
};
