
import React from 'react';
import { Control, useWatch } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SimpleAssetFormValues } from './SimpleAssetFormSchema';
import { useProjectEnvironments } from '@/hooks/useProjectEnvironments';

interface SimpleAssetFieldsProps {
  control: Control<SimpleAssetFormValues>;
  projects: any[];
  isLoadingProjects: boolean;
}

const SimpleAssetFields: React.FC<SimpleAssetFieldsProps> = ({ 
  control, 
  projects, 
  isLoadingProjects 
}) => {
  // Surveiller le projet sélectionné
  const selectedProject = useWatch({
    control,
    name: 'project'
  });

  // Récupérer les environnements du projet sélectionné
  const { data: projectEnvironments = [], isLoading: isLoadingEnvironments } = useProjectEnvironments(
    selectedProject && selectedProject !== 'none' ? selectedProject : null
  );

  // Environnements par défaut si aucun projet n'est sélectionné
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

  // Utiliser les environnements du projet ou ceux par défaut
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Asset Name</FormLabel>
              <FormControl>
                <Input placeholder="HP LaserJet Pro 400" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Printers">Printer</SelectItem>
                  <SelectItem value="Cameras">Camera</SelectItem>
                  <SelectItem value="Computers">PC/Computer</SelectItem>
                  <SelectItem value="Network Equipment">Network Equipment</SelectItem>
                  <SelectItem value="Mobile Devices">Mobile Device</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="operational">Operational</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="repair">Repair</SelectItem>
                  <SelectItem value="retired">Retired</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input placeholder="Office Building A, Floor 2" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="purchaseDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Purchase Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name="assignedTo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Assigned To</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
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

export default SimpleAssetFields;
