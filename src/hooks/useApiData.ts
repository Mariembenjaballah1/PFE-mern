
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

/**
 * A custom hook for handling API data fetching with consistent loading, error, and empty states
 * @param queryKey - The key to use for React Query caching
 * @param queryFn - The function to fetch data
 * @param options - Additional React Query options
 * @returns Object with data, loading states, error states, and refetch function
 */
export function useApiData<T>(
  queryKey: (string | Record<string, any>)[],
  queryFn: () => Promise<T>,
  options: {
    enabled?: boolean;
    refetchInterval?: number | false;
    refetchOnWindowFocus?: boolean;
    select?: (data: any) => T;
    onSuccess?: (data: T) => void;
    errorMessage?: string;
    mockData?: T;
  } = {}
) {
  const { toast } = useToast();
  const [error, setError] = useState<Error | null>(null);
  
  const {
    data,
    isLoading,
    isFetching,
    refetch,
    isError: queryError
  } = useQuery({
    queryKey,
    queryFn,
    enabled: options.enabled !== false,
    refetchInterval: options.refetchInterval,
    refetchOnWindowFocus: options.refetchOnWindowFocus,
    select: options.select,
    meta: {
      onError: (error: any) => {
        console.error(`Error fetching ${queryKey[0]}:`, error);
        setError(error);
        
        if (options.errorMessage) {
          toast({
            title: "Error",
            description: options.errorMessage,
            variant: "destructive"
          });
        }
      },
      onSuccess: options.onSuccess
    }
  });

  const isError = queryError || !!error;
  const isEmpty = !isLoading && !isError && (!data || (Array.isArray(data) && data.length === 0));
  
  // If there's an error and mockData is provided, use it as fallback
  const safeData = isError && options.mockData ? options.mockData : data;

  return {
    data: safeData,
    isLoading,
    isFetching,
    isError,
    isEmpty,
    error,
    refetch
  };
}

export default useApiData;
