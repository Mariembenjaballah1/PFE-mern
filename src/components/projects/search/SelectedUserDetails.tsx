
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { User, FolderOpen } from 'lucide-react';

interface SelectedUserDetailsProps {
  user: any;
  userProjects: any[];
}

export const SelectedUserDetails: React.FC<SelectedUserDetailsProps> = ({
  user,
  userProjects
}) => {
  return (
    <div className="p-6 border-2 border-primary/20 rounded-lg bg-primary/5">
      <div className="flex items-center gap-2 mb-4">
        <User className="h-5 w-5 text-primary" />
        <h4 className="font-semibold text-lg text-primary">Selected User Details</h4>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm text-muted-foreground">Name:</span>
            <span className="font-semibold">{user.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm text-muted-foreground">Email:</span>
            <span>{user.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm text-muted-foreground">Department:</span>
            <Badge variant="outline">{user.department}</Badge>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm text-muted-foreground">Role:</span>
            <Badge variant="secondary">{user.role}</Badge>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm text-muted-foreground">Project Assignments:</span>
            <Badge variant="default" className="bg-primary">
              {userProjects.length} Active
            </Badge>
          </div>
          
          {userProjects.length > 0 && (
            <div className="space-y-2">
              <span className="font-medium text-sm text-muted-foreground">Projects:</span>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {userProjects.map((project: any) => (
                  <div key={project.id} className="flex items-center gap-2 p-2 bg-background rounded border">
                    <FolderOpen className="h-3 w-3 text-primary" />
                    <span className="text-sm font-medium">{project.name}</span>
                    <Badge variant="outline" className="text-xs ml-auto">
                      {project.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
