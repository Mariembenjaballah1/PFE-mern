
import React from 'react';
import { Control } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ServerFormValues } from './ServerFormSchema';

interface ServerNetworkFieldsProps {
  control: Control<ServerFormValues>;
}

const ServerNetworkFields: React.FC<ServerNetworkFieldsProps> = ({ control }) => {
  return (
    <div className="space-y-4">
      <div className="text-lg font-semibold border-b pb-2 pt-4">Network Details</div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="ipAddress"
          render={({ field }) => (
            <FormItem>
              <FormLabel>IP Address</FormLabel>
              <FormControl>
                <Input placeholder="192.168.1.1" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name="physicalOrVm"
          render={({ field }) => (
            <FormItem>
              <FormLabel>PHY/VM</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex space-x-4"
                >
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="Physical" />
                    </FormControl>
                    <FormLabel className="font-normal">Physical</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="VM" />
                    </FormControl>
                    <FormLabel className="font-normal">VM</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name="dns"
          render={({ field }) => (
            <FormItem>
              <FormLabel>DNS</FormLabel>
              <FormControl>
                <Input placeholder="dns.example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name="hostname"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hostname</FormLabel>
              <FormControl>
                <Input placeholder="server01" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default ServerNetworkFields;
