
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Button } from '@/components/ui/button';
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
import { Project } from '@/types/asset';
import { AssignProjectFormValues } from './assignProjectTypes';

interface ProjectSelectionFieldProps {
  form: UseFormReturn<AssignProjectFormValues>;
  projects: Project[];
  isSubmitting: boolean;
  newProject: string;
  setNewProject: (value: string) => void;
  isAddingNewProject: boolean;
  toggleAddNewProject: () => void;
}

const ProjectSelectionField: React.FC<ProjectSelectionFieldProps> = ({
  form,
  projects,
  isSubmitting,
  newProject,
  setNewProject,
  isAddingNewProject,
  toggleAddNewProject
}) => {
  // Filter out projects without valid IDs to prevent empty string values
  const validProjects = projects.filter(project => project.id && project.id.trim() !== '');

  return (
    <div className="space-y-4">
      {!isAddingNewProject ? (
        <FormField
          control={form.control}
          name="project"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={isSubmitting}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a project" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {validProjects.map((project) => (
                    <SelectItem key={project.id} value={project.id!}>
                      {project.name}
                    </SelectItem>
                  ))}
                  {validProjects.length === 0 && (
                    <SelectItem key="no-projects" value="no-projects" disabled>
                      No projects found
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      ) : (
        <FormItem>
          <FormLabel>New Project Name</FormLabel>
          <Input
            value={newProject}
            onChange={(e) => setNewProject(e.target.value)}
            placeholder="Enter new project name"
            disabled={isSubmitting}
          />
        </FormItem>
      )}
      
      <Button 
        type="button" 
        variant="link" 
        onClick={toggleAddNewProject}
        className="px-0"
      >
        {isAddingNewProject ? "Select existing project" : "Create new project"}
      </Button>
    </div>
  );
};

export default ProjectSelectionField;
