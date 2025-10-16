import React from 'react';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import { Asset } from '@/types/asset';
import { useServerEditForm } from './form/useServerEditForm';
import ServerBasicFields from './form/ServerBasicFields';
import ServerNetworkFields from './form/ServerNetworkFields';
import ServerHardwareFields from './form/ServerHardwareFields';
import ServerLocationFields from './form/ServerLocationFields';
import ServerServiceFields from './form/ServerServiceFields';

interface EditServerFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  initialData: Asset;
}

const EditServerForm: React.FC<EditServerFormProps> = ({ onSuccess, onCancel, initialData }) => {
  const { form, projects, isLoadingProjects, onSubmit } = useServerEditForm({ onSuccess, initialData });
  
  return (
    <div className="max-h-[70vh] overflow-y-auto pr-2">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <ServerBasicFields control={form.control} />
            <ServerNetworkFields control={form.control} />
            <ServerHardwareFields control={form.control} />
            <ServerLocationFields 
              control={form.control} 
              projects={projects}
              isLoadingProjects={isLoadingProjects}
            />
            <ServerServiceFields control={form.control} />
          </div>
          
          <DialogFooter>
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
            <Button type="submit">Update Server</Button>
          </DialogFooter>
        </form>
      </Form>
    </div>
  );
};

export default EditServerForm;