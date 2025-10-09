
import { z } from 'zod';

export const serverFormSchema = z.object({
  // Basic Information
  name: z.string().min(2, { message: 'Server name must be at least 2 characters.' }),
  category: z.string().min(1, { message: 'Category is required' }),
  status: z.enum(['operational', 'maintenance', 'repair', 'retired']),
  
  // Server IDs
  appId: z.string().optional(),
  dbId: z.string().optional(),
  adminId: z.string().optional(),
  
  // Network Information
  ipAddress: z.string().min(1, { message: 'IP Address is required' }),
  macAddress: z.string().optional(),
  hostname: z.string().optional(),
  domain: z.string().optional(),
  physicalOrVm: z.enum(['Physical', 'VM']).optional(),
  dns: z.string().optional(),
  
  // Hardware Specifications - aligned with additionalData structure
  cpu: z.string().optional(),
  ram: z.string().optional(),
  storage: z.string().optional(),
  disk: z.string().optional(),
  networkCard: z.string().optional(),
  os: z.string().optional(),
  osVersion: z.string().optional(),
  version: z.string().optional(),
  
  // Location & Assignment
  location: z.string().min(1, { message: 'Location is required' }),
  assignedTo: z.string().optional(),
  project: z.string().optional(),
  environment: z.string().optional(),
  
  // Service Information
  services: z.string().optional(),
  ports: z.string().optional(),
  incomingUrl: z.string().optional(),
  outgoingUrl: z.string().optional(),
  accessUrl: z.string().optional(),
  notes: z.string().optional(),
  
  // Additional fields for VM Information sync
  serialNumber: z.string().optional(),
  manufacturer: z.string().optional(),
  model: z.string().optional(),
  purchaseDate: z.string().min(1, { message: 'Purchase date is required' }),
  
  // VM-specific fields to sync with vmInfo
  powerstate: z.string().optional(),
  datacenter: z.string().optional(),
  host: z.string().optional(),
  migre: z.string().optional(),
  cpus: z.string().optional(),
  memorySize: z.string().optional(),
  provisionedMB: z.string().optional(),
});

export type ServerFormValues = z.infer<typeof serverFormSchema>;
