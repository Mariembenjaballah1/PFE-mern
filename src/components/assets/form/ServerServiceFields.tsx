
import React from 'react';
import { Control } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ServerFormValues } from './ServerFormSchema';

interface ServerServiceFieldsProps {
  control: Control<ServerFormValues>;
}

const ServerServiceFields: React.FC<ServerServiceFieldsProps> = ({ control }) => {
  return (
    <div className="space-y-4">
      <div className="text-lg font-semibold border-b pb-2 pt-4">Services & URLs</div>
      
      <FormField
        control={control}
        name="incomingUrl"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Flux Entrant - URL</FormLabel>
            <FormControl>
              <Input placeholder="https://incoming.example.com" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name="outgoingUrl"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Flux Sortant - URL</FormLabel>
            <FormControl>
              <Input placeholder="https://outgoing.example.com" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name="accessUrl"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Accès - URL</FormLabel>
            <FormControl>
              <Input placeholder="https://access.example.com" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name="notes"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Notes</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Additional information about this server"
                className="min-h-[100px]"
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

export default ServerServiceFields;
