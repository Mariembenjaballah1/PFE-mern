
import api from './apiClient';

// Fetch user settings
export const fetchUserSettings = async () => {
  try {
    const response = await api.get('/settings');
    return response.data;
  } catch (error) {
    console.error('Error fetching user settings:', error);
    // Return default settings as fallback
    return getDefaultSettings();
  }
};

// Update user settings
export const updateUserSettings = async (settings: any) => {
  try {
    const response = await api.patch('/settings', settings);
    return response.data;
  } catch (error) {
    console.error('Error updating user settings:', error);
    throw error;
  }
};

// Fetch system settings (admin only)
export const fetchSystemSettings = async () => {
  try {
    const response = await api.get('/settings/system');
    return response.data;
  } catch (error) {
    console.error('Error fetching system settings:', error);
    // Return default system settings as fallback
    return getDefaultSystemSettings();
  }
};

// Update system settings (admin only)
export const updateSystemSettings = async (settings: any) => {
  try {
    const response = await api.patch('/settings/system', settings);
    return response.data;
  } catch (error) {
    console.error('Error updating system settings:', error);
    throw error;
  }
};

// Get default user settings
const getDefaultSettings = () => {
  return {
    notifications: {
      email: true,
      inApp: true,
      maintenance: true,
      resourceAlerts: true
    },
    theme: 'system',
    language: 'en',
    dashboardLayout: 'default',
    pageSize: 10
  };
};

// Get default system settings
const getDefaultSystemSettings = () => {
  return {
    maintenanceWindow: {
      day: 'sunday',
      startHour: 22,
      endHour: 2
    },
    resourceAlertThresholds: {
      cpu: 80,
      memory: 85,
      disk: 90
    },
    backupSchedule: 'daily',
    userAutoLockout: {
      enabled: true,
      failedAttempts: 5
    },
    systemAnnouncement: ''
  };
};
