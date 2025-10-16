
import { parseCSVServers } from '@/utils/csv/csvParser';
import { validateServerData } from '@/utils/csv/serverDataValidator';
import { fetchProjects } from '@/services/projectApi';
import { useToast } from '@/hooks/use-toast';

export const useCSVProcessing = () => {
  const { toast } = useToast();

  const processCSVFile = async (file: File) => {
    try {
      console.log('=== STARTING CSV FILE PROCESSING ===');
      
      // Parse the CSV file
      const rawServers = await parseCSVServers(file);
      console.log('Raw servers from CSV:', rawServers);
      
      // Get existing projects to match against
      const existingProjects = await fetchProjects();
      console.log('Existing projects:', existingProjects);
      
      // Validate and transform server data
      const validatedServers = rawServers.map(rawServer => {
        const validated = validateServerData(rawServer, existingProjects);
        console.log('Validated server data:', validated);
        console.log('Validated server vmInfo:', validated.vmInfo);
        console.log('Validated server specs:', validated.specs);
        console.log('Validated server additionalData:', validated.additionalData);
        return validated;
      });
      
      console.log('All validated servers:', validatedServers);
      
      // Find new projects that need to be created
      const uniqueProjectNames = [...new Set(validatedServers.map(s => s.projectName))];
      const existingProjectNames = existingProjects.map(p => p.name);
      const projectsToCreate = uniqueProjectNames.filter(name => 
        name && name !== 'Unassigned' && !existingProjectNames.includes(name)
      );
      
      console.log('New projects to create:', projectsToCreate);
      
      return {
        validatedServers,
        newProjects: projectsToCreate
      };
    } catch (error) {
      console.error('Error processing CSV file:', error);
      toast({
        title: "Error processing file",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive"
      });
      throw error;
    }
  };

  return { processCSVFile };
};
