
import React from 'react';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useMaintenanceForm } from './MaintenanceFormContext';

const SchedulingFields = () => {
  const { form } = useMaintenanceForm();
  
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
      <FormField
        control={form.control}
        name="scheduledDate"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Scheduled Date</FormLabel>
            <FormControl>
              <Input type="date" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="estimatedHours"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Estimated Hours</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                placeholder="1.5"
                min="0.5" 
                step="0.5" 
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default SchedulingFields;
