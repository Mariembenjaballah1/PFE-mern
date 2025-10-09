
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { FolderOpen, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const ProjectsListEmpty: React.FC = () => {
  return (
    <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-blue-50/30 backdrop-blur-sm">
      <CardContent className="flex flex-col items-center justify-center p-16 text-center space-y-6">
        <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mb-4">
          <FolderOpen className="h-12 w-12 text-blue-600" />
        </div>
        
        <div className="space-y-3">
          <h3 className="text-2xl font-bold text-gray-900">No Projects Yet</h3>
          <p className="text-lg text-muted-foreground max-w-md">
            Get started by creating your first project. Organize your assets, manage teams, and track progress all in one place.
          </p>
        </div>
        
        <div className="pt-4">
          <Button 
            size="lg" 
            className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <Plus className="h-5 w-5" />
            Create Your First Project
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
