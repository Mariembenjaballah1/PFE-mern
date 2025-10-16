
import { toast } from "@/components/ui/sonner";

export const showRealtimeNotification = (type: string, data: any) => {
  switch (type) {
    case 'asset-updated':
      toast.success('Asset Updated Successfully', {
        description: `${data.name || 'Asset'} has been updated with the latest information`,
        duration: 4000,
        action: {
          label: 'View Details',
          onClick: () => console.log('Navigate to asset details')
        }
      });
      break;
      
    case 'asset-created':
      toast.success('New Asset Added', {
        description: `${data.name || 'Asset'} has been successfully added to your inventory`,
        duration: 5000,
        action: {
          label: 'View Asset',
          onClick: () => console.log('Navigate to new asset')
        }
      });
      break;
      
    case 'maintenance-scheduled':
      const technicianName = data.technicianName || 'Technician';
      const assetName = data.assetName || 'Asset';
      const priority = data.priority || 'normal';
      const priorityColor = priority === 'high' ? 'text-red-600' : priority === 'medium' ? 'text-yellow-600' : 'text-green-600';
      
      toast.warning('🔧 Nouvelle Tâche de Maintenance Assignée', {
        description: `${technicianName}, vous avez été assigné(e) à la maintenance de "${assetName}". Priorité: ${priority.toUpperCase()}`,
        duration: 8000,
        action: {
          label: 'Voir la Tâche',
          onClick: () => {
            // Navigate to maintenance details or technician notifications
            window.location.href = data.taskId ? `/maintenance/${data.taskId}` : '/technician-notifications';
          }
        },
        style: {
          background: priority === 'high' ? '#fef2f2' : priority === 'medium' ? '#fffbeb' : '#f0fdf4',
          borderLeft: `4px solid ${priority === 'high' ? '#dc2626' : priority === 'medium' ? '#d97706' : '#16a34a'}`
        }
      });
      break;
      
    case 'maintenance-completed':
      toast.success('Maintenance Completed', {
        description: `Maintenance task for ${data.assetName || 'asset'} has been successfully completed`,
        duration: 4000
      });
      break;
      
    case 'resource-alert':
      toast.error('Resource Alert', {
        description: data.message || 'System resource threshold exceeded - immediate attention required',
        duration: 8000,
        action: {
          label: 'View Details',
          onClick: () => console.log('Navigate to resource monitoring')
        }
      });
      break;
      
    case 'user-notification':
      toast.info('New Notification', {
        description: data.message || 'You have a new notification',
        duration: 5000
      });
      break;
      
    case 'project-updated':
      toast.info('Project Updated', {
        description: `Project "${data.projectName || 'Unknown'}" has been updated`,
        duration: 4000,
        action: {
          label: 'View Project',
          onClick: () => console.log('Navigate to project details')
        }
      });
      break;
      
    case 'stats-updated':
      console.log('Stats updated in real-time:', data);
      // Only show toast for significant stats changes
      if (data.assets && data.assets > 0) {
        toast.info('Data Refreshed', {
          description: `Dashboard updated with latest statistics (${data.assets} assets)`,
          duration: 3000
        });
      }
      break;
      
    case 'activity-added':
      toast.info('New Activity', {
        description: `${data.user || 'User'}: ${data.action || 'New activity recorded'}`,
        duration: 4000
      });
      break;
      
    case 'system-health':
      const isHealthy = data.status === 'healthy';
      toast[isHealthy ? 'success' : 'warning'](
        isHealthy ? 'System Healthy' : 'System Warning',
        {
          description: data.message || `System health status: ${data.status || 'unknown'}`,
          duration: isHealthy ? 3000 : 6000
        }
      );
      break;
      
    default:
      toast.info('System Update', {
        description: 'Real-time update received',
        duration: 3000
      });
  }
};
