
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Input } from '@/components/ui/input';
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
import { AssetFormValues } from './AssetFormSchema';

interface AssetFormFieldsProps {
  form: UseFormReturn<AssetFormValues>;
  users: any[];
  projects: any[];
  isLoadingUsers: boolean;
  isLoadingProjects: boolean;
}

const AssetFormFields: React.FC<AssetFormFieldsProps> = ({
  form,
  users,
  projects,
  isLoadingUsers,
  isLoadingProjects
}) => {
  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Asset Name</FormLabel>
            <FormControl>
              <Input placeholder="Dell XPS 15" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="category"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Category</FormLabel>
            <FormControl>
              <Input placeholder="Laptops" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="status"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Status</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="operational">Operational</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="repair">Repair</SelectItem>
                <SelectItem value="retired">Retired</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="location"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Location</FormLabel>
            <FormControl>
              <Input placeholder="Main Office" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="purchaseDate"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Purchase Date</FormLabel>
            <FormControl>
              <Input type="date" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="assignedTo"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Assigned To</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select user" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="Unassigned">Unassigned</SelectItem>
                {isLoadingUsers ? (
                  <SelectItem value="loading" disabled>Loading users...</SelectItem>
                ) : (
                  users.map((user: any) => (
                    <SelectItem key={user._id} value={user.name}>
                      {user.name} - {user.department}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="project"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Project</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select project" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="none">No Project</SelectItem>
                {isLoadingProjects ? (
                  <SelectItem value="loading" disabled>Loading projects...</SelectItem>
                ) : (
                  projects.map((project: any) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default AssetFormFields;
