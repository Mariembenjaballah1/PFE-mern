
import api from '../apiClient';

// Asset Usage Report
export const generateAssetUsageReport = async () => {
  try {
    const response = await api.get('/assets');
    const assets = response.data;
    
    // Process data for the report
    const totalAssets = assets.length;
    const assetsByCategory: Record<string, number> = {};
    const assetsByProject: Record<string, number> = {};
    
    assets.forEach((asset: any) => {
      // Count by category
      if (assetsByCategory[asset.category]) {
        assetsByCategory[asset.category]++;
      } else {
        assetsByCategory[asset.category] = 1;
      }
      
      // Count by project
      if (asset.project) {
        if (assetsByProject[asset.project]) {
          assetsByProject[asset.project]++;
        } else {
          assetsByProject[asset.project] = 1;
        }
      } else {
        if (assetsByProject['Unassigned']) {
          assetsByProject['Unassigned']++;
        } else {
          assetsByProject['Unassigned'] = 1;
        }
      }
    });
    
    return {
      totalAssets,
      assetsByCategory,
      assetsByProject
    };
  } catch (error) {
    console.error('Error generating asset usage report:', error);
    // Fallback to mock data if API fails
    return generateMockAssetUsageReport();
  }
};

// Maintenance History Report
export const generateMaintenanceHistoryReport = async () => {
  try {
    const response = await api.get('/maintenance');
    const tasks = response.data;
    
    return {
      totalTasks: tasks.length,
      tasks
    };
  } catch (error) {
    console.error('Error generating maintenance history report:', error);
    // Fallback to mock data if API fails
    return generateMockMaintenanceHistoryReport();
  }
};

// Asset Inventory Report
export const generateAssetInventoryReport = async () => {
  try {
    const response = await api.get('/assets');
    const assets = response.data;
    
    return {
      totalAssets: assets.length,
      assets
    };
  } catch (error) {
    console.error('Error generating asset inventory report:', error);
    // Fallback to mock data if API fails
    return generateMockAssetInventoryReport();
  }
};

// Mock data generators for offline development
const generateMockAssetUsageReport = () => {
  return {
    totalAssets: 24,
    assetsByCategory: {
      'Laptops': 8,
      'Servers': 4,
      'Networking': 6,
      'Printers': 3,
      'Displays': 3
    },
    assetsByProject: {
      'CRM System': 5,
      'ERP Platform': 7,
      'Marketing Portal': 3,
      'Finance Portal': 2,
      'Design System': 4,
      'Network Infrastructure': 2,
      'Unassigned': 1
    }
  };
};

const generateMockMaintenanceHistoryReport = () => {
  const mockTasks = [
    {
      asset: { name: 'Dell Server R720', id: 'A001' },
      type: 'preventive',
      status: 'completed',
      priority: 'medium',
      scheduledDate: '2025-04-15',
      assignedTo: { name: 'John Tech' },
      estimatedHours: 3
    },
    {
      asset: { name: 'HP Printer 4200', id: 'A002' },
      type: 'corrective',
      status: 'in-progress',
      priority: 'high',
      scheduledDate: '2025-05-01',
      assignedTo: { name: 'Sarah Engineer' },
      estimatedHours: 2
    },
    {
      asset: { name: 'Network Switch', id: 'A003' },
      type: 'preventive',
      status: 'scheduled',
      priority: 'low',
      scheduledDate: '2025-05-10',
      assignedTo: { name: 'Mike Admin' },
      estimatedHours: 1
    }
  ];
  
  return {
    totalTasks: mockTasks.length,
    tasks: mockTasks
  };
};

const generateMockAssetInventoryReport = () => {
  const mockAssets = [
    {
      id: 'A001',
      name: 'Dell XPS 15',
      category: 'Laptops',
      status: 'operational',
      location: 'Main Office',
      purchaseDate: '2023-05-12',
      assignedTo: 'John Doe'
    },
    {
      id: 'A002',
      name: 'HP LaserJet Pro',
      category: 'Printers',
      status: 'maintenance',
      location: 'Marketing Department',
      purchaseDate: '2022-11-05',
      assignedTo: 'Emma Smith'
    },
    {
      id: 'A003',
      name: 'Cisco Switch 24-Port',
      category: 'Networking',
      status: 'operational',
      location: 'Server Room',
      purchaseDate: '2024-01-20',
      assignedTo: 'Network Team'
    }
  ];
  
  return {
    totalAssets: mockAssets.length,
    assets: mockAssets
  };
};
