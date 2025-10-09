
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Asset } from '@/types/asset';
import { assetFormSchema, AssetFormValues } from './AssetFormSchema';
import { useAssetFormData } from './useAssetFormData';
import { useAssetFormSubmission } from './useAssetFormSubmission';

interface UseAssetFormProps {
  onSuccess?: () => void;
  initialData?: Asset;
  isEditMode?: boolean;
}

export const useAssetForm = ({ onSuccess, initialData, isEditMode = false }: UseAssetFormProps) => {
  // Get data fetching logic
  const {
    users,
    projects,
    isLoadingUsers,
    isLoadingProjects
  } = useAssetFormData();
  
  // Helper function to get project ID as string
  const getProjectId = (project: string | { _id: string; name: string } | { id: string; name: string } | null): string => {
    if (!project) return 'none';
    if (typeof project === 'string') return project;
    if ('_id' in project) return project._id;
    if ('id' in project) return project.id;
    return 'none';
  };
  
  const form = useForm<AssetFormValues>({
    resolver: zodResolver(assetFormSchema),
    defaultValues: {
      name: '',
      category: '',
      status: 'operational',
      location: '',
      purchaseDate: new Date().toISOString().split('T')[0],
      assignedTo: 'Unassigned',
      project: 'none',
    },
  });

  // Get form submission logic
  const { onSubmit } = useAssetFormSubmission({
    onSuccess,
    initialData,
    isEditMode,
    resetForm: form.reset
  });

  // If in edit mode and initialData is provided, populate the form
  useEffect(() => {
    if (isEditMode && initialData) {
      console.log('Populating form with initial data:', initialData);
      
      const formData = {
        name: initialData.name,
        category: initialData.category,
        status: initialData.status,
        location: initialData.location,
        purchaseDate: new Date(initialData.purchaseDate).toISOString().split('T')[0],
        assignedTo: initialData.assignedTo || 'Unassigned',
        project: getProjectId(initialData.project),
      };
      
      console.log('Form data being set:', formData);
      form.reset(formData);
    }
  }, [form, initialData, isEditMode]);

  return {
    form,
    users,
    projects,
    isLoadingUsers,
    isLoadingProjects,
    onSubmit,
    isEditMode
  };
};
