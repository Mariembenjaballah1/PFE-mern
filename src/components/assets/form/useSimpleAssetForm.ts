
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { createAsset, CreateAssetData } from '@/services/assets/assetBasicOperations';
import { fetchProjects } from '@/services/projectApi';
import { simpleAssetFormSchema, SimpleAssetFormValues } from './SimpleAssetFormSchema';

interface UseSimpleAssetFormProps {
  onSuccess?: () => void;
}

export const useSimpleAssetForm = ({ onSuccess }: UseSimpleAssetFormProps) => {
  const { toast } = useToast();

  // Fetch projects
  const { data: projects = [], isLoading: isLoadingProjects } = useQuery({
    queryKey: ['projects'],
    queryFn: fetchProjects,
    staleTime: 60000, // 1 minute
  });

  const form = useForm<SimpleAssetFormValues>({
    resolver: zodResolver(simpleAssetFormSchema),
    defaultValues: {
      name: '',
      category: '',
      status: 'operational',
      location: '',
      purchaseDate: new Date().toISOString().split('T')[0],
      assignedTo: '',
      project: 'none',
      environment: 'production',
    },
  });

  const onSubmit = async (data: SimpleAssetFormValues) => {
    try {
      console.log('Simple asset form submission data:', data);
      
      const createData: CreateAssetData = {
        name: data.name,
        category: data.category,
        status: data.status,
        location: data.location,
        purchaseDate: data.purchaseDate,
        assignedTo: data.assignedTo || 'Unassigned',
        project: data.project === 'none' ? null : data.project,
        additionalData: {
          environment: data.environment || 'production'
        }
      };
      
      console.log('Creating simple asset data:', createData);
      
      const createdAsset = await createAsset(createData);
      console.log('Simple asset created successfully:', createdAsset);
      
      toast({
        title: 'Success',
        description: `Asset "${data.name}" has been created successfully`,
        variant: 'default'
      });
      
      form.reset();
      
      if (onSuccess) {
        console.log('Calling onSuccess callback');
        onSuccess();
      }
    } catch (error: any) {
      console.error('Simple asset submission error:', error);
      console.error('Error details:', error.response?.data);
      
      const errorMessage = error.response?.data?.error || 
                          error.response?.data?.message || 
                          error.message || 
                          'Failed to create asset';
      
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  };

  return {
    form,
    projects,
    isLoadingProjects,
    onSubmit
  };
};
