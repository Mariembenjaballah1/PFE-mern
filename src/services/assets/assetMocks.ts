
import { Asset } from '@/types/asset';

/**
 * Enhanced mockAssets function with more detailed data for dynamic system
 */
export const mockAssets = (): Asset[] => {
  return [
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
      resources: {
        cpu: 8,
        ram: 16,
        disk: 512
      }
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
      resources: {
        cpu: 0,
        ram: 0,
        disk: 0
      }
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
      resources: {
        cpu: 0,
        ram: 0,
        disk: 0
      }
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
      resources: {
        cpu: 10,
        ram: 32,
        disk: 1024
      }
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
      resources: {
        cpu: 32,
        ram: 128,
        disk: 8192
      }
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
      resources: {
        cpu: 0,
        ram: 0,
        disk: 0
      }
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
      resources: {
        cpu: 0,
        ram: 0,
        disk: 0
      }
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
      resources: {
        cpu: 0,
        ram: 0,
        disk: 0
      }
    },
  ];
};
