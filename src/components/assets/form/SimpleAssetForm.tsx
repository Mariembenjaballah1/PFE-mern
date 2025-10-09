
import React from 'react';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import { useSimpleAssetForm } from './useSimpleAssetForm';
import SimpleAssetFields from './SimpleAssetFields';

interface SimpleAssetFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

const SimpleAssetForm: React.FC<SimpleAssetFormProps> = ({ onSuccess, onCancel }) => {
  const { form, projects, isLoadingProjects, onSubmit } = useSimpleAssetForm({ onSuccess });
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <SimpleAssetFields
          control={form.control}
          projects={projects}
          isLoadingProjects={isLoadingProjects}
        />
        
        <DialogFooter>
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit">Add Asset</Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default SimpleAssetForm;
