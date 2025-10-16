
import { Asset } from '@/types/asset';
import { fetchAssets } from './assetApi';

// Mock data - In real app this would be fetched from API
const mockAssets: Asset[] = [
  {
    id: 'A001',
    name: 'Dell XPS 15',
    category: 'Laptops',
    status: 'operational',
    location: 'Main Office',
    purchaseDate: '2023-05-12',
    lastUpdate: '2025-04-28',
    assignedTo: 'John Doe',
    project: 'CRM System',
  },
  {
    id: 'A002',
    name: 'HP LaserJet Pro',
    category: 'Printers',
    status: 'maintenance',
    location: 'Marketing Department',
    purchaseDate: '2022-11-05',
    lastUpdate: '2025-04-30',
    assignedTo: 'Emma Smith',
    project: 'Marketing Portal',
  },
  {
    id: 'A003',
    name: 'Cisco Switch 24-Port',
    category: 'Networking',
    status: 'operational',
    location: 'Server Room',
    purchaseDate: '2024-01-20',
    lastUpdate: '2025-04-15',
    assignedTo: 'Network Team',
    project: 'Network Infrastructure',
  },
  {
    id: 'A004',
    name: 'MacBook Pro M1',
    category: 'Laptops',
    status: 'repair',
    location: 'Design Department',
    purchaseDate: '2023-08-03',
    lastUpdate: '2025-05-01',
    assignedTo: 'Sarah Wilson',
    project: 'Design System',
  },
  {
    id: 'A005',
    name: 'Dell PowerEdge Server',
    category: 'Servers',
    status: 'operational',
    location: 'Data Center',
    purchaseDate: '2022-03-15',
    lastUpdate: '2025-04-22',
    assignedTo: 'IT Department',
    project: 'ERP Platform',
  },
  {
    id: 'A006',
    name: 'Samsung Monitor 32"',
    category: 'Displays',
    status: 'operational',
    location: 'Finance Department',
    purchaseDate: '2024-02-18',
    lastUpdate: '2025-04-10',
    assignedTo: 'Alex Johnson',
    project: 'Finance Portal',
  },
  {
    id: 'A007',
    name: 'iPad Pro 12.9"',
    category: 'Tablets',
    status: 'maintenance',
    location: 'Executive Suite',
    purchaseDate: '2023-10-09',
    lastUpdate: '2025-04-28',
    assignedTo: 'CEO Office',
  },
  {
    id: 'A008',
    name: 'Logitech MX Master 3',
    category: 'Peripherals',
    status: 'retired',
    location: 'IT Storage',
    purchaseDate: '2022-05-30',
    lastUpdate: '2025-04-05',
    assignedTo: 'Unassigned',
  },
];

// Updated methods to use API
export const getAssets = async (): Promise<Asset[]> => {
  try {
    return await fetchAssets();
  } catch (error) {
    console.warn('Error fetching assets from API, using mock data:', error);
    return mockAssets;
  }
};

export const getAssetCategories = (): string[] => {
  return [...new Set(mockAssets.map(asset => asset.category))].sort();
};

export const getAssetStatuses = (): string[] => {
  return [...new Set(mockAssets.map(asset => asset.status))].sort();
};

export const filterAssets = (
  assets: Asset[],
  searchQuery: string,
  filterCategory: string,
  filterStatus: string
): Asset[] => {
  return assets.filter(asset => {
    // Safely get asset ID - handle both 'id' and '_id' properties
    const assetId = asset.id || (asset as any)._id || '';
    const assetName = asset.name || '';
    
    const matchesSearch = searchQuery === '' || 
      assetName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assetId.toString().toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = filterCategory === '' || asset.category === filterCategory;
    const matchesStatus = filterStatus === '' || asset.status === filterStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });
};

// Get projects from assets
export const getAssetProjects = (assets: Asset[]): string[] => {
  const projects = assets
    .map(asset => asset.project)
    .filter(project => project !== undefined) as string[];
  
  return [...new Set(projects)].sort();
};
