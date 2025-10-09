
// Re-export all API functions from separate modules
export * from './assetApi';
export * from './userApi';
export * from './emailApi';
export * from './projectApi';
export * from './statsService';
export * from './aiInsightsApi';
export * from './settingsApi';
export * from './assets/assetResourceOperations';
export * from './assets/assetFilterOperations';
export * from './assets/assetBasicOperations';

// Special handling for maintenanceApi to avoid naming conflicts
import * as maintenanceApiExports from './maintenanceApi';

// Re-export maintenance functions with consistent naming
export const {
  fetchMaintenanceTasks,
  fetchMaintenanceTaskById,
  createMaintenanceTask,
  updateMaintenanceTask,
  deleteMaintenanceTask
} = maintenanceApiExports;

// Re-export api instance as default
import api from './apiClient';
export default api;
