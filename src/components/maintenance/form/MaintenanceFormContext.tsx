
import React, { createContext, useContext } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { z } from 'zod';

export const maintenanceFormSchema = z.object({
  asset: z.string().min(1, { message: 'Asset is required' }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters' }),
  type: z.enum(['preventive', 'corrective', 'emergency']), // Updated to match API
  priority: z.enum(['low', 'medium', 'high', 'critical']),
  assignedTo: z.string().min(1, { message: 'Assigned to is required' }),
  scheduledDate: z.string().min(1, { message: 'Scheduled date is required' }),
  estimatedHours: z.preprocess(
    (val) => Number(val),
    z.number().positive().min(0.5, { message: 'Minimum 0.5 hours required' })
  ),
  notes: z.string().optional(),
});

export type MaintenanceFormValues = z.infer<typeof maintenanceFormSchema>;

type MaintenanceFormContextType = {
  form: UseFormReturn<MaintenanceFormValues>;
};

const MaintenanceFormContext = createContext<MaintenanceFormContextType | undefined>(undefined);

export const MaintenanceFormProvider = ({ 
  children, 
  form 
}: { 
  children: React.ReactNode;
  form: UseFormReturn<MaintenanceFormValues>;
}) => {
  return (
    <MaintenanceFormContext.Provider value={{ form }}>
      {children}
    </MaintenanceFormContext.Provider>
  );
};

export const useMaintenanceForm = () => {
  const context = useContext(MaintenanceFormContext);
  if (!context) {
    throw new Error('useMaintenanceForm must be used within a MaintenanceFormProvider');
  }
  return context;
};
