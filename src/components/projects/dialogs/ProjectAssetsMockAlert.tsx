
import React from 'react';
import { Info } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { isMockProject } from '../utils/projectUtils';

interface ProjectAssetsMockAlertProps {
  projectId: string | undefined;
}

export const ProjectAssetsMockAlert: React.FC<ProjectAssetsMockAlertProps> = ({ projectId }) => {
  if (!isMockProject(projectId)) return null;

  return (
    <Alert className="mb-4 bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800">
      <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
      <AlertDescription className="text-blue-700 dark:text-blue-300">
        This is a demo project. To see asset assignments, create a new project and assign assets to it through the Assets page.
      </AlertDescription>
    </Alert>
  );
};
