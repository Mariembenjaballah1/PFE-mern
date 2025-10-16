
import React from 'react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { EmailFormValues } from './EmailForm';

interface RecipientFieldProps {
  form: UseFormReturn<EmailFormValues>;
}

const RecipientField: React.FC<RecipientFieldProps> = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="to"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Recipient</FormLabel>
          <FormControl>
            <Input placeholder="email@example.com" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default RecipientField;
