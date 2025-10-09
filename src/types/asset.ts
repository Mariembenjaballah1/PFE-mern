
export interface AssetResources {
  cpu: number;
  ram: number;
  disk: number;
}

export interface VMInfo {
  vm?: string;                    // VM name
  dnsName?: string;               // DNS Name
  powerstate?: string;            // Powerstate
  datacenter?: string;            // Datacenter
  host?: string;                  // Host
  os?: string;                    // OS
  ipAddress?: string;             // IP Address
  migre?: string;                 // Migré
  cpus?: string;                  // CPUs
  memorySize?: string;            // Memory Size
  provisionedMB?: string;         // Provisioned MB
  prod?: string;                  // Prod
  pca?: string;                   // Pca
  infra?: string;                 // Infra
  integration?: string;           // Integration
  app?: string;                   // App
  db?: string;                    // DB
  antivirus?: string;             // Antivirus
  folder?: string;                // Folder
  projet?: string;                // projet
}

export interface Asset {
  id?: string;
  _id?: string;
  name: string;
  category: string;
  status: 'operational' | 'maintenance' | 'repair' | 'retired';
  location: string;
  purchaseDate: string;
  lastUpdate: string;
  assignedTo?: string;
  project?: string | { _id: string; name: string } | null;
  projectName?: string | null;
  resources?: AssetResources;
  vmInfo?: VMInfo;
  specs?: Record<string, any>;
  additionalData?: Record<string, any>;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

// Updated Project interface without resource quotas
export interface Project {
  _id?: string;
  id?: string;
  name: string;
  description?: string;
  status?: 'active' | 'on-hold' | 'completed' | 'cancelled';
  startDate?: string;
  endDate?: string;
  manager?: string;
  department?: string;
  priority?: 'low' | 'medium' | 'high' | 'critical';
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
}

// Updated MaintenanceTask interface to match the API definition exactly
export interface MaintenanceTask {
  _id?: string;
  id?: string;
  title?: string;
  description: string;
  type: 'preventive' | 'corrective' | 'emergency'; // Updated to match API
  status: 'scheduled' | 'in-progress' | 'completed' | 'overdue' | 'pending' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'critical';
  asset?: Asset | { _id: string; name: string };
  assetId?: string;
  assignedTo?: string | { _id: string; name: string };
  scheduledDate: string;
  estimatedHours: number;
  completedDate?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}
