
import React from 'react';
import { Form } from '@/components/ui/form';
import { 
  MaintenanceFormProvider
} from './form/MaintenanceFormContext';
import { usePlanMaintenanceForm } from './form/usePlanMaintenanceForm';
import { useMaintenanceFormSubmission } from './form/MaintenanceFormSubmission';
import MaintenanceFormAuth from './form/MaintenanceFormAuth';
import AssetSelection from './form/AssetSelection';
import MaintenanceDescription from './form/MaintenanceDescription';
import MaintenanceTypeSelection from './form/MaintenanceTypeSelection';
import PrioritySelection from './form/PrioritySelection';
import TechnicianSelection from './form/TechnicianSelection';
import SchedulingFields from './form/SchedulingFields';
import NotesField from './form/NotesField';
import MaintenanceFormActions from './form/MaintenanceFormActions';

interface PlanMaintenanceFormProps {
  taskId?: string | null;
  isEditMode?: boolean;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const PlanMaintenanceForm: React.FC<PlanMaintenanceFormProps> = ({ 
  taskId, 
  isEditMode = false,
  onSuccess, 
  onCancel 
}) => {
  const { form, taskData } = usePlanMaintenanceForm({ taskId, isEditMode });
  const { submitForm } = useMaintenanceFormSubmission();

  const onSubmit = async (data: any) => {
    await submitForm({
      data,
      taskId,
      isEditMode,
      taskData,
      onSuccess,
      resetForm: () => form.reset()
    });
  };

  return (
    <MaintenanceFormAuth>
      <MaintenanceFormProvider form={form}>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <AssetSelection />
            <MaintenanceDescription />
            <MaintenanceTypeSelection />
            <PrioritySelection />
            <TechnicianSelection />
            <SchedulingFields />
            <NotesField />
            <MaintenanceFormActions 
              onCancel={onCancel} 
              submitLabel={isEditMode ? "Update Maintenance" : "Schedule Maintenance"} 
            />
          </form>
        </Form>
      </MaintenanceFormProvider>
    </MaintenanceFormAuth>
  );
};

export default PlanMaintenanceForm;
