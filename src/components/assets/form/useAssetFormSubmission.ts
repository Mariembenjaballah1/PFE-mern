
import { useToast } from '@/hooks/use-toast';
import { createAsset, updateAsset, CreateAssetData, UpdateAssetData } from '@/services/assets/assetBasicOperations';
import { Asset } from '@/types/asset';
import { AssetFormValues } from './AssetFormSchema';

interface UseAssetFormSubmissionProps {
  onSuccess?: () => void;
  initialData?: Asset;
  isEditMode?: boolean;
  resetForm: () => void;
}

export const useAssetFormSubmission = ({ 
  onSuccess, 
  initialData, 
  isEditMode = false, 
  resetForm 
}: UseAssetFormSubmissionProps) => {
  const { toast } = useToast();

  const onSubmit = async (data: AssetFormValues) => {
    try {
      console.log('Form submission data:', data);
      console.log('Is edit mode:', isEditMode);
      console.log('Initial data:', initialData);
      
      if (isEditMode && initialData) {
        // Update existing asset - use the correct ID field
        const assetId = initialData.id || initialData._id;
        
        if (!assetId) {
          throw new Error('Asset ID is missing');
        }
        
        const updateData: UpdateAssetData = {
          id: assetId as string,
          name: data.name,
          category: data.category,
          status: data.status,
          location: data.location,
          purchaseDate: data.purchaseDate,
          assignedTo: data.assignedTo || 'Unassigned',
          project: data.project === 'none' ? null : data.project,
        };
        
        console.log('Updating asset with ID:', assetId);
        console.log('Update data:', updateData);
        
        const updatedAsset = await updateAsset(updateData);
        console.log('Asset updated successfully:', updatedAsset);
        
        toast({
          title: 'Success',
          description: `Asset "${data.name}" has been updated successfully`,
          variant: 'default'
        });
      } else {
        // Create new asset - provide all required fields
        const createData: CreateAssetData = {
          name: data.name,
          category: data.category,
          status: data.status,
          location: data.location,
          purchaseDate: data.purchaseDate,
          assignedTo: data.assignedTo || 'Unassigned',
          project: data.project === 'none' ? null : data.project,
        };
        
        console.log('Creating asset data:', createData);
        
        const createdAsset = await createAsset(createData);
        console.log('Asset created successfully:', createdAsset);
        
        toast({
          title: 'Success',
          description: `Asset "${data.name}" has been created successfully`,
          variant: 'default'
        });
        resetForm();
      }
      
      if (onSuccess) {
        console.log('Calling onSuccess callback');
        onSuccess();
      }
    } catch (error: any) {
      console.error('Asset submission error:', error);
      console.error('Error details:', error.response?.data);
      
      const errorMessage = error.response?.data?.error || 
                          error.response?.data?.message || 
                          error.message || 
                          `Failed to ${isEditMode ? 'update' : 'create'} asset`;
      
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  };

  return { onSubmit };
};
