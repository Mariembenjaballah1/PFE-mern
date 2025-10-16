
import React from 'react';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import { useServerForm } from './form/useServerForm';
import ServerBasicFields from './form/ServerBasicFields';
import ServerNetworkFields from './form/ServerNetworkFields';
import ServerHardwareFields from './form/ServerHardwareFields';
import ServerLocationFields from './form/ServerLocationFields';
import ServerServiceFields from './form/ServerServiceFields';

interface ServerFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

const ServerForm: React.FC<ServerFormProps> = ({ onSuccess, onCancel }) => {
  const { form, projects, isLoadingProjects, onSubmit } = useServerForm({ onSuccess });
  
  return (
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
          <Button type="submit">Add Server</Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default ServerForm;
