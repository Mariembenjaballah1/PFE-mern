
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchUsers } from '@/services/api';
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

const TechnicianSelection = () => {
  const { form } = useMaintenanceForm();
  const { data: users = [] } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers
  });

  const technicians = users.filter((user: any) => 
    user.role === 'TECHNICIAN' || user.role === 'ADMIN'
  );
  
  return (
    <FormField
      control={form.control}
      name="assignedTo"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Assign To</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select technician" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {technicians.map((user: any) => (
                <SelectItem key={user._id} value={user._id}>
                  {user.name} ({user.role})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default TechnicianSelection;
