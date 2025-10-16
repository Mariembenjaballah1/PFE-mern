
import { Project, Asset } from '@/types/asset';

// Helper function to generate mock projects when API fails
export const mockProjects = (): Project[] => {
  return [
    {
      id: 'P001',
      name: 'CRM System',
      description: 'Customer Relationship Management System',
      status: 'active',
      startDate: '2023-01-15',
      manager: 'John Doe',
      department: 'Sales',
      priority: 'high',
      tags: ['sales', 'customers']
    },
    {
      id: 'P002',
      name: 'ERP Platform',
      description: 'Enterprise Resource Planning Platform',
      status: 'active',
      startDate: '2022-11-05',
      manager: 'Jane Smith',
      department: 'Operations',
      priority: 'critical',
      tags: ['finance', 'operations']
    },
    {
      id: 'P003',
      name: 'Marketing Portal',
      description: 'Marketing Campaign Management Portal',
      status: 'active',
      startDate: '2023-08-20',
      manager: 'Alice Johnson',
      department: 'Marketing',
      priority: 'medium',
      tags: ['marketing', 'campaigns']
    },
    {
      id: 'P004',
      name: 'Design System',
      description: 'Unified Design System for applications',
      status: 'on-hold',
      startDate: '2023-05-10',
      manager: 'Robert Brown',
      department: 'Design',
      priority: 'low',
      tags: ['design', 'ui/ux']
    }
  ];
};

export const mockProjectResources = () => {
  return [
    {
      name: 'CRM System',
      used: { cpu: 8, ram: 32, disk: 200 }
    },
    {
      name: 'ERP Platform',
      used: { cpu: 24, ram: 96, disk: 800 }
    },
    {
      name: 'Marketing Portal',
      used: { cpu: 4, ram: 16, disk: 150 }
    },
    {
      name: 'Design System',
      used: { cpu: 6, ram: 24, disk: 180 }
    }
  ];
};

// Helper function to generate mock assets for demo
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
      project: 'P001',
      resources: { cpu: 8, ram: 16, disk: 512 }
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
      project: 'P003',
      resources: { cpu: 0, ram: 0, disk: 0 }
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
      project: 'P002',
      resources: { cpu: 0, ram: 0, disk: 0 }
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
      project: 'P004',
      resources: { cpu: 10, ram: 32, disk: 1024 }
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
      project: 'P002',
      resources: { cpu: 32, ram: 128, disk: 8192 }
    }
  ];
};
