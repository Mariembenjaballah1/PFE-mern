
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Plus } from 'lucide-react';

interface NewProjectsAlertProps {
  newProjects: string[];
}

const NewProjectsAlert: React.FC<NewProjectsAlertProps> = ({ newProjects }) => {
  if (newProjects.length === 0) return null;

  return (
    <Card className="border-blue-200 bg-blue-50">
      <CardContent className="pt-4">
        <div className="flex items-center gap-2 mb-2">
          <Plus className="h-4 w-4 text-blue-600" />
          <h4 className="font-medium text-blue-800">New Projects Will Be Created</h4>
        </div>
        <div className="text-sm text-blue-700">
          The following projects will be automatically created: <strong>{newProjects.join(', ')}</strong>
        </div>
      </CardContent>
    </Card>
  );
};

export default NewProjectsAlert;
