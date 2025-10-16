
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import DataValidationService from '@/services/dataValidationService';
import { useToast } from '@/hooks/use-toast';

interface ValidationResult {
  isValid: boolean;
  issues: string[];
  lastChecked: Date;
}

export const useDataValidation = (enableAutoCheck = false) => {
  const [validationResult, setValidationResult] = useState<ValidationResult>({
    isValid: true,
    issues: [],
    lastChecked: new Date()
  });
  const { toast } = useToast();

  // Auto-validate data periodically if enabled
  const { data: validation } = useQuery({
    queryKey: ['data-validation'],
    queryFn: async () => {
      const result = await DataValidationService.validateProjectData();
      return result;
    },
    enabled: enableAutoCheck,
    refetchInterval: 30000, // Check every 30 seconds
    staleTime: 10000
  });

  useEffect(() => {
    if (validation) {
      const newResult = {
        isValid: validation.isValid,
        issues: validation.issues,
        lastChecked: new Date()
      };
      
      setValidationResult(newResult);
      
      // Show toast if issues are found
      if (!validation.isValid && validation.issues.length > 0) {
        toast({
          title: "Data Validation Issues Found",
          description: `${validation.issues.length} issues detected. Check console for details.`,
          variant: "destructive"
        });
        
        console.warn('Data validation issues:', validation.issues);
      }
    }
  }, [validation, toast]);

  const manualValidation = async () => {
    try {
      const result = await DataValidationService.validateProjectData();
      const newResult = {
        isValid: result.isValid,
        issues: result.issues,
        lastChecked: new Date()
      };
      
      setValidationResult(newResult);
      
      if (result.isValid) {
        toast({
          title: "Data Validation Passed",
          description: "All data is consistent and valid.",
          variant: "default"
        });
      } else {
        toast({
          title: "Data Validation Issues",
          description: `Found ${result.issues.length} issues. Check console for details.`,
          variant: "destructive"
        });
        console.warn('Manual validation issues:', result.issues);
      }
      
      return result;
    } catch (error) {
      console.error('Manual validation failed:', error);
      toast({
        title: "Validation Failed",
        description: "Could not validate data. Check console for details.",
        variant: "destructive"
      });
    }
  };

  return {
    validationResult,
    manualValidation,
    isValidating: validation === undefined && enableAutoCheck
  };
};
