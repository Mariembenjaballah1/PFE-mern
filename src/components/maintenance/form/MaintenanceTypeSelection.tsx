
import React from 'react';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useMaintenanceForm } from './MaintenanceFormContext';

const MaintenanceTypeSelection = () => {
  const { form } = useMaintenanceForm();
  
  return (
    <FormField
      control={form.control}
      name="type"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Maintenance Type</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="preventive">Preventive</SelectItem>
              <SelectItem value="corrective">Corrective</SelectItem>
              <SelectItem value="emergency">Emergency</SelectItem>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default MaintenanceTypeSelection;
