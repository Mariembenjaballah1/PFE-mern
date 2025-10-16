
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { fetchMaintenanceTaskById } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { Asset } from '@/types/asset';
import { 
  maintenanceFormSchema,
  type MaintenanceFormValues
} from './MaintenanceFormContext';

interface UsePlanMaintenanceFormProps {
  taskId?: string | null;
  isEditMode?: boolean;
}

export const usePlanMaintenanceForm = ({ taskId, isEditMode }: UsePlanMaintenanceFormProps) => {
  const { toast: useToastHook } = useToast();
  
  const form = useForm<MaintenanceFormValues>({
    resolver: zodResolver(maintenanceFormSchema),
    defaultValues: {
      type: 'preventive',
      priority: 'medium',
      scheduledDate: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
      estimatedHours: 1,
    },
  });

  // Fetch task data if in edit mode
  const { data: taskData } = useQuery({
    queryKey: ['maintenance', taskId],
    queryFn: () => fetchMaintenanceTaskById(taskId as string),
    enabled: isEditMode && !!taskId,
    meta: {
      onError: () => {
        useToastHook({
          title: "Error loading maintenance task",
          description: "Failed to load task data for editing",
          variant: "destructive"
        });
      }
    }
  });

  // Set form values when task data is available
  useEffect(() => {
    if (isEditMode && taskData) {
      // Helper function to safely extract ID from union type with proper Asset handling
      const getIdFromUnion = (value: Asset | { _id: string; name: string } | string | undefined): string => {
        if (typeof value === 'string') {
          return value;
        }
        if (value && typeof value === 'object') {
          // Handle Asset type which has optional _id and id properties
          if ('_id' in value && value._id) {
            return value._id;
          }
          if ('id' in value && value.id) {
            return value.id;
          }
          // Handle simple object with _id/name
          if ('_id' in value) {
            return value._id || '';
          }
        }
        return '';
      };

      form.reset({
        asset: getIdFromUnion(taskData.asset),
        description: taskData.description,
        type: taskData.type,
        priority: taskData.priority,
        assignedTo: getIdFromUnion(taskData.assignedTo),
        scheduledDate: new Date(taskData.scheduledDate).toISOString().split('T')[0],
        estimatedHours: taskData.estimatedHours,
        notes: taskData.notes || undefined,
      });
    }
  }, [taskData, isEditMode, form]);

  return {
    form,
    taskData
  };
};
