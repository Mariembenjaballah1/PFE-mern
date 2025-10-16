
import { useQuery } from '@tanstack/react-query';
import { fetchUsers } from '@/services/userApi';
import { fetchProjects } from '@/services/projectApi';

export const useAssetFormData = () => {
  // Fetch users for the assignedTo dropdown
  const { data: users = [], isLoading: isLoadingUsers } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
    staleTime: 60000, // 1 minute
  });
  
  // Fetch projects for the project dropdown
  const { data: projects = [], isLoading: isLoadingProjects } = useQuery({
    queryKey: ['projects'],
    queryFn: fetchProjects,
    staleTime: 60000, // 1 minute
  });

  return {
    users,
    projects,
    isLoadingUsers,
    isLoadingProjects
  };
};
