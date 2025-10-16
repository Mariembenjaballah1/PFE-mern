
import React from 'react';
import { Control } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ServerFormValues } from './ServerFormSchema';

interface ServerBasicFieldsProps {
  control: Control<ServerFormValues>;
}

const ServerBasicFields: React.FC<ServerBasicFieldsProps> = ({ control }) => {
  return (
    <div className="space-y-4">
      <div className="text-lg font-semibold border-b pb-2">Server Information</div>
      
      <FormField
        control={control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Server Name</FormLabel>
            <FormControl>
              <Input placeholder="Enter server name" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormField
          control={control}
          name="appId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>APP ID</FormLabel>
              <FormControl>
                <Input placeholder="1XXX" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name="dbId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>BDD ID</FormLabel>
              <FormControl>
                <Input placeholder="2XXX" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name="adminId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ADM ID</FormLabel>
              <FormControl>
                <Input placeholder="3XXX" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <FormField
        control={control}
        name="status"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Status</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="flex space-x-4"
              >
                <FormItem className="flex items-center space-x-2 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="operational" />
                  </FormControl>
                  <FormLabel className="font-normal">Active</FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-2 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="maintenance" />
                  </FormControl>
                  <FormLabel className="font-normal">Non Active</FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-2 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="retired" />
                  </FormControl>
                  <FormLabel className="font-normal">End Of Life</FormLabel>
                </FormItem>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default ServerBasicFields;
