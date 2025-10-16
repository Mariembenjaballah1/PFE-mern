
import React from 'react';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { DialogFooter } from '@/components/ui/dialog';
import { Asset } from '@/types/asset';
import { useAssetForm } from './form/useAssetForm';
import AssetFormFields from './form/AssetFormFields';

interface AddAssetFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  initialData?: Asset;
  isEditMode?: boolean;
}

const AddAssetForm: React.FC<AddAssetFormProps> = ({ 
  onSuccess, 
  onCancel,
  initialData,
  isEditMode = false
}) => {
  const {
    form,
    users,
    projects,
    isLoadingUsers,
    isLoadingProjects,
    onSubmit
  } = useAssetForm({ onSuccess, initialData, isEditMode });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <AssetFormFields
          form={form}
          users={users}
          projects={projects}
          isLoadingUsers={isLoadingUsers}
          isLoadingProjects={isLoadingProjects}
        />
        
        <DialogFooter>
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit">{isEditMode ? 'Update' : 'Create'} Asset</Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default AddAssetForm;
