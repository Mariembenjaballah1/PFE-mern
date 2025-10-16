
import { createAsset } from '@/services/assetApi';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

export const useServerUpload = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const uploadServers = async (parsedServers: any[]) => {
    try {
      console.log('=== STARTING SERVER UPLOAD PROCESS ===');
      
      let successCount = 0;
      let errorCount = 0;
      const errors: string[] = [];
      
      for (const serverData of parsedServers) {
        try {
          console.log('=== CREATING SERVER ASSET ===');
          console.log('Full server data object:', serverData);
          console.log('Server vmInfo to save:', serverData.vmInfo);
          console.log('Server specs to save:', serverData.specs);
          console.log('Server additionalData to save:', serverData.additionalData);
          console.log('Server resources to save:', serverData.resources);
          
          // Create the asset with COMPLETE validated data - ensure ALL fields are explicitly included
          const assetPayload = {
            name: serverData.name,
            category: serverData.category,
            status: serverData.status,
            location: serverData.location,
            purchaseDate: serverData.purchaseDate,
            assignedTo: serverData.assignedTo,
            project: serverData.project,
            projectName: serverData.projectName,
            resources: serverData.resources,
            // CRITICAL: Explicitly ensure vmInfo, specs and additionalData are included
            vmInfo: serverData.vmInfo || {},
            specs: serverData.specs || {},
            additionalData: serverData.additionalData || {}
          };
          
          console.log('=== COMPLETE ASSET PAYLOAD FOR CREATION ===');
          console.log('Full payload:', JSON.stringify(assetPayload, null, 2));
          console.log('Payload vmInfo keys:', Object.keys(assetPayload.vmInfo));
          console.log('Payload specs keys:', Object.keys(assetPayload.specs));
          console.log('Payload additionalData keys:', Object.keys(assetPayload.additionalData));
          console.log('=== SENDING TO API ===');
          
          const createdAsset = await createAsset(assetPayload);
          console.log('=== ASSET CREATED SUCCESSFULLY ===');
          console.log('Created asset:', createdAsset);
          console.log('Created asset vmInfo:', createdAsset.vmInfo);
          console.log('Created asset specs:', createdAsset.specs);
          console.log('Created asset additionalData:', createdAsset.additionalData);
          
          successCount++;
          console.log(`Successfully created server: ${serverData.name}`);
        } catch (error) {
          console.error(`Error creating server ${serverData.name}:`, error);
          errorCount++;
          errors.push(`${serverData.name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }
      
      console.log('=== UPLOAD PROCESS COMPLETE ===');
      console.log(`Success: ${successCount}, Errors: ${errorCount}`);
      
      // Show results and refresh data
      if (successCount > 0) {
        toast({
          title: "Upload completed",
          description: `Successfully imported ${successCount} servers${errorCount > 0 ? ` (${errorCount} failed)` : ''}`,
        });
        
        // Refresh the assets data
        queryClient.invalidateQueries({ queryKey: ['assets'] });
        queryClient.invalidateQueries({ queryKey: ['assets', 'Servers'] });
      }
      
      if (errorCount > 0) {
        console.error('Upload errors:', errors);
        toast({
          title: `${errorCount} servers failed to import`,
          description: errors.slice(0, 3).join(', ') + (errors.length > 3 ? '...' : ''),
          variant: "destructive"
        });
      }
      
      return { successCount, errorCount };
    } catch (error) {
      console.error('Error during upload:', error);
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive"
      });
      throw error;
    }
  };

  return { uploadServers };
};
