
import React from 'react';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { useAssignProjectForm } from './assign/useAssignProjectForm';
import ProjectSelectionField from './assign/ProjectSelectionField';
import ResourceAllocationFields from './assign/ResourceAllocationFields';
import { AssignProjectFormProps } from './assign/assignProjectTypes';

const AssignProjectForm: React.FC<AssignProjectFormProps> = ({ asset, onCancel, onSuccess }) => {
  const {
    form,
    projects,
    isSubmitting,
    newProject,
    setNewProject,
    isAddingNewProject,
    onSubmit,
    toggleAddNewProject
  } = useAssignProjectForm({ asset, onSuccess });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Assign to Project</h3>
          <p className="text-sm text-muted-foreground">
            Assign this asset to a project and allocate resources
          </p>
          
          <ProjectSelectionField
            form={form}
            projects={projects}
            isSubmitting={isSubmitting}
            newProject={newProject}
            setNewProject={setNewProject}
            isAddingNewProject={isAddingNewProject}
            toggleAddNewProject={toggleAddNewProject}
          />
          
          <ResourceAllocationFields form={form} />
        </div>

        <div className="flex justify-between">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting || (isAddingNewProject && !newProject)}
          >
            {isSubmitting ? 'Assigning...' : 'Assign to Project'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AssignProjectForm;
