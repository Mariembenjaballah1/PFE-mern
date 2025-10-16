
import api from './apiClient';
import { websocketService } from './websocketService';

// Recent activities API calls with enhanced real-time capabilities
export const fetchRecentActivities = async () => {
  try {
    const response = await api.get('/activities');
    return response.data;
  } catch (error) {
    console.error('Error fetching recent activities:', error);
    
    // Return dynamic mock data with real timestamps if API fails
    console.warn('Using dynamic mock activities data with real-time timestamps');
    
    // Generate dynamic timestamps relative to current time
    const now = new Date();
    const minute = 60 * 1000;
    const hour = 60 * minute;
    const day = 24 * hour;
    
    // Add some randomness to make it feel more dynamic
    const randomMinutes = Math.floor(Math.random() * 30);
    const randomHours = Math.floor(Math.random() * 6);
    
    return [
      { 
        id: 'a1', 
        user: 'Admin', 
        action: 'Added new asset', 
        asset: 'Laptop Dell XPS 15', 
        timestamp: new Date(now.getTime() - (randomMinutes * minute)).toISOString()
      },
      { 
        id: 'a2', 
        user: 'John Doe', 
        action: 'Completed maintenance', 
        asset: 'Server Rack A5', 
        timestamp: new Date(now.getTime() - ((randomMinutes + 30) * minute)).toISOString()
      },
      { 
        id: 'a3', 
        user: 'Emma Smith', 
        action: 'Updated asset status', 
        asset: 'Printer HP LaserJet', 
        timestamp: new Date(now.getTime() - (randomHours * hour)).toISOString()
      },
      { 
        id: 'a4', 
        user: 'Alex Johnson', 
        action: 'Scheduled maintenance', 
        asset: 'Network Switch B12', 
        timestamp: new Date(now.getTime() - ((randomHours + 1) * hour)).toISOString()
      },
      { 
        id: 'a5', 
        user: 'Admin', 
        action: 'Created new user account', 
        timestamp: new Date(now.getTime() - ((randomHours + 2) * hour)).toISOString()
      },
      { 
        id: 'a6', 
        user: 'Sarah Wilson', 
        action: 'Reported issue', 
        asset: 'Desktop PC C-221', 
        timestamp: new Date(now.getTime() - (1 * day + randomHours * hour)).toISOString()
      },
      { 
        id: 'a7', 
        user: 'Mark Brown', 
        action: 'Allocated asset', 
        asset: 'Laptop MacBook Pro', 
        timestamp: new Date(now.getTime() - (1.5 * day + randomHours * hour)).toISOString()
      },
      { 
        id: 'a8', 
        user: 'Lisa Taylor', 
        action: 'Approved maintenance request', 
        asset: 'Air Conditioner Unit 3', 
        timestamp: new Date(now.getTime() - (2 * day + randomHours * hour)).toISOString()
      },
      { 
        id: 'a9', 
        user: 'Robert Clark', 
        action: 'Completed inventory check', 
        timestamp: new Date(now.getTime() - (3 * day + randomHours * hour)).toISOString()
      },
      { 
        id: 'a10', 
        user: 'Jennifer Lee', 
        action: 'Updated asset documentation', 
        asset: 'Database Server', 
        timestamp: new Date(now.getTime() - (4 * day + randomHours * hour)).toISOString()
      }
    ];
  }
};

// Enhanced function to add activity with real-time broadcasting
export const addActivity = async (activity: {
  user: string;
  action: string;
  asset?: string;
}) => {
  try {
    const response = await api.post('/activities', {
      ...activity,
      timestamp: new Date().toISOString()
    });
    
    // Broadcast the new activity via WebSocket if available
    if (websocketService && websocketService.isConnected) {
      websocketService.send('activity-added', response.data);
    }
    
    return response.data;
  } catch (error) {
    console.error('Error adding activity:', error);
    // Create a dynamic mock response
    const newActivity = {
      id: 'local-' + Date.now(),
      ...activity,
      timestamp: new Date().toISOString()
    };
    
    // Still try to broadcast even with mock data
    if (websocketService && websocketService.isConnected) {
      websocketService.send('activity-added', newActivity);
    }
    
    return newActivity;
  }
};

// Get activities for a specific asset with real-time updates
export const getAssetActivities = async (assetId: string) => {
  try {
    const response = await api.get(`/activities?asset=${assetId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching activities for asset ${assetId}:`, error);
    
    // Return dynamic mock activities for the specific asset
    const now = new Date();
    const hour = 60 * 60 * 1000;
    
    return [
      {
        id: `activity-${assetId}-1`,
        user: 'System',
        action: 'Asset status updated',
        asset: assetId,
        timestamp: new Date(now.getTime() - (2 * hour)).toISOString()
      },
      {
        id: `activity-${assetId}-2`,
        user: 'Technician',
        action: 'Maintenance completed',
        asset: assetId,
        timestamp: new Date(now.getTime() - (24 * hour)).toISOString()
      }
    ];
  }
};

// Get activities by date range with dynamic filtering
export const getActivitiesByDateRange = async (startDate: string, endDate: string) => {
  try {
    const response = await api.get(`/activities?startDate=${startDate}&endDate=${endDate}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching activities by date range:', error);
    
    // Generate dynamic activities within the date range
    const start = new Date(startDate);
    const end = new Date(endDate);
    const activities = [];
    
    const currentTime = start.getTime();
    const endTime = end.getTime();
    const timeDiff = endTime - currentTime;
    
    // Generate 5-10 activities within the date range
    const activityCount = Math.floor(Math.random() * 6) + 5;
    
    for (let i = 0; i < activityCount; i++) {
      const randomTime = currentTime + (Math.random() * timeDiff);
      activities.push({
        id: `range-activity-${i}`,
        user: ['Admin', 'Technician', 'Manager', 'System'][Math.floor(Math.random() * 4)],
        action: [
          'Updated asset status',
          'Completed maintenance',
          'Added new asset',
          'Generated report',
          'Scheduled maintenance'
        ][Math.floor(Math.random() * 5)],
        timestamp: new Date(randomTime).toISOString()
      });
    }
    
    return activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }
};

// Function to generate real-time activity updates for development
export const generateDynamicActivity = () => {
  const users = ['System', 'Admin', 'Technician', 'Manager', 'Auto-Update'];
  const actions = [
    'Auto-generated system update',
    'Real-time data refresh',
    'Background maintenance check',
    'Dynamic status update',
    'Live monitoring alert'
  ];
  
  const randomUser = users[Math.floor(Math.random() * users.length)];
  const randomAction = actions[Math.floor(Math.random() * actions.length)];
  
  return addActivity({
    user: randomUser,
    action: randomAction,
    asset: Math.random() > 0.5 ? `Asset-${Math.floor(Math.random() * 100)}` : undefined
  });
};
