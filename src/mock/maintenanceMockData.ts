
import { MaintenanceTask } from '@/types/asset';

export const mockMaintenanceTasks: MaintenanceTask[] = [
  {
    _id: '1',
    description: 'Routine server maintenance and updates',
    type: 'preventive',
    status: 'scheduled',
    priority: 'medium',
    asset: { _id: 'asset1', name: 'Server-001' },
    assignedTo: { _id: 'tech1', name: 'John Doe' },
    scheduledDate: '2024-01-15T09:00:00Z',
    estimatedHours: 2,
    notes: 'Monthly maintenance check',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    _id: '2',
    description: 'Fix network connectivity issues',
    type: 'corrective',
    status: 'in-progress', 
    priority: 'high',
    asset: { _id: 'asset2', name: 'Router-Main' },
    assignedTo: { _id: 'tech2', name: 'Jane Smith' },
    scheduledDate: '2024-01-10T14:00:00Z',
    estimatedHours: 4,
    notes: 'Intermittent connection drops reported',
    createdAt: '2024-01-05T00:00:00Z',
    updatedAt: '2024-01-10T00:00:00Z'
  },
  {
    _id: '3',
    description: 'Emergency server restart due to critical failure',
    type: 'emergency', // Updated from 'predictive' to 'emergency'
    status: 'completed',
    priority: 'critical',
    asset: { _id: 'asset3', name: 'Database-Server' },
    assignedTo: { _id: 'tech3', name: 'Mike Johnson' },
    scheduledDate: '2024-01-08T02:00:00Z',
    completedDate: '2024-01-08T03:30:00Z',
    estimatedHours: 1,
    notes: 'Critical system failure resolved',
    createdAt: '2024-01-08T01:00:00Z',
    updatedAt: '2024-01-08T03:30:00Z'
  }
];
