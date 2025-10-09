
import React from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FolderOpen, UserPlus, Building } from 'lucide-react';

interface UserCardProps {
  user: any;
  userProjects: any[];
  isSelected: boolean;
  onUserClick: (user: any) => void;
  onAddToProject: (user: any) => void;
}

export const UserCard: React.FC<UserCardProps> = ({
  user,
  userProjects,
  isSelected,
  onUserClick,
  onAddToProject
}) => {
  return (
    <div
      className={`group p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md ${
        isSelected 
          ? 'bg-primary/10 border-primary shadow-lg' 
          : 'border-border hover:border-primary/50 hover:bg-muted/30'
      }`}
      onClick={() => onUserClick(user)}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Avatar className="h-12 w-12 border-2 border-background shadow-sm">
            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
              {user.name.split(' ').map((n: string) => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <div className="font-semibold text-foreground">{user.name}</div>
            <div className="text-sm text-muted-foreground flex items-center gap-1">
              <span>📧</span> {user.email}
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                <Building className="h-3 w-3 mr-1" />
                {user.department}
              </Badge>
              <Badge variant="secondary" className="text-xs">
                {user.role}
              </Badge>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col items-end gap-3">
          {/* Project Count with Clear Label */}
          <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg border">
            <FolderOpen className="h-4 w-4 text-primary" />
            <div className="text-center">
              <div className="text-lg font-bold text-primary">{userProjects.length}</div>
              <div className="text-xs text-muted-foreground">Project{userProjects.length !== 1 ? 's' : ''}</div>
            </div>
          </div>
          
          {/* Add to Project Button */}
          <Button
            size="sm"
            variant={isSelected ? "default" : "outline"}
            onClick={(e) => {
              e.stopPropagation();
              onAddToProject(user);
            }}
            className="text-xs transition-all duration-200 group-hover:shadow-sm"
          >
            <UserPlus className="h-3 w-3 mr-1" />
            Add to Project
          </Button>
        </div>
      </div>
    </div>
  );
};
