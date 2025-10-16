import { useMemo } from 'react';

// This hook is no longer needed since resource quotas have been removed
// Keeping as empty hook to prevent breaking changes
export const useProjectResourceData = () => {
  const projectResourceData = useMemo(() => [], []);

  return { 
    projectResourceData, 
    isLoading: false, 
    error: null
  };
};
