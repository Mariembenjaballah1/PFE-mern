import { toast } from 'sonner';

interface NotificationData {
  type: 'maintenance' | 'assignment' | 'status' | 'general';
  title: string;
  message: string;
  link?: string;
  userId?: string; // ID du destinataire
}

export const createTechnicianMaintenanceNotification = (
  technicianId: string,
  taskData: any
): NotificationData => {
  const assetName = taskData.assetName || taskData.asset?.name || 'Actif inconnu';
  const priority = taskData.priority || 'normal';
  const scheduledDate = taskData.scheduledDate ? new Date(taskData.scheduledDate).toLocaleDateString('fr-FR') : 'Date à définir';
  
  return {
    type: 'maintenance',
    title: `🔧 Nouvelle tâche de maintenance assignée`,
    message: `Vous avez été assigné(e) à la maintenance de "${assetName}". Priorité: ${priority.toUpperCase()}. Programmée pour le ${scheduledDate}.`,
    link: `/maintenance/${taskData.taskId || ''}`,
    userId: technicianId
  };
};

export const saveNotificationToLocalStorage = (notification: NotificationData) => {
  try {
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    
    // Vérifier si la notification est pour l'utilisateur actuel
    if (notification.userId && notification.userId !== currentUser._id) {
      return; // Ne pas sauvegarder si ce n'est pas pour cet utilisateur
    }
    
    const existingNotifications = JSON.parse(localStorage.getItem('notifications') || '[]');
    
    const newNotification = {
      id: Date.now().toString(),
      ...notification,
      read: false,
      timestamp: new Date().toISOString()
    };
    
    const updatedNotifications = [newNotification, ...existingNotifications];
    
    // Garder seulement les 50 dernières notifications
    if (updatedNotifications.length > 50) {
      updatedNotifications.splice(50);
    }
    
    localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
    
    console.log('Notification saved to localStorage:', newNotification);
  } catch (error) {
    console.error('Error saving notification to localStorage:', error);
  }
};

export const showTechnicianNotification = (technicianId: string, taskData: any) => {
  const notification = createTechnicianMaintenanceNotification(technicianId, taskData);
  
  // Sauvegarder dans localStorage
  saveNotificationToLocalStorage(notification);
  
  // Afficher le toast uniquement si c'est pour l'utilisateur actuel
  try {
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    if (currentUser._id === technicianId) {
      const priority = taskData.priority || 'normal';
      const assetName = taskData.assetName || 'Actif';
      
      toast.warning('🔧 Nouvelle Tâche de Maintenance', {
        description: `Vous avez été assigné(e) à la maintenance de "${assetName}". Priorité: ${priority.toUpperCase()}`,
        duration: 8000,
        action: {
          label: 'Voir la Tâche',
          onClick: () => {
            if (notification.link) {
              window.location.href = notification.link;
            }
          }
        }
      });
    }
  } catch (error) {
    console.error('Error showing technician notification:', error);
  }
};