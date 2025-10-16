
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertTriangle, RefreshCw } from 'lucide-react';
import { useDataValidation } from '@/hooks/useDataValidation';

export const DataValidationButton: React.FC = () => {
  const { validationResult, manualValidation, isValidating } = useDataValidation();

  return (
    <div className="flex items-center gap-3">
      <Button
        variant="outline"
        size="sm"
        onClick={manualValidation}
        disabled={isValidating}
        className="flex items-center gap-2"
      >
        <RefreshCw className={`h-4 w-4 ${isValidating ? 'animate-spin' : ''}`} />
        Validate Data
      </Button>
      
      <Badge 
        variant={validationResult.isValid ? "default" : "destructive"}
        className="flex items-center gap-1"
      >
        {validationResult.isValid ? (
          <>
            <CheckCircle className="h-3 w-3" />
            Data Valid
          </>
        ) : (
          <>
            <AlertTriangle className="h-3 w-3" />
            {validationResult.issues.length} Issues
          </>
        )}
      </Badge>
      
      {validationResult.lastChecked && (
        <span className="text-xs text-muted-foreground">
          Last checked: {validationResult.lastChecked.toLocaleTimeString()}
        </span>
      )}
    </div>
  );
};
