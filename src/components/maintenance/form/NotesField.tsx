
import React from 'react';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useMaintenanceForm } from './MaintenanceFormContext';

const NotesField = () => {
  const { form } = useMaintenanceForm();
  
  return (
    <FormField
      control={form.control}
      name="notes"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Notes (Optional)</FormLabel>
          <FormControl>
            <Textarea 
              placeholder="Additional notes..."
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default NotesField;
