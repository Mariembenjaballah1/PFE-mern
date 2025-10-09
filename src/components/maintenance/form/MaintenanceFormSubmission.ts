
import { createMaintenanceTask, updateMaintenanceTask } from '@/services/maintenanceApi';
import { updateAsset } from '@/services/assets/assetBasicOperations';
import { sendEmail } from '@/services/emailApi';
import { fetchUserById } from '@/services/userApi';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import { showRealtimeNotification } from '@/services/websocket/notifications';
import { showTechnicianNotification } from '@/services/notificationService';

interface SubmitFormParams {
  data: any;
  taskId?: string | null;
  isEditMode: boolean;
  taskData?: any;
  onSuccess?: () => void;
  resetForm: () => void;
}

export const useMaintenanceFormSubmission = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const submitForm = async ({ data, taskId, isEditMode, taskData, onSuccess, resetForm }: SubmitFormParams) => {
    try {
      console.log('Submitting maintenance form:', { data, isEditMode, taskId });

      let result;
      if (isEditMode && taskId) {
        result = await updateMaintenanceTask({ id: taskId, ...data });
        console.log('Maintenance task updated:', result);
      } else {
        result = await createMaintenanceTask(data);
        console.log('Maintenance task created:', result);
        
        // When creating new maintenance, mark the asset as under maintenance
        if (result && data.asset) {
          try {
            console.log('Updating asset status to maintenance for asset:', data.asset);
            await updateAsset({ 
              id: data.asset,
              status: 'maintenance' 
            });
            console.log('Asset status updated to maintenance successfully');
            
            toast({
              title: "Asset Status Updated",
              description: "The asset has been marked as under maintenance and is now non-functional.",
            });
          } catch (assetError) {
            console.error('Failed to update asset status:', assetError);
            // Don't fail the whole operation if asset update fails, just show a warning
            toast({
              title: "Warning",
              description: "Maintenance task created but failed to update asset status. Please update manually.",
              variant: "destructive"
            });
          }
        }
        
        // Send notification and email to assigned technician for new tasks
        if (result && data.assignedTo) {
          try {
            await sendTechnicianNotificationAndEmail(result, data);
          } catch (notificationError) {
            console.error('Failed to send technician notifications:', notificationError);
            // Don't fail the whole operation if notifications fail
            toast({
              title: "Warning",
              description: "Maintenance task created but failed to send notifications to technician.",
              variant: "destructive"
            });
          }
        }
      }

      toast({
        title: isEditMode ? "Task updated successfully" : "Maintenance scheduled successfully",
        description: isEditMode 
          ? "The maintenance task has been updated." 
          : "The maintenance task has been created and the asset is now marked as non-functional.",
      });

      // Invalidate and refetch maintenance data and assets data
      queryClient.invalidateQueries({ queryKey: ['maintenance-tasks'] });
      queryClient.invalidateQueries({ queryKey: ['maintenance'] });
      queryClient.invalidateQueries({ queryKey: ['assets'] });
      
      if (!isEditMode) {
        resetForm();
      }
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error('Error submitting maintenance form:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save maintenance task",
        variant: "destructive"
      });
    }
  };

  return { submitForm };
};

// Enhanced function to send both email notification and real-time notification to technician
const sendTechnicianNotificationAndEmail = async (task: any, formData: any) => {
  try {
    console.log('Sending technician notifications for task:', task._id, 'to technician:', formData.assignedTo);
    
    // Fetch the full technician information by ID
    let technicianInfo = null;
    try {
      technicianInfo = await fetchUserById(formData.assignedTo);
      console.log('Fetched technician info:', technicianInfo);
    } catch (userError) {
      console.error('Failed to fetch technician info:', userError);
      // Fallback to basic info
      technicianInfo = {
        name: formData.assignedToName || 'Technician',
        email: formData.assignedToEmail || 'technician@example.com'
      };
    }
    
    const technicianName = technicianInfo?.name || 'Technician';
    const technicianEmail = technicianInfo?.email || 'technician@example.com';
    
    // Get asset name
    const assetName = task.asset?.name || formData.assetName || 'Unknown Asset';
    
    // Format the scheduled date
    const scheduledDate = new Date(task.scheduledDate || formData.scheduledDate).toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    // Send real-time notification
    showRealtimeNotification('maintenance-scheduled', {
      technicianId: formData.assignedTo,
      technicianName: technicianName,
      assetName: assetName,
      taskId: task._id,
      date: task.scheduledDate || formData.scheduledDate,
      priority: task.priority || formData.priority,
      type: task.type || formData.type
    });

    // Send local notification for technician if they are currently logged in
    showTechnicianNotification(formData.assignedTo, {
      taskId: task._id,
      assetName: assetName,
      priority: task.priority || formData.priority,
      scheduledDate: task.scheduledDate || formData.scheduledDate,
      type: task.type || formData.type
    });

    // Send email notification
    const emailContent = `
Cher/Chère ${technicianName},

Vous avez été assigné(e) à une nouvelle tâche de maintenance :

Asset: ${assetName}
Description: ${task.description || formData.description}
Type: ${(task.type || formData.type).charAt(0).toUpperCase() + (task.type || formData.type).slice(1)}
Priorité: ${(task.priority || formData.priority).charAt(0).toUpperCase() + (task.priority || formData.priority).slice(1)}
Date programmée: ${scheduledDate}
Durée estimée: ${task.estimatedHours || formData.estimatedHours} heures

IMPORTANT: L'actif a été marqué en maintenance et est maintenant non-fonctionnel jusqu'à la fin de la maintenance.

Veuillez vous connecter au système pour voir tous les détails et gérer cette tâche.

ID de la tâche: ${task._id || 'En attente'}

Cordialement,
Système de Gestion des Actifs
    `;

    await sendEmail({
      to: technicianEmail,
      subject: `Nouvelle Tâche de Maintenance Assignée: ${assetName} - Actif Non-Fonctionnel`,
      message: emailContent
    });

    console.log('Technician notification email and real-time notification sent successfully');
  } catch (error) {
    console.error('Error sending technician notifications:', error);
    throw error;
  }
};
