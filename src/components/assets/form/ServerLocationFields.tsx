
import React from 'react';
import { Control, useWatch } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ServerFormValues } from './ServerFormSchema';
import { useProjectEnvironments } from '@/hooks/useProjectEnvironments';

interface ServerLocationFieldsProps {
  control: Control<ServerFormValues>;
  projects: any[];
  isLoadingProjects: boolean;
}

const ServerLocationFields: React.FC<ServerLocationFieldsProps> = ({ 
  control, 
  projects, 
  isLoadingProjects 
}) => {
  // Watch the selected project
  const selectedProject = useWatch({
    control,
    name: 'project'
  });

  // Fetch environments for the selected project
  const { data: projectEnvironments = [], isLoading: isLoadingEnvironments } = useProjectEnvironments(
    selectedProject && selectedProject !== 'none' ? selectedProject : null
  );

  // Default environments if no project is selected
  const defaultEnvironments = [
    'production',
    'development', 
    'testing',
    'staging',
    'integration',
    'preproduction',
    'qualification',
    'recette'
  ];

  // Use project environments or default ones
  const availableEnvironments = projectEnvironments.length > 0 ? projectEnvironments : defaultEnvironments;

  const getEnvironmentLabel = (env: string) => {
    const labels: Record<string, string> = {
      production: 'Production',
      development: 'Development',
      testing: 'Testing',
      staging: 'Staging',
      integration: 'Integration',
      preproduction: 'Pre-production',
      qualification: 'Qualification',
      recette: 'Recette'
    };
    return labels[env] || env.charAt(0).toUpperCase() + env.slice(1);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Location & Assignment</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input placeholder="Data Center A, Rack 1" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name="datacenter"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Datacenter</FormLabel>
              <FormControl>
                <Input placeholder="DC-Paris-01" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="assignedTo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Assigned To</FormLabel>
              <FormControl>
                <Input placeholder="System Administrator" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name="migre"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Migration Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select migration status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="yes">Migrated</SelectItem>
                  <SelectItem value="no">Not Migrated</SelectItem>
                  <SelectItem value="pending">Migration Pending</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={control}
        name="project"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Project</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select project (optional)" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="none">No Project</SelectItem>
                {isLoadingProjects ? (
                  <SelectItem value="loading" disabled>Loading projects...</SelectItem>
                ) : (
                  projects.map((project: any) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="environment"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Environment</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select environment" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {isLoadingEnvironments ? (
                  <SelectItem value="loading" disabled>Loading environments...</SelectItem>
                ) : (
                  availableEnvironments.map((env) => (
                    <SelectItem key={env} value={env}>
                      {getEnvironmentLabel(env)}
                      {projectEnvironments.length > 0 && (
                        <span className="text-xs text-muted-foreground ml-2">
                          (existing in project)
                        </span>
                      )}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            <FormMessage />
            {selectedProject && selectedProject !== 'none' && projectEnvironments.length > 0 && (
              <p className="text-xs text-muted-foreground mt-1">
                Showing environments already present in the selected project
              </p>
            )}
          </FormItem>
        )}
      />
    </div>
  );
};

export default ServerLocationFields;
